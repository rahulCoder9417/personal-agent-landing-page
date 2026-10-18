"use client";

// The chat as the web app draws it (user-frontend-web src/components/chat/: thread.tsx, approval-card.tsx,
// turn-line.tsx, composer.tsx, side-panel.tsx): your message on the right, Tex's on the left beside its
// face, the line of channel and time under each, the "Needs your OK" card with Approve and Deny, and on
// a wide screen the "Right now" panel.

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { AgentFigure } from "../agent";
import { STEPS, type ApprovalStatus, type DemoApproval, type Screen } from "./data";
import {
  AppIcon,
  AppMark,
  buttonClass,
  CheckIcon,
  ChevronRightIcon,
  ClockIcon,
  CloseIcon,
  cn,
  NewChatIcon,
  PanelIcon,
  PanelRightIcon,
  PaperclipIcon,
  SendIcon,
  type AppName,
} from "./ui";

export type Decide = (id: string, decision: "approve" | "reject", rule?: "listed" | "anyone") => void;

// ---------------------------------------------------------------- messages

function TexAvatar({ working }: { working?: boolean }) {
  return (
    <span className="grid size-8 shrink-0 place-items-center rounded-[10px] bg-accent-soft">
      <AgentFigure who="tex" mood={working ? "working" : "ready"} glyph size={25} label="Tex" />
    </span>
  );
}

function MetaLine({ time, align = "start", children }: { time: string; align?: "start" | "end"; children?: ReactNode }) {
  return (
    <p className={cn("flex items-center gap-1.5 text-[12px] text-muted tabular-nums", align === "end" && "justify-end")}>
      <AppMark name="web" size={11} />
      <span>
        Web · {time}
        {children && <> · {children}</>}
      </span>
    </p>
  );
}

function AgentBubble({ children }: { children: ReactNode }) {
  return <div className="max-w-[min(100%,560px)] rounded-[18px] rounded-bl-[6px] bg-surface-2 px-4 py-2.5 text-[14.5px] leading-[1.45] break-words">{children}</div>;
}

function FromTex({ time, meta, children, after }: { time: string; meta?: ReactNode; children: ReactNode; after?: ReactNode }) {
  return (
    <div className="flex items-start gap-2.5">
      <TexAvatar />
      <div className="flex min-w-0 flex-1 flex-col items-start gap-1.5">
        {children}
        <MetaLine time={time}>{meta}</MetaLine>
        {after}
      </div>
    </div>
  );
}

