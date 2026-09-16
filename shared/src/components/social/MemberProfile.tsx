"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Lock, Settings } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { getMemberOverview, listPostsBy, socialError, type MemberOverview, type Post } from "@/lib/social";
import { useKitchen } from "@/lib/store/kitchen";
import { normalizeUsername } from "@/lib/username";
import { plural } from "@/lib/utils";
import { ClocheIllustration } from "@/components/illustrations/Cloche";
import { ButtonLink } from "@/components/ui/Button";
import { EASE_CHEF } from "@/components/ui/Reveal";
import { FriendActions, MemberAvatar, PostCard, UsernameSetup } from "./parts";

export function MemberProfile() {
  const { user } = useKitchen();
  const params = useSearchParams();
  const username = normalizeUsername(params.get("u") ?? "");
  const [overview, setOverview] = useState<MemberOverview | null | undefined>(undefined);
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!username) return setOverview(null);
    try {
      const member = await getMemberOverview(username);
      setOverview(member);
      // De database geeft posts alleen vrij aan jezelf en vrienden; bij anderen komt er niets terug.
      setPosts(member && (member.relationship === "self" || member.relationship === "friends") ? await listPostsBy(member.id) : []);
    } catch (err) {
      setError(socialError(err, "Dit profiel kon niet worden geladen."));
    }
  }, [username]);

  useEffect(() => {
    if (user?.username) void load();
  }, [user?.username, load]);

  if (!user) return null;
  if (!user.username) {
    return (
      <div className="container-page pb-32 pt-[112px] lg:pb-24">
        <UsernameSetup title="Kies eerst je username" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-page flex min-h-[70vh] flex-col items-center justify-center pb-32 pt-[112px] text-center">
        <p className="font-serif text-4xl">Er ging iets mis</p>
        <p className="mt-3 text-muted">{error}</p>
      </div>
    );
  }

  if (overview === null) {
    return (
      <div className="container-page flex min-h-[80vh] flex-col items-center justify-center pb-32 pt-[112px] text-center">
        <div className="size-44">
          <ClocheIllustration label="@" />
        </div>
        <h1 className="mt-6 font-serif text-5xl">Deze kok bestaat niet</h1>
        <p className="mt-3 max-w-sm text-muted">{username ? `Er is geen account met de username @${username}.` : "Er is geen username opgegeven."}</p>
        <ButtonLink href="/vrienden?tab=vrienden" className="mt-8">
          Zoek vrienden
        </ButtonLink>
      </div>
    );
  }

  if (!overview) {
    return (
      <div className="grid min-h-[80vh] place-items-center pt-[72px]">
        <div className="size-14 animate-pulse rounded-full bg-brass/25" aria-label="Laden" />
      </div>
    );
  }

  const canSeePosts = overview.relationship === "self" || overview.relationship === "friends";

  return (
    <div className="pt-[72px]">
      <section className="paper-grain border-b border-line bg-paper">
        <div className="container-page pb-10 pt-8 lg:pt-12">
          <div className="mx-auto max-w-3xl">
          <Link href="/vrienden?tab=vrienden" className="-my-2 inline-flex min-h-11 items-center gap-1.5 py-2 text-[13px] font-semibold text-ink hover:text-brass">
            <ArrowLeft className="size-3.5" /> Vrienden
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE_CHEF }}
            className="mt-4 flex flex-col gap-6 sm:flex-row sm:items-center"
          >
            <MemberAvatar member={overview} size="xl" className="size-24 text-3xl ring-4 ring-cream sm:size-28 sm:text-4xl" />
            <div className="min-w-0 flex-1">
              <h1 className="break-words font-serif text-[clamp(2.4rem,6vw,4rem)] leading-[0.95]">{overview.displayName}</h1>
              <p className="mt-2 text-[16px] font-semibold text-brass">@{overview.username}</p>
              <p className="mt-2 text-[14px] text-muted">{plural(overview.friendCount, "vriend", "vrienden")}</p>
              {overview.bio && <p className="mt-3 max-w-lg font-serif text-[1.2rem] italic leading-snug text-ink-soft">{overview.bio}</p>}
            </div>
          </motion.div>
          <div className="mt-6 flex flex-wrap gap-2">
            {overview.relationship === "self" ? (
              <ButtonLink href="/profiel?tab=instellingen" variant="secondary">
                <Settings className="size-4" /> Profiel bewerken
              </ButtonLink>
            ) : (
              <FriendActions member={overview} relationship={overview.relationship} requestId={overview.requestId} onChange={load} size="md" />
            )}
          </div>
          </div>
        </div>
      </section>

      <section className="container-page pb-32 pt-8 lg:pb-24">
        <div className="mx-auto max-w-3xl">
        {canSeePosts ? (
          posts === null ? (
            <div className="h-40 animate-pulse rounded-[28px] bg-paper" />
          ) : posts.length === 0 ? (
            <p className="rounded-[28px] border border-dashed border-line px-6 py-12 text-center text-muted">
              {overview.relationship === "self" ? "Je hebt nog niets gedeeld." : `${overview.displayName} heeft nog niets gedeeld.`}
            </p>
          ) : (
            <div className="space-y-5">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} onDeleted={(id) => setPosts((current) => (current ?? []).filter((p) => p.id !== id))} />
              ))}
            </div>
          )
        ) : (
          <div className="rounded-[28px] border border-line bg-cream px-6 py-12 text-center">
            <span className="mx-auto grid size-12 place-items-center rounded-full bg-ink text-ivory">
              <Lock className="size-5" />
            </span>
            <p className="mt-4 font-serif text-[1.8rem] leading-tight">Posts zijn alleen voor vrienden</p>
            <p className="mx-auto mt-2 max-w-sm text-[14.5px] leading-relaxed text-muted">
              {overview.relationship === "outgoing"
                ? `Zodra ${overview.displayName} je verzoek accepteert, zie je hier de posts.`
                : overview.relationship === "incoming"
                  ? `Accepteer het verzoek van ${overview.displayName} om elkaars posts te zien.`
                  : `Voeg ${overview.displayName} toe als vriend om de posts te zien.`}
            </p>
          </div>
        )}
        </div>
      </section>
    </div>
  );
}
