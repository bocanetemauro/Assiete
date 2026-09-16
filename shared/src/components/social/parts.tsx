"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AtSign, Check, ChefHat, Clock, Lock, Trash, UserCheck, UserPlus, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import {
  acceptFriendRequest,
  createPost,
  deletePost,
  formatPostTime,
  removeFriendship,
  sendFriendRequest,
  socialError,
  type Member,
  type Post,
  type Relationship,
} from "@/lib/social";
import { useKitchen } from "@/lib/store/kitchen";
import { useSocial } from "@/lib/store/social";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { FieldError, Input, Label, Textarea } from "@/components/ui/Field";
import { EASE_CHEF } from "@/components/ui/Reveal";
import { useToast } from "@/components/ui/Toast";
import { ImageUpload } from "@/components/upload/ImageUpload";
import { UsernameField, type UsernameStatus } from "./UsernameField";

export const memberHref = (username: string | null) => (username ? `/kok?u=${encodeURIComponent(username)}` : "/vrienden");

export function MemberAvatar({ member, size = "md", className }: { member: Member; size?: "sm" | "md" | "lg" | "xl"; className?: string }) {
  return <Avatar user={{ name: member.displayName, avatarUrl: member.avatarUrl }} size={size} className={className} />;
}

/** Naam, @username en foto; tik opent het profiel. Rechts ruimte voor acties. */
export function MemberRow({ member, children, note }: { member: Member; children?: ReactNode; note?: ReactNode }) {
  return (
    <li className="flex flex-wrap items-center gap-x-4 gap-y-3 rounded-[22px] border border-line bg-cream p-3 sm:flex-nowrap sm:p-4">
      <Link href={memberHref(member.username)} className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl">
        <MemberAvatar member={member} />
        <span className="min-w-0">
          <span className="block truncate font-semibold">{member.displayName}</span>
          <span className="block truncate text-[13.5px] text-muted">{member.username ? `@${member.username}` : "nog geen username"}</span>
          {note && <span className="mt-0.5 block text-[12.5px] text-muted/80">{note}</span>}
        </span>
      </Link>
      {children && <div className="flex w-full shrink-0 gap-2 sm:w-auto [&>*]:flex-1 sm:[&>*]:flex-none">{children}</div>}
    </li>
  );
}

/**
 * De juiste knop(pen) voor jouw relatie met iemand. `onChange` krijgt de nieuwe
 * relatie, zodat lijsten en tellers direct kloppen.
 */
export function FriendActions({
  member,
  relationship,
  requestId,
  onChange,
  size = "sm",
}: {
  member: Member;
  relationship: Relationship;
  requestId: string | null;
  onChange: () => void | Promise<void>;
  size?: "sm" | "md";
}) {
  const toast = useToast();
  const { refreshIncoming } = useSocial();
  const [busy, setBusy] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);

  useEffect(() => {
    if (!confirmRemove) return;
    const timer = window.setTimeout(() => setConfirmRemove(false), 4000);
    return () => window.clearTimeout(timer);
  }, [confirmRemove]);

  const run = async (action: () => Promise<unknown>, success?: string) => {
    setBusy(true);
    try {
      await action();
      if (success) toast({ title: success, tone: "success" });
      await Promise.all([onChange(), refreshIncoming()]);
    } catch (error) {
      toast({ title: "Dat lukte niet", description: socialError(error) });
    } finally {
      setBusy(false);
      setConfirmRemove(false);
    }
  };

  if (relationship === "self") return null;

  if (relationship === "none") {
    return (
      <Button
        size={size}
        disabled={busy || !member.username}
        onClick={() =>
          run(async () => {
            const result = await sendFriendRequest(member.username!);
            toast(
              result === "friends"
                ? { title: `Jij en ${member.displayName} zijn nu vrienden`, tone: "success" }
                : { title: "Vriendschapsverzoek verstuurd", description: `${member.displayName} ziet je verzoek bij Verzoeken.`, tone: "success" },
            );
          })
        }
      >
        <UserPlus className="size-4" /> Vriend toevoegen
      </Button>
    );
  }

  if (relationship === "incoming" && requestId) {
    return (
      <>
        <Button size={size} disabled={busy} onClick={() => run(() => acceptFriendRequest(requestId), `Jij en ${member.displayName} zijn nu vrienden`)}>
          <Check className="size-4" /> Accepteren
        </Button>
        <Button size={size} variant="secondary" disabled={busy} onClick={() => run(() => removeFriendship(requestId), "Verzoek geweigerd")}>
          <X className="size-4" /> Weigeren
        </Button>
      </>
    );
  }

  if (relationship === "outgoing" && requestId) {
    return (
      <Button size={size} variant="secondary" disabled={busy} onClick={() => run(() => removeFriendship(requestId), "Verzoek ingetrokken")}>
        <Clock className="size-4" /> Verzoek verstuurd · annuleren
      </Button>
    );
  }

  if (relationship === "friends" && requestId) {
    return confirmRemove ? (
      <Button size={size} variant="secondary" disabled={busy} className="border-bordeaux/40 text-bordeaux" onClick={() => run(() => removeFriendship(requestId), `${member.displayName} is geen vriend meer`)}>
        <Trash className="size-4" /> Zeker weten? Verwijderen
      </Button>
    ) : (
      <Button size={size} variant="secondary" disabled={busy} onClick={() => setConfirmRemove(true)} aria-label={`Vriendschap met ${member.displayName} beheren`}>
        <UserCheck className="size-4 text-sage" /> Vrienden
      </Button>
    );
  }

  return null;
}