/** The steps of a turn, folded into Tex's answer: "Drafted the email to Maya · 3 steps", which opens them. */
function StepTrail() {
  return (
    <ol className="flex min-w-0 flex-col gap-1 border-l-2 border-line pt-0.5 pb-1 pl-3 text-[13px] text-muted">
      {STEPS.map((step, i) => (
        <li key={i} className="flex min-w-0 flex-col gap-0.5">
          {step.text && <span className="truncate text-fg-2">{step.text}</span>}
          {step.crew && (
            <span className="flex min-w-0 items-center gap-1.5 text-[12px]">
              <AgentFigure who={step.crew.who} mood="working" glyph size={14} label="" className="shrink-0" />
              <span className="truncate">
                <span className="font-medium text-fg-2">{step.crew.name}</span> · {step.crew.text}
              </span>
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}

function TurnLine({ working }: { working: boolean }) {
  return (
    <div className="-mt-3.5 ml-[42px] flex items-center gap-1.5 text-[12px] text-muted">
      <span aria-hidden className={cn("size-1.5 shrink-0 rounded-full bg-accent", working && "animate-pulse")} />
      {working ? "Tex is working…" : "Waiting for your OK"}
    </div>
  );
}

// ---------------------------------------------------------------- the approval card

/** The exact details, folded behind a quiet toggle. */
export function DetailsFold({ approval, open = false, className }: { approval: DemoApproval; open?: boolean; className?: string }) {
  return (
    <details open={open} className={cn("group border-t border-accent/15 pt-3", className)}>
      <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 text-[13px] font-semibold text-accent [&::-webkit-details-marker]:hidden">
        Show the details
        <span aria-hidden className="size-1.5 -translate-y-0.5 rotate-45 border-r-[1.5px] border-b-[1.5px] border-current transition-transform group-open:translate-y-0 group-open:-rotate-[135deg]" />
      </summary>
      <div className="mt-3 flex flex-col gap-2 rounded-xl bg-surface px-3.5 py-3">
        <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-[13px]">
          {approval.fields.map(([label, value]) => (
            <div key={label} className="contents">
              <dt className="text-muted">{label}</dt>
              <dd className="min-w-0 [overflow-wrap:anywhere]">{value}</dd>
            </div>
          ))}
        </dl>
        {approval.preview && <p className="border-t border-line pt-2 text-[13.5px] leading-relaxed text-fg-2">{approval.preview}</p>}
      </div>
    </details>
  );
}

const RESULT: Partial<Record<ApprovalStatus, { text: string; tint: string; tone: string; icon: "check" | "close" }>> = {
  approved: { text: "You approved this", tint: "bg-success-soft", tone: "text-success", icon: "check" },
  rejected: { text: "You denied this", tint: "bg-danger-soft", tone: "text-danger", icon: "close" },
  auto_approved: { text: "Ran without asking, by your skip rule", tint: "bg-success-soft", tone: "text-success", icon: "check" },
};

/** After a decision: one tinted line, "You approved this – <what>". */
export function DecidedLine({ status, summary, className }: { status: ApprovalStatus; summary: string; className?: string }) {
  const result = RESULT[status];
  if (!result) return null;
  return (
    <div className={cn("flex w-full items-center gap-2 rounded-xl px-4 py-2 text-[13.5px] leading-5 font-medium", result.tint, result.tone, className)}>
      {result.icon === "check" ? <CheckIcon size={14} className="shrink-0" /> : <CloseIcon size={14} className="shrink-0" />}
      <span className="min-w-0 truncate">
        {result.text}
        <span className="font-normal text-muted"> – {summary}</span>
      </span>
    </div>
  );
}

/** "Don't ask again for this…": a quiet link that opens the choice, "Only to <them>" or "Anyone". */
export function SkipPicker({ approval, onConfirm, className }: { approval: DemoApproval; onConfirm: (scope: "listed" | "anyone") => void; className?: string }) {
  const [open, setOpen] = useState(false);
  const [scope, setScope] = useState<"listed" | "anyone">("listed");
  const skip = approval.skip;
  if (!skip) return null;
  const what = skip.actionName.toLowerCase();
  if (!open)
    return (
      <button type="button" onClick={() => setOpen(true)} className={cn("cursor-pointer self-center rounded px-1 text-[12.5px] text-muted underline-offset-2 transition-colors hover:text-fg hover:underline", className)}>
        Don’t ask again for this…
      </button>
    );
  const choices = [
    { value: "listed" as const, label: `Only to ${skip.recipient}`, hint: "Anyone else still asks, also in cc or bcc." },
    { value: "anyone" as const, label: "Anyone", hint: "Whoever it goes to." },
  ];
  return (
    <div className={cn("flex flex-col gap-2.5 rounded-xl bg-surface px-3.5 py-3", className)}>
      <p className="text-[13px] font-semibold">Don’t ask again: {what}</p>
      <div role="radiogroup" aria-label={`Don’t ask again for ${what}`} className="flex flex-col gap-2">
        {choices.map((choice) => {
          const on = choice.value === scope;
          return (
            <button
              key={choice.value}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => setScope(choice.value)}
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-xl border bg-surface p-3 text-left transition-[border-color,box-shadow]",
                on ? "border-accent shadow-[0_0_0_1px_var(--accent)]" : "border-line hover:border-line-strong",
              )}
            >
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="text-[13.5px] leading-snug font-semibold [overflow-wrap:anywhere]">{choice.label}</span>
                <span className="text-[12.5px] leading-snug text-fg-2">{choice.hint}</span>
              </span>
              <span aria-hidden className={cn("mt-0.5 grid size-[18px] shrink-0 place-items-center rounded-full border", on ? "border-accent bg-accent text-white" : "border-line-strong bg-surface")}>
                {on && <CheckIcon size={11} />}
              </span>
            </button>
          );
        })}
      </div>
      {scope === "anyone" && <p className="text-[12.5px] leading-snug text-danger">Tex could {what} to anyone without asking you.</p>}
      <button type="button" onClick={() => onConfirm(scope)} className={buttonClass("primary", "sm", "w-full")}>
        Approve and don’t ask again
      </button>
      <div className="-mt-1 flex items-center gap-2">
        <p className="min-w-0 flex-1 text-[12px] leading-snug text-muted">Deleting, paying and merging always ask.</p>
        <button type="button" onClick={() => setOpen(false)} className={buttonClass("ghost", "sm")}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export function whyOf(approval: DemoApproval): string | null {
  return approval.reason.label === "Needs your OK" ? null : `${approval.reason.label}.`;
}

/** The Approve / Deny card under Tex's question, where Tex stopped to ask. */
function ApprovalCard({ approval, onDecide }: { approval: DemoApproval; onDecide: Decide }) {
  const why = whyOf(approval);
  return (
    <div className="flex w-full max-w-[480px] flex-col gap-4 rounded-2xl bg-accent-soft p-4">
      <div className="flex items-start gap-3">
        <span className="shrink-0 rounded-lg bg-surface p-0.5">
          <AppIcon name={approval.app} size={32} />
        </span>
        <div className="flex min-w-0 flex-col gap-1">
          <span className="text-[12px] font-semibold text-accent">Needs your OK</span>
          <span className="line-clamp-2 text-[15px] leading-[1.35] font-semibold tracking-[-0.01em]">{approval.summary}</span>
          {why && <p className="text-[13.5px] leading-normal text-fg-2">{why}</p>}
        </div>
      </div>
      <DetailsFold approval={approval} className="-mt-1" />
      <div className="grid grid-cols-2 gap-2">
        <button type="button" onClick={() => onDecide(approval.id, "approve")} className={buttonClass("primary")}>
          Approve
        </button>
        <button type="button" onClick={() => onDecide(approval.id, "reject")} className={buttonClass("secondary")}>
          Deny
        </button>
      </div>
      <p className="-mt-2 text-center text-[12px] text-muted tabular-nums">{approval.when}</p>
      <SkipPicker approval={approval} onConfirm={(scope) => onDecide(approval.id, "approve", scope)} className="-mt-2" />
    </div>
  );
}

// ---------------------------------------------------------------- the "Right now" panel

function PanelSection({ title, count, onOpen, children }: { title: string; count?: number; onOpen: () => void; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-1.5">
      <button type="button" onClick={onOpen} className="group flex cursor-pointer items-center gap-1.5 text-[13px] font-semibold">
        {title}
        {!!count && <span className="text-muted tabular-nums">{count}</span>}
        <ChevronRightIcon size={13} className="text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-fg" />
      </button>
      {children}
    </section>
  );
}

function PanelRow({ icon, title, meta, metaClass }: { icon: ReactNode; title: string; meta: string; metaClass?: string }) {
  return (
    <div className="-mx-2 flex items-center gap-3 rounded-[10px] px-2 py-1.5">
      {icon}
      <div className="flex min-w-0 flex-col">
        <span className="truncate text-[13.5px] font-medium">{title}</span>
        <span className={cn("truncate text-[12px] text-muted tabular-nums", metaClass)}>{meta}</span>
      </div>
    </div>
  );
}

export type DoneItem = { title: string; meta: string };
export type NextItem = { title: string; meta: string; app?: AppName };

function RightNow({ pending, done, next, onOpen }: { pending: DemoApproval[]; done: DoneItem[]; next: NextItem[]; onOpen: (screen: Screen) => void }) {
  const asking = pending.length > 0;
  return (
    <aside aria-label="Right now" className="hidden w-[272px] shrink-0 flex-col border-l border-line @min-[820px]:flex">
      <div className="flex shrink-0 items-center gap-1 pt-3.5 pr-2 pb-2 pl-5">
        <h3 className="flex-1 text-[13px] font-semibold">Right now</h3>
        <span aria-hidden className="grid size-[30px] place-items-center rounded-lg text-muted">
          <PanelRightIcon size={17} />
        </span>
      </div>
      <div className="scroll-pane flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-5 pt-1 pb-5">
        <div className="flex flex-col items-center rounded-2xl bg-accent-soft px-4 pt-3 pb-4 text-center">
          <AgentFigure who="tex" mood={asking ? "asking" : "ready"} size={104} label="" />
          <p className="text-[15px] font-semibold tracking-[-0.01em]">{asking ? "Waiting for your OK" : "Tex is awake"}</p>
          <p className="text-[12.5px] text-nav">{asking ? "It has stopped until you answer." : "Hand it something. It works in the background."}</p>
        </div>
        <PanelSection title="Needs your OK" count={pending.length} onOpen={() => onOpen("approvals")}>
          {pending.length === 0 ? (
            <p className="text-[13px] text-muted">Nothing is waiting on you.</p>
          ) : (
            pending.slice(0, 3).map((a) => (
              <PanelRow
                key={a.id}
                icon={<AppIcon name={a.app} size={32} />}
                title={a.summary}
                meta={a.reason.label}
                metaClass={a.reason.tone === "danger" ? "text-danger" : "text-accent-dark"}
              />
            ))
          )}
        </PanelSection>
        <PanelSection title="Done today" onOpen={() => onOpen("activity")}>
          {done.map((item) => (
            <PanelRow
              key={item.title}
              icon={
                <span className="grid size-8 shrink-0 place-items-center rounded-[9px] bg-success-soft text-success">
                  <CheckIcon size={15} />
                </span>
              }
              title={item.title}
              meta={item.meta}
            />
          ))}
        </PanelSection>
        <PanelSection title="Up next" onOpen={() => onOpen("automations")}>
          {next.map((item) => (
            <PanelRow
              key={item.title}
              icon={
                item.app ? (
                  <AppIcon name={item.app} size={32} />
                ) : (
                  <span className="grid size-8 shrink-0 place-items-center rounded-[9px] bg-surface-2 text-nav">
                    <ClockIcon size={16} />
                  </span>
                )
              }
              title={item.title}
              meta={item.meta}
            />
          ))}
        </PanelSection>
      </div>
    </aside>
  );
}

// ---------------------------------------------------------------- the screen

export function ChatScreen({
  email,
  emailStatus,
  working,
  onDecide,
  pending,
  done,
  next,
  onOpen,
}: {
  email: DemoApproval;
  emailStatus: ApprovalStatus;
  /** Tex is at work on the answer it was just given. */
  working: boolean;
  onDecide: Decide;
  pending: DemoApproval[];
  done: DoneItem[];
  next: NextItem[];
  onOpen: (screen: Screen) => void;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const ask = useRef<HTMLDivElement>(null);
  const [stepsOpen, setStepsOpen] = useState(false);
  const decided = emailStatus !== "pending";

  // While Tex waits, the thread opens on your message, so the story reads from the top (on a phone the
  // whole thread doesn't fit). Once answered, it follows the newest message, as the app does.
  useLayoutEffect(() => {
    const el = scroller.current;
    if (!el) return;
    el.scrollTop = decided || working ? el.scrollHeight : (ask.current?.offsetTop ?? 0) - 8;
  }, [decided, working]);

  return (
    <div className="flex min-h-0 min-w-0 flex-1">
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <header className="flex shrink-0 items-center gap-1.5 px-2.5 pt-3 pb-2 @min-[600px]:min-h-[60px] @min-[600px]:px-5 @min-[600px]:pt-4">
          <span aria-hidden className="grid size-9 place-items-center rounded-lg text-muted">
            <PanelIcon size={18} />
          </span>
          <h2 className="min-w-0 truncate px-1.5 text-[19px] leading-tight font-semibold tracking-[-0.02em]">Check PR #128 and tell Maya</h2>
          <span aria-hidden className="ml-auto grid size-9 shrink-0 place-items-center rounded-lg text-muted">
            <NewChatIcon size={18} />
          </span>
        </header>

        <div ref={scroller} className="scroll-pane relative min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto flex min-h-full max-w-[944px] flex-col gap-5 px-4 pt-2 pb-5 @min-[600px]:px-8">
            <p className="flex items-center gap-3 py-1 text-[12px] font-medium text-muted before:h-px before:flex-1 before:bg-line after:h-px after:flex-1 after:bg-line">Today</p>

            <div ref={ask} className="flex flex-col items-end gap-1.5">
              <div className="max-w-[78%] rounded-[18px] rounded-br-[6px] bg-fg px-4 py-2.5 text-[14.5px] leading-[1.45] break-words text-white">
                Check PR #128 and tell Maya if it&apos;s ready
              </div>
              <MetaLine time="10:42 AM" align="end" />
            </div>

            <FromTex
              time="10:43 AM"
              meta={
                <button
                  type="button"
                  aria-expanded={stepsOpen}
                  onClick={() => setStepsOpen((was) => !was)}
                  className="inline-flex cursor-pointer items-center gap-1 align-bottom font-medium text-muted underline-offset-2 transition-colors hover:text-fg hover:underline"
                >
                  <span className="truncate">Drafted the email to Maya · 3 steps</span>
                  <ChevronRightIcon size={11} className={cn("shrink-0 transition-transform", stepsOpen && "rotate-90")} />
                </button>
              }
              after={stepsOpen && <StepTrail />}
            >
              <AgentBubble>PR #128 is ready: the tests pass and Patch found nothing to fix. I drafted a note to Maya.</AgentBubble>
            </FromTex>

            <FromTex time="10:43 AM">
              <AgentBubble>I need your OK for this.</AgentBubble>
              {decided ? <DecidedLine status={emailStatus} summary={email.summary} className="max-w-[480px]" /> : <ApprovalCard approval={email} onDecide={onDecide} />}
            </FromTex>

            {decided && !working && (
              <FromTex time="10:44 AM">
                <AgentBubble>{emailStatus === "rejected" ? "Okay, I won’t send it. Want me to change the note?" : "Done. The email to Maya is sent."}</AgentBubble>
              </FromTex>
            )}

            {(!decided || working) && <TurnLine working={working} />}
          </div>
        </div>

        <div aria-hidden className="shrink-0 px-3 pb-3 @min-[600px]:px-7 @min-[600px]:pb-3.5">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-end gap-1 rounded-2xl bg-surface py-2 pr-2 pl-2 shadow-[0_0_0_1px_var(--line-strong),0_8px_24px_-14px_rgb(21_21_21/0.25)]">
              <span className="grid size-9 shrink-0 place-items-center rounded-[11px] text-muted">
                <PaperclipIcon size={18} />
              </span>
              <span className="min-h-[36px] flex-1 px-1 py-2 text-[14.5px] leading-5 text-muted">Message Tex…</span>
              <span className="grid size-9 shrink-0 place-items-center rounded-[11px] bg-surface-2 text-muted">
                <SendIcon size={17} />
              </span>
            </div>
            <p className="hidden min-h-4 px-3 text-right text-[12px] text-muted @min-[600px]:block">Enter to send, Shift+Enter for a new line. Drop files anywhere.</p>
          </div>
        </div>
      </div>

      <RightNow pending={pending} done={done} next={next} onOpen={onOpen} />
    </div>
  );
}

