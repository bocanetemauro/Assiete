"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Search, Users, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { listFeed, listFriendships, searchMembers, socialError, type Friendship, type Member, type Post, type Relationship } from "@/lib/social";
import { useKitchen } from "@/lib/store/kitchen";
import { useSocial } from "@/lib/store/social";
import { normalizeUsername } from "@/lib/username";
import { Button } from "@/components/ui/Button";
import { EASE_CHEF } from "@/components/ui/Reveal";
import { FriendActions, MemberRow, PostCard, PostComposer, SocialTabs, UsernameSetup } from "./parts";

type Tab = "feed" | "vrienden" | "verzoeken";
const TABS: Tab[] = ["feed", "vrienden", "verzoeken"];

function Empty({ title, body, action }: { title: string; body: string; action?: React.ReactNode }) {
  return (
    <div className="rounded-[28px] border border-dashed border-line px-6 py-12 text-center">
      <span className="mx-auto grid size-12 place-items-center rounded-full bg-paper text-brass">
        <Users className="size-5" />
      </span>
      <p className="mt-4 font-serif text-[1.7rem] leading-tight">{title}</p>
      <p className="mx-auto mt-2 max-w-sm text-[14.5px] leading-relaxed text-muted">{body}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

function Skeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-3" aria-label="Laden">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-20 animate-pulse rounded-[22px] bg-paper" />
      ))}
    </div>
  );
}

function SectionTitle({ children, count }: { children: React.ReactNode; count?: number }) {
  return (
    <h2 className="mb-3 flex items-baseline gap-2 font-serif text-[1.6rem] leading-none">
      {children}
      {count !== undefined && <span className="font-sans text-[13px] font-semibold text-muted">{count}</span>}
    </h2>
  );
}

