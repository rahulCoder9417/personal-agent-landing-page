"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { PerchedTex } from "./perched-tex";
import { Container } from "./section";
import { ActivityScreen } from "./showcase/activity-screen";
import { ApprovalsScreen, type ApprovalItem } from "./showcase/approvals-screen";
import { AutomationsScreen } from "./showcase/automations-screen";
import { ChatScreen, type Decide, type DoneItem, type NextItem } from "./showcase/chat-screen";
import { APPROVALS, BALANCE, BASE_ACTIVITY, EMAIL_ID, FIRST_RULE, type ApprovalStatus, type Entry, type Screen, type SkipRule } from "./showcase/data";
import { MobileTabBar, MobileTopBar, Sidebar } from "./showcase/shell";

// The web app (app.textcrew.in) as it looks, with a pretend account: the chat where Tex asks for an OK,
// and the Approvals, Automations and Activity screens, all sharing one state. Answer the approval in
// the chat or on Approvals and the rest follows: the badge, the credits, the activity log.

const START_STATUS = Object.fromEntries(APPROVALS.map((a) => [a.id, a.start])) as Record<string, ApprovalStatus>;
const START_ENABLED: Record<string, boolean> = { inbox: true, review: true, boss: true, invoice: false };
const DECIDED_AT = "10:44 AM";
// Activity entries that record Tex asking or reporting, rather than something it got done.
const CHATTER = new Set(["approval requested", "progress"]);