/* ------------------------------------------------------------------ */
/* Posts                                                                */
/* ------------------------------------------------------------------ */

export function PostCard({ post, onDeleted }: { post: Post; onDeleted?: (id: string) => void }) {
  const { user } = useKitchen();
  const toast = useToast();
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const own = user?.id === post.author.id;

  useEffect(() => {
    if (!confirm) return;
    const timer = window.setTimeout(() => setConfirm(false), 4000);
    return () => window.clearTimeout(timer);
  }, [confirm]);

  const remove = async () => {
    setBusy(true);
    try {
      await deletePost(post);
      onDeleted?.(post.id);
      toast({ title: "Post verwijderd" });
    } catch (error) {
      toast({ title: "Verwijderen lukte niet", description: socialError(error) });
      setBusy(false);
    }
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.5, ease: EASE_CHEF }}
      className="overflow-hidden rounded-[28px] border border-line bg-cream shadow-card"
    >
      <header className="flex items-center gap-3 p-4 sm:p-5">
        <Link href={memberHref(post.author.username)} className="flex min-w-0 flex-1 items-center gap-3">
          <MemberAvatar member={post.author} />
          <span className="min-w-0">
            <span className="block truncate font-semibold leading-tight">{post.author.displayName}</span>
            <span className="block truncate text-[13px] text-muted">
              {post.author.username && <>@{post.author.username} · </>}
              <time dateTime={post.createdAt}>{formatPostTime(post.createdAt)}</time>
            </span>
          </span>
        </Link>
        {own && (
          <button
            type="button"
            onClick={() => (confirm ? void remove() : setConfirm(true))}
            disabled={busy}
            className={cn(
              "inline-flex h-11 shrink-0 items-center gap-1.5 rounded-full px-3 text-[13px] font-semibold transition",
              confirm ? "bg-bordeaux text-ivory" : "text-muted hover:bg-ink/5 hover:text-ink",
            )}
            aria-label={confirm ? "Bevestig verwijderen" : "Post verwijderen"}
          >
            <Trash className="size-4" />
            {confirm && "Verwijderen?"}
          </button>
        )}
      </header>

      {post.body && <p className="whitespace-pre-line break-words px-4 pb-4 text-[15.5px] leading-relaxed text-ink-soft sm:px-5">{post.body}</p>}

      {post.imagePath && (
        <div className="bg-paper">
          {post.imageUrl ? (
            <img src={post.imageUrl} alt={`Foto van ${post.author.displayName}`} className="max-h-[560px] w-full object-cover" loading="lazy" />
          ) : (
            <div className="grid aspect-[4/3] place-items-center text-[13px] text-muted">Foto kon niet worden geladen</div>
          )}
        </div>
      )}

      {post.recipe && (
        <Link href={`/recepten/${post.recipe.slug}`} className="flex items-center gap-3 border-t border-line px-4 py-3 text-[14px] transition hover:bg-paper sm:px-5">
          <ChefHat className="size-4 shrink-0 text-brass" />
          <span className="min-w-0 flex-1 truncate">
            Gemaakt: <span className="font-semibold">{post.recipe.title}</span>
          </span>
        </Link>
      )}
    </motion.article>
  );
}