export function SocialHub() {
  const { user } = useKitchen();
  const { incoming } = useSocial();
  const params = useSearchParams();
  const [tab, setTab] = useState<Tab>(() => (TABS.find((t) => t === params.get("tab")) ?? "feed") as Tab);

  const [friendships, setFriendships] = useState<Friendship[] | null>(null);
  const [feed, setFeed] = useState<Post[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState(() => params.get("zoek") ?? "");
  const [results, setResults] = useState<Member[] | null>(null);
  const [searching, setSearching] = useState(false);

  // Tab in de URL houden, zodat terugknop en links (bv. uit een melding) kloppen.
  useEffect(() => {
    const url = `${window.location.pathname}${tab === "feed" ? "" : `?tab=${tab}`}`;
    window.history.replaceState(window.history.state, "", url);
  }, [tab]);

  const loadFriendships = useCallback(async () => {
    if (!user) return;
    try {
      setFriendships(await listFriendships(user.id));
    } catch (err) {
      setError(socialError(err, "Je vrienden konden niet worden geladen."));
    }
  }, [user]);

  const loadFeed = useCallback(async () => {
    try {
      setFeed(await listFeed());
    } catch (err) {
      setError(socialError(err, "Je feed kon niet worden geladen."));
    }
  }, []);

  useEffect(() => {
    if (!user?.username) return;
    void loadFriendships();
    void loadFeed();
  }, [user?.username, loadFriendships, loadFeed]);

  // Nieuw verzoek binnengekomen terwijl de pagina open is: lijst bijwerken.
  useEffect(() => {
    if (user?.username && friendships) void loadFriendships();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incoming]);

  // Zoeken met een korte pauze na het typen.
  useEffect(() => {
    if (!user) return;
    const term = normalizeUsername(query);
    if (term.length < 2) {
      setResults(null);
      setSearching(false);
      return;
    }
    setSearching(true);
    const timer = window.setTimeout(() => {
      searchMembers(term, user.id)
        .then(setResults)
        .catch(() => setResults([]))
        .finally(() => setSearching(false));
    }, 300);
    return () => window.clearTimeout(timer);
  }, [query, user]);

  const byMember = useMemo(() => new Map((friendships ?? []).map((f) => [f.other.id, f])), [friendships]);
  const relationOf = (member: Member): { relationship: Relationship; requestId: string | null } => {
    const f = byMember.get(member.id);
    if (!f) return { relationship: "none", requestId: null };
    return { relationship: f.status === "accepted" ? "friends" : f.direction, requestId: f.id };
  };

  if (!user) return null;
  if (!user.username) {
    return (
      <div className="container-page pb-32 pt-[112px] lg:pb-24">
        <UsernameSetup title="Kies eerst je username" />
      </div>
    );
  }

  const friends = (friendships ?? []).filter((f) => f.status === "accepted");
  const incomingList = (friendships ?? []).filter((f) => f.status === "pending" && f.direction === "incoming");
  const outgoingList = (friendships ?? []).filter((f) => f.status === "pending" && f.direction === "outgoing");
  const refreshAll = async () => {
    await Promise.all([loadFriendships(), loadFeed()]);
  };

  return (
    <div className="pt-[72px]">
      <section className="paper-grain border-b border-line bg-paper">
        <div className="container-page pb-6 pt-10 lg:pt-14">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE_CHEF }}>
            <p className="eyebrow flex items-center gap-3 text-brass">
              <span className="h-px w-8 bg-brass/70" />
              Keukenkring · @{user.username}
            </p>
            <h1 className="mt-3 font-serif text-[clamp(2.8rem,7vw,5rem)] leading-[0.92]">
              Koken met <em className="text-brass">vrienden</em>
            </h1>
            <p className="mt-3 max-w-lg text-[15.5px] leading-relaxed text-muted">Wat je hier deelt, zien alleen jij en je vrienden.</p>
          </motion.div>
          <div className="mt-7">
            <SocialTabs
              value={tab}
              onChange={setTab}
              tabs={[
                { id: "feed", label: "Feed" },
                { id: "vrienden", label: "Vrienden" },
                { id: "verzoeken", label: "Verzoeken", badge: incomingList.length || incoming },
              ]}
            />
          </div>
        </div>
      </section>

      <section className="container-page pb-32 pt-8 lg:pb-24">
        <div className="mx-auto max-w-3xl">
        {error && (
          <p className="mb-6 flex items-start justify-between gap-3 rounded-2xl bg-bordeaux/10 px-4 py-3 text-[14px] text-bordeaux">
            {error}
            <button type="button" onClick={() => setError(null)} className="grid size-7 shrink-0 place-items-center rounded-full hover:bg-bordeaux/10" aria-label="Melding sluiten">
              <X className="size-4" />
            </button>
          </p>
        )}

        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease: EASE_CHEF }}>
            {tab === "feed" && (
              <div className="space-y-5">
                <PostComposer onPosted={(post) => setFeed((current) => [post, ...(current ?? [])])} />
                {feed === null ? (
                  <Skeleton />
                ) : feed.length === 0 ? (
                  <Empty
                    title="Je feed is nog leeg"
                    body={friends.length ? "Jij en je vrienden hebben nog niets gedeeld. Plaats als eerste een post." : "Voeg vrienden toe via hun username. Daarna zie je hier hun posts."}
                    action={
                      !friends.length && (
                        <Button variant="secondary" onClick={() => setTab("vrienden")}>
                          Vrienden zoeken
                        </Button>
                      )
                    }
                  />
                ) : (
                  <AnimatePresence initial={false}>
                    {feed.map((post) => (
                      <PostCard key={post.id} post={post} onDeleted={(id) => setFeed((current) => (current ?? []).filter((p) => p.id !== id))} />
                    ))}
                  </AnimatePresence>
                )}
              </div>
            )}

            {tab === "vrienden" && (
              <div className="space-y-10">
                <div>
                  <label htmlFor="member-search" className="sr-only">
                    Zoek op username
                  </label>
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-5 top-1/2 size-5 -translate-y-1/2 text-muted" strokeWidth={1.8} />
                    <input
                      id="member-search"
                      type="search"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Zoek op username, bv. @mauro2009"
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck={false}
                      className="h-14 w-full rounded-full border border-line bg-cream pl-14 pr-5 text-[16px] shadow-card placeholder:text-muted/60 focus:border-brass/60 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brass/10 [&::-webkit-search-cancel-button]:hidden"
                    />
                  </div>
                  {results !== null && (
                    <div className="mt-4">
                      {searching ? (
                        <Skeleton rows={2} />
                      ) : results.length === 0 ? (
                        <p className="px-2 text-[14.5px] text-muted">Geen kok gevonden met een username die begint met “{normalizeUsername(query)}”.</p>
                      ) : (
                        <ul className="space-y-3">
                          {results.map((member) => {
                            const { relationship, requestId } = relationOf(member);
                            return (
                              <MemberRow key={member.id} member={member}>
                                <FriendActions member={member} relationship={relationship} requestId={requestId} onChange={refreshAll} />
                              </MemberRow>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <SectionTitle count={friendships ? friends.length : undefined}>Mijn vrienden</SectionTitle>
                  {friendships === null ? (
                    <Skeleton />
                  ) : friends.length === 0 ? (
                    <Empty title="Nog geen vrienden" body="Zoek hierboven op username en stuur een vriendschapsverzoek." />
                  ) : (
                    <ul className="space-y-3">
                      {friends.map((f) => (
                        <MemberRow key={f.id} member={f.other}>
                          <FriendActions member={f.other} relationship="friends" requestId={f.id} onChange={refreshAll} />
                        </MemberRow>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}

            {tab === "verzoeken" && (
              <div className="space-y-10">
                <div>
                  <SectionTitle count={friendships ? incomingList.length : undefined}>Inkomende verzoeken</SectionTitle>
                  {friendships === null ? (
                    <Skeleton rows={2} />
                  ) : incomingList.length === 0 ? (
                    <Empty title="Geen nieuwe verzoeken" body="Als iemand je als vriend toevoegt, zie je dat hier." />
                  ) : (
                    <ul className="space-y-3">
                      {incomingList.map((f) => (
                        <MemberRow key={f.id} member={f.other} note="wil vrienden worden">
                          <FriendActions member={f.other} relationship="incoming" requestId={f.id} onChange={refreshAll} />
                        </MemberRow>
                      ))}
                    </ul>
                  )}
                </div>
                <div>
                  <SectionTitle count={friendships ? outgoingList.length : undefined}>Uitgaande verzoeken</SectionTitle>
                  {friendships === null ? (
                    <Skeleton rows={2} />
                  ) : outgoingList.length === 0 ? (
                    <Empty title="Geen openstaande verzoeken" body="Verzoeken die jij verstuurt en nog niet zijn beantwoord, staan hier." />
                  ) : (
                    <ul className="space-y-3">
                      {outgoingList.map((f) => (
                        <MemberRow key={f.id} member={f.other} note="wacht op antwoord">
                          <FriendActions member={f.other} relationship="outgoing" requestId={f.id} onChange={refreshAll} />
                        </MemberRow>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