export function ProductShowcase() {
  const [screen, setScreen] = useState<Screen>("chat");
  const [status, setStatus] = useState(START_STATUS);
  const [decided, setDecided] = useState<string[]>([]);
  const [rules, setRules] = useState<SkipRule[]>([FIRST_RULE]);
  const [enabled, setEnabled] = useState(START_ENABLED);
  const [working, setWorking] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const decide: Decide = (id, decision, rule) => {
    const approval = APPROVALS.find((a) => a.id === id);
    if (!approval) return;
    setStatus((s) => ({ ...s, [id]: decision === "approve" ? "approved" : "rejected" }));
    setDecided((d) => [id, ...d.filter((x) => x !== id)]);
    const skip = approval.skip;
    if (rule && skip) {
      const scope = rule === "listed" ? `Only to ${skip.recipient}` : "To anyone";
      setRules((r) => [{ id: `rule-${id}`, actionName: skip.actionName, scope, made: "Made today" }, ...r.filter((x) => x.id !== `rule-${id}`)]);
    }
    // Tex picks the answer up at once: the chat shows it at work for a moment, then its reply.
    if (id === EMAIL_ID) {
      setWorking(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setWorking(false), 1200);
    }
  };

  const reset = () => {
    if (timer.current) clearTimeout(timer.current);
    setStatus(START_STATUS);
    setDecided([]);
    setRules([FIRST_RULE]);
    setEnabled(START_ENABLED);
    setWorking(false);
    setScreen("chat");
  };

  // Newest first: what was answered here, then the rest as they were.
  const order = [...decided, ...APPROVALS.map((a) => a.id).filter((id) => !decided.includes(id))];
  const items: ApprovalItem[] = order.flatMap((id) => {
    const approval = APPROVALS.find((a) => a.id === id);
    if (!approval) return [];
    const now = decided.includes(id);
    return [
      {
        approval,
        status: status[id],
        when: now ? "Today" : approval.when,
        settled: now ? `${status[id] === "approved" ? "Approved" : "Denied"} Today, ${DECIDED_AT}` : approval.settled,
      },
    ];
  });
  const email = items.find((item) => item.approval.id === EMAIL_ID);
  const pending = items.filter((item) => item.status === "pending").map((item) => item.approval);
  const balance = BALANCE - decided.filter((id) => status[id] === "approved").length;

  const entries: Entry[] = [
    ...items
      .filter((item) => decided.includes(item.approval.id))
      .flatMap(({ approval, status: settled }): Entry[] => {
        const answer: Entry = {
          id: `you-${approval.id}`,
          time: DECIDED_AT,
          actor: "user",
          who: "You",
          label: "approval decided",
          summary: `${settled === "approved" ? "Approved" : "Denied"} “${approval.summary}”`,
          credits: 0,
          filter: "approvals",
        };
        if (settled !== "approved") return [answer];
        return [{ id: `ran-${approval.id}`, time: DECIDED_AT, actor: "agent", who: "Tex", label: "run app action", summary: approval.summary, credits: 1, filter: "tex" }, answer];
      }),
    ...BASE_ACTIVITY,
  ];
  const done: DoneItem[] = entries
    .filter((e) => e.actor !== "user" && !CHATTER.has(e.label))
    .slice(0, 3)
    .map((e) => ({ title: e.summary, meta: e.credits ? `${e.time} · ${e.credits} credit${e.credits === 1 ? "" : "s"}` : e.time }));
  const upNext: (NextItem & { id: string })[] = [
    { id: "inbox", title: "Summarise my inbox", meta: "Tomorrow, 9:00 AM" },
    { id: "review", title: "Review pull requests", meta: "When a pull request opens or gets new commits", app: "github" },
    { id: "boss", title: "Boss emails", meta: "When a new email arrives in Gmail", app: "gmail" },
  ];
  const next = upNext.filter((n) => enabled[n.id]);

  const changed = decided.length > 0 || rules.length !== 1 || rules[0] !== FIRST_RULE || Object.keys(START_ENABLED).some((k) => enabled[k] !== START_ENABLED[k]);

  return (
    <Container className="relative mt-[17rem] pb-20 sm:mt-[18.5rem] sm:pb-28">
      <div id="demo" className="relative mx-auto max-w-6xl scroll-mt-80">
        <PerchedTex />
        <div className="app-ui relative overflow-hidden rounded-[22px] border border-line bg-chrome text-fg shadow-window">
          {/* The browser's bar, so it reads as the web app at its address. */}
          <div aria-hidden className="hidden items-center border-b border-line-strong/50 px-4 py-2.5 md:flex">
            <span className="flex w-16 gap-1.5">
              <span className="size-2.5 rounded-full bg-line-strong" />
              <span className="size-2.5 rounded-full bg-line-strong" />
              <span className="size-2.5 rounded-full bg-line-strong" />
            </span>
            <span className="mx-auto flex h-6 items-center gap-1.5 rounded-md bg-surface/80 px-3 font-mono text-[11.5px] text-muted">
              <svg viewBox="0 0 24 24" className="size-3" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                <rect x="5" y="11" width="14" height="9" rx="2" />
                <path d="M8 11V8a4 4 0 0 1 8 0v3" />
              </svg>
              app.textcrew.in
            </span>
            <span className="w-16" />
          </div>

          <div className="flex h-[720px] flex-col md:h-[720px] md:flex-row">
            <Sidebar screen={screen} onOpen={setScreen} pending={pending.length} balance={balance} />
            <MobileTopBar balance={balance} />
            <main className="@container flex min-h-0 min-w-0 flex-1 overflow-hidden bg-surface max-md:border-t max-md:border-line md:my-2 md:mr-2 md:rounded-[14px] md:shadow-[var(--shadow-raised)]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={screen}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.12 }}
                  className="flex min-h-0 min-w-0 flex-1"
                >
                  {screen === "chat" && email && (
                    <ChatScreen email={email.approval} emailStatus={email.status} working={working} onDecide={decide} pending={pending} done={done} next={next} onOpen={setScreen} />
                  )}
                  {screen === "approvals" && <ApprovalsScreen items={items} rules={rules} onDecide={decide} onRemoveRule={(id) => setRules((r) => r.filter((x) => x.id !== id))} />}
                  {screen === "automations" && <AutomationsScreen enabled={enabled} onToggle={(id) => setEnabled((e) => ({ ...e, [id]: !e[id] }))} />}
                  {screen === "activity" && <ActivityScreen entries={entries} />}
                </motion.div>
              </AnimatePresence>
            </main>
            <MobileTabBar screen={screen} onOpen={setScreen} pending={pending.length} />
          </div>
        </div>
        <p className="mt-4 text-center text-[13px] text-muted">
          Try it: answer Tex&apos;s question, then look in Approvals, Automations and Activity.
          {changed && (
            <>
              {" "}
              <button type="button" onClick={reset} className="cursor-pointer font-medium text-accent hover:underline">
                Start over
              </button>
            </>
          )}
        </p>
      </div>
    </Container>
  );
}