export function PostComposer({ onPosted }: { onPosted: (post: Post) => void }) {
  const { user } = useKitchen();
  const toast = useToast();
  const [body, setBody] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  if (!user) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim() && !photo) {
      setError("Schrijf iets of voeg een foto toe.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const post = await createPost({ authorId: user.id, body, photo });
      onPosted(post);
      setBody("");
      setPhoto(null);
      toast({ title: "Gedeeld met je vrienden", tone: "success" });
    } catch (err) {
      setError(socialError(err, "Je post kon niet worden geplaatst."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="rounded-[28px] border border-line bg-cream p-4 shadow-card sm:p-5">
      <div className="flex gap-3">
        {/* Wrapper: `hidden` op de avatar zelf zou verliezen van zijn eigen `grid`-klasse. */}
        <span className="hidden sm:block">
          <Avatar user={user} />
        </span>
        <div className="min-w-0 flex-1">
          <label htmlFor="post-body" className="sr-only">
            Wat heb je gekookt?
          </label>
          <Textarea id="post-body" rows={3} maxLength={1000} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Wat heb je gekookt of geleerd?" className="resize-none" />
          <div className="mt-3">
            <ImageUpload value={photo} onChange={setPhoto} compact label="Foto toevoegen" hint="Optioneel" aspect="aspect-[16/9]" />
          </div>
          <FieldError>{error}</FieldError>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <p className="flex items-center gap-1.5 text-[12.5px] text-muted">
              <Lock className="size-3.5" /> Alleen zichtbaar voor jou en je vrienden
            </p>
            <Button type="submit" disabled={busy}>
              {busy ? "Plaatsen…" : "Plaatsen"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* Username kiezen (accounts van vóór het vriendensysteem)              */
/* ------------------------------------------------------------------ */

export function UsernameSetup({ title = "Kies je username" }: { title?: string }) {
  const { user, updateProfile } = useKitchen();
  const toast = useToast();
  const [name, setName] = useState(user?.name ?? "");
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState<UsernameStatus>("idle");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "taken") return setError("Deze username is al bezet. Kies een andere.");
    setBusy(true);
    setError(null);
    const result = await updateProfile({ name, username });
    setBusy(false);
    if (!result.ok) return setError(result.error);
    toast({ title: "Welkom in de keukenkring", description: "Je kunt nu vrienden zoeken en posts delen.", tone: "success" });
  };

  return (
    <form onSubmit={submit} className="mx-auto max-w-lg rounded-[32px] border border-line bg-cream p-6 shadow-card sm:p-8">
      <span className="grid size-12 place-items-center rounded-full bg-ink text-ivory">
        <AtSign className="size-5" />
      </span>
      <h2 className="mt-5 font-serif text-[2.2rem] leading-tight">{title}</h2>
      <p className="mt-2 text-[15px] leading-relaxed text-muted">
        Met je username vinden vrienden je, bijvoorbeeld <strong className="text-ink">@mauro2009</strong>. Je toonbare naam is wat anderen in de app zien.
      </p>
      <div className="mt-6 space-y-5">
        <div>
          <Label htmlFor="setup-name" hint="Zo zien anderen je">
            Toonbare naam
          </Label>
          <Input id="setup-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={80} autoComplete="name" />
        </div>
        <UsernameField id="setup-username" value={username} onChange={setUsername} onStatus={setStatus} />
      </div>
      <FieldError>{error}</FieldError>
      <Button type="submit" size="lg" className="mt-6 w-full" disabled={busy || status === "invalid" || status === "taken" || !username}>
        {busy ? "Opslaan…" : "Opslaan en verder"}
      </Button>
    </form>
  );
}

/** Tabs in dezelfde stijl als de filters in de receptenbibliotheek. */
export function SocialTabs<T extends string>({ tabs, value, onChange }: { tabs: { id: T; label: string; badge?: number }[]; value: T; onChange: (id: T) => void }) {
  return (
    <div role="tablist" aria-label="Onderdelen" className="no-scrollbar -mx-5 flex gap-1 overflow-x-auto px-5 sm:mx-0 sm:px-0">
      {tabs.map((tab) => {
        const active = tab.id === value;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.id)}
            className={cn("relative inline-flex h-11 shrink-0 items-center gap-2 rounded-full px-5 text-[14px] font-semibold transition-colors", active ? "text-ivory" : "text-ink-soft hover:text-ink")}
          >
            {active && <motion.span layoutId="social-tab" className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
            <span className="relative">{tab.label}</span>
            <AnimatePresence>
              {Boolean(tab.badge) && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className={cn("relative grid min-w-5 place-items-center rounded-full px-1.5 text-[11px] leading-5", active ? "bg-brass-soft text-ink" : "bg-brass text-white")}
                >
                  {tab.badge}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        );
      })}
    </div>
  );
}
