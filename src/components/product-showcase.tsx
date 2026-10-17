"use client";

import { AnimatePresence, motion } from "motion/react";
import { useId, useState, type ReactNode } from "react";
import { AgentFigure } from "./agent";
import { BrandIcon, type BrandName } from "./brand-icon";
import { PerchedTex } from "./perched-tex";
import { Container } from "./section";
import { Switch } from "./ui-switch";

type Decision = "pending" | "approved" | "rejected";
type Tab = "activity" | "approvals" | "automations";

const OTHER_APPROVALS: { id: string; icon: BrandName; title: string; preview: string; reason: string }[] = [
  { id: "review", icon: "github", title: "Post Patch's review on PR #131", preview: "Two small things to fix, otherwise good to merge.", reason: "Comments for others to see" },
  { id: "drafts", icon: "gmail", title: "Delete 12 old drafts", preview: "Drafts older than 90 days in Gmail.", reason: "Deletes things" },
];

const AUTOMATIONS: { id: string; icon: BrandName; title: string; when: string; next: string }[] = [
  { id: "week", icon: "gmail", title: "Summarise my inbox", when: "Every weekday · 9:00", next: "Next run tomorrow 9:00" },
  { id: "boss", icon: "gmail", title: "Tell me when my boss emails", when: "When it happens · Gmail", next: "Watching your inbox" },
  { id: "review", icon: "github", title: "Review every pull request", when: "When it happens · GitHub", next: "Watching acme/web" },
  { id: "invoice", icon: "telegram", title: "Remind me to chase the invoice", when: "Once · Friday 10:00", next: "Runs Friday 10:00" },
];

function Bubble({ from, children }: { from: "you" | "tex"; children: ReactNode }) {
  return from === "you" ? (
    <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-fg px-4 py-2.5 text-[14.5px] leading-snug text-white">{children}</div>
  ) : (
    <div className="max-w-[88%] rounded-2xl rounded-bl-md border border-line bg-surface px-4 py-2.5 text-[14.5px] leading-snug">{children}</div>
  );
}

function Pill({ tone, children }: { tone: "done" | "waiting" | "muted" | "danger"; children: ReactNode }) {
  const cls = {
    done: "bg-[#E7F6EC] text-[#14713D]",
    waiting: "bg-accent-soft text-accent",
    muted: "bg-surface-2 text-muted",
    danger: "bg-[#FDECEA] text-danger",
  }[tone];
  return <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${cls}`}>{children}</span>;
}

function DecisionButtons({ onDecide, compact = false }: { onDecide: (d: Exclude<Decision, "pending">) => void; compact?: boolean }) {
  const h = compact ? "h-8 px-3.5 text-[12.5px]" : "h-9 text-[13.5px]";
  return (
    <div className={compact ? "flex shrink-0 gap-1.5" : "grid grid-cols-2 gap-2"}>
      <button type="button" onClick={() => onDecide("rejected")} className={`${h} cursor-pointer rounded-full border border-line bg-surface font-medium transition-colors hover:border-fg/40`}>
        Reject
      </button>
      <button type="button" onClick={() => onDecide("approved")} className={`${h} cursor-pointer rounded-full bg-fg font-medium text-white transition-colors hover:bg-black`}>
        Approve
      </button>
    </div>
  );
}

export function ProductShowcase() {
  const uid = useId();
  const [tab, setTab] = useState<Tab>("activity");
  const [email, setEmail] = useState<Decision>("pending");
  const [others, setOthers] = useState<Record<string, Decision>>({});
  const [enabled, setEnabled] = useState<Record<string, boolean>>({ week: true, boss: true, review: true, invoice: false });

  const pending = (email === "pending" ? 1 : 0) + OTHER_APPROVALS.filter((a) => (others[a.id] ?? "pending") === "pending").length;
  const activeCount = Object.values(enabled).filter(Boolean).length;

  const emailStatus =
    email === "approved" ? <Pill tone="done">Sent</Pill> : email === "rejected" ? <Pill tone="danger">Not sent</Pill> : <Pill tone="waiting">Needs OK</Pill>;

  const tabs: { id: Tab; label: string; badge?: number }[] = [
    { id: "activity", label: "Activity" },
    { id: "approvals", label: "Approvals", badge: pending },
    { id: "automations", label: "Automations" },
  ];

  return (
    <Container className="relative mt-[17rem] pb-20 sm:mt-[18.5rem] sm:pb-28">
      <div id="demo" className="relative mx-auto max-w-5xl scroll-mt-80">
        <PerchedTex />
        <div className="relative grid overflow-hidden rounded-[22px] border border-line bg-surface text-left shadow-window md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
          {/* Chat */}
          <div className="flex flex-col border-b border-line bg-[#F7F6F2] md:border-r md:border-b-0">
            <div className="flex items-center gap-3 border-b border-line bg-surface px-7 py-4">
              <span className="grid size-9 place-items-center rounded-full bg-accent-soft">
                <AgentFigure who="tex" glyph size={28} label="Tex" />
              </span>
              <div className="leading-tight">
                <p className="text-sm font-semibold">Tex</p>
                <p className="flex items-center gap-1.5 font-mono text-[11px] text-muted">
                  <span className="size-1.5 rounded-full bg-[#22A45D]" />
                  online
                </p>
              </div>
              <BrandIcon name="telegram" size={18} className="ml-auto" />
            </div>
            <div className="flex flex-1 flex-col gap-3 px-7 py-7">
              <Bubble from="you">Check PR #128 and tell Maya if it&apos;s ready</Bubble>
              <Bubble from="tex">On it. PR #128 changes 4 files and the tests pass. Drafting the note to Maya.</Bubble>
              <div className="max-w-[92%] rounded-2xl rounded-bl-md border border-fg/80 bg-surface p-5">
                <p className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.06em] text-muted">
                  <span aria-hidden className="h-3 w-1 bg-accent" />
                  {email === "pending" ? "NEEDS YOUR OK" : email === "approved" ? "APPROVED" : "REJECTED"}
                </p>
                <p className="mt-1.5 text-[14px] font-semibold">Send this email to Maya?</p>
                <p className="mt-2 rounded-lg bg-surface-2 px-3.5 py-2.5 text-[13.5px] leading-relaxed text-muted">
                  Hi Maya, PR #128 looks good and is ready to merge. Thanks!
                </p>
                <div className="mt-3.5">
                  {email === "pending" ? (
                    <>
                      <DecisionButtons onDecide={setEmail} />
                      <p className="mt-2 text-center text-[11.5px] text-muted">Try it: tap Approve or Reject</p>
                    </>
                  ) : (
                    <button type="button" onClick={() => setEmail("pending")} className="cursor-pointer text-[12.5px] font-medium text-accent hover:underline">
                      Undo
                    </button>
                  )}
                </div>
              </div>
              <AnimatePresence mode="popLayout">
                {email !== "pending" && (
                  <motion.div key={email} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}>
                    <Bubble from="tex">
                      {email === "approved"
                        ? "Done. Maya has the note."
                        : "Okay, I won't send it. Want me to change the note?"}
                    </Bubble>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div aria-hidden className="mx-7 mb-7 flex items-center rounded-full border border-line bg-surface px-5 py-3 text-[13.5px] text-muted">
              Message Tex…
              <svg viewBox="0 0 24 24" className="ml-auto size-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                <rect x="9" y="3" width="6" height="11" rx="3" />
                <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
              </svg>
            </div>
          </div>

          {/* Web app panel with working tabs; a fixed height so switching tabs never resizes the window */}
          <div className="flex min-h-[30rem] flex-col md:h-[35rem] md:min-h-0">
            <div role="tablist" aria-label="Web app" className="flex items-center gap-1.5 border-b border-line px-6 py-4 text-[13.5px]">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  id={`${uid}-${t.id}-tab`}
                  aria-selected={tab === t.id}
                  aria-controls={`${uid}-${t.id}-panel`}
                  onClick={() => setTab(t.id)}
                  className={`flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1.5 transition-colors ${
                    tab === t.id ? "bg-surface-2 font-medium text-fg" : "text-muted hover:text-fg"
                  }`}
                >
                  {t.label}
                  {!!t.badge && <span className="grid size-4 place-items-center rounded-full bg-accent text-[10px] text-white">{t.badge}</span>}
                </button>
              ))}
            </div>

            <div role="tabpanel" id={`${uid}-${tab}-panel`} aria-labelledby={`${uid}-${tab}-tab`} className="flex min-h-0 flex-1 flex-col overflow-y-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={tab}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex flex-1 flex-col"
                >
                  {tab === "activity" && (
                    <ul className="divide-y divide-line">
                      {[
                        { icon: "github" as const, title: "Read PR #128 and its tests", meta: "GitHub · free", status: <Pill tone="done">Done</Pill> },
                        { icon: "gmail" as const, title: "Email to Maya about PR #128", meta: email === "pending" ? "Gmail · waiting for your OK" : "Gmail · 1 credit", status: emailStatus },
                        { icon: "gmail" as const, title: "Summary of your unread email", meta: "Automation · 1 credit", status: <Pill tone="done">Done</Pill> },
                        { icon: "telegram" as const, title: "Every weekday 9:00, summarise my inbox", meta: "Automation · next run tomorrow", status: <Pill tone="muted">Scheduled</Pill> },
                        { icon: "github" as const, title: "Patch reviewed PR #127", meta: "Automation · Auto-approved", status: <Pill tone="done">Done</Pill> },
                      ].map((a) => (
                        <li key={a.title} className="flex items-center gap-4 px-7 py-5">
                          <BrandIcon name={a.icon} tile size={14} />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[14px] font-medium">{a.title}</p>
                            <p className="truncate font-mono text-[11px] text-muted">{a.meta}</p>
                          </div>
                          {a.status}
                        </li>
                      ))}
                    </ul>
                  )}

                  {tab === "approvals" && (
                    <div className="flex flex-col gap-2.5 p-6">
                      <p className="mb-1 text-[12.5px] text-muted">Tex waits for you before it sends to others, deletes things or spends money. A quiet “Don’t ask again” on a card makes a skip rule, and deleting, paying and merging always ask.</p>
                      {[{ id: "email", icon: "gmail" as const, title: "Send this email to Maya", preview: "Hi Maya, PR #128 looks good and is ready to merge. Thanks!", reason: "Sends to someone else" }, ...OTHER_APPROVALS].map((a) => {
                        const d = a.id === "email" ? email : (others[a.id] ?? "pending");
                        const decide = (next: Decision) => (a.id === "email" ? setEmail(next) : setOthers((o) => ({ ...o, [a.id]: next })));
                        return (
                          <div
                            key={a.id}
                            className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition-colors ${d === "pending" ? "border-line bg-surface" : "border-line/60 bg-surface-2/50"}`}
                          >
                            <BrandIcon name={a.icon} tile size={13} />
                            <div className="min-w-0 flex-1">
                              <p className={`truncate text-[14px] font-medium ${d === "pending" ? "" : "text-muted"}`}>{a.title}</p>
                              <p className="truncate text-[12px] text-muted">
                                <span className={a.reason === "Deletes things" ? "text-danger" : "text-accent"}>{a.reason}</span>
                                {" · "}
                                {a.preview}
                              </p>
                            </div>
                            {d === "pending" ? (
                              <DecisionButtons compact onDecide={decide} />
                            ) : (
                              <div className="flex shrink-0 items-center gap-2.5">
                                {d === "approved" ? <Pill tone="done">Approved</Pill> : <Pill tone="danger">Rejected</Pill>}
                                <button type="button" onClick={() => decide("pending")} className="cursor-pointer text-[12px] font-medium text-accent hover:underline">
                                  Undo
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                      {pending === 0 && <p className="text-center text-[13px] font-medium text-[#14713D]">All caught up.</p>}
                    </div>
                  )}

                  {tab === "automations" && (
                    <div className="flex flex-1 flex-col">
                      <ul className="divide-y divide-line">
                        {AUTOMATIONS.map((a) => {
                          const on = enabled[a.id];
                          return (
                            <li key={a.id} className="flex items-center gap-4 px-7 py-4">
                              <BrandIcon name={a.icon} tile size={14} />
                              <div className="min-w-0 flex-1">
                                <p className={`truncate text-[14px] font-medium ${on ? "" : "text-muted"}`}>{a.title}</p>
                                <p className="truncate font-mono text-[11px] text-muted">
                                  {a.when} · {on ? a.next : "Paused"}
                                </p>
                              </div>
                              <Switch on={on} label={`${on ? "Pause" : "Resume"} ${a.title}`} onToggle={() => setEnabled((e) => ({ ...e, [a.id]: !e[a.id] }))} />
                            </li>
                          );
                        })}
                      </ul>
                      <div className="m-6 mt-auto rounded-2xl border border-dashed border-line bg-surface-2/50 p-4">
                        <p className="text-[12.5px] text-muted">
                          Add one by texting Tex or building it on the canvas, like <span className="font-medium text-fg">“every Friday at 5pm, list the pull requests waiting for my review”</span>.
                        </p>
                        <p className="mt-1.5 font-mono text-[11px] text-muted">{activeCount} active · 5 on Pro</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-auto flex items-center justify-between border-t border-line px-7 py-4 font-mono text-[11px] text-muted">
              <span>Every action is logged</span>
              <span>credits shown per task</span>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
