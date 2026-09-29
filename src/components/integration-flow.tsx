"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { AgentFigure } from "./agent";
import { BrandIcon, type BrandName } from "./brand-icon";

const TASKS: { icon: BrandName; title: string; meta: string }[] = [
  { icon: "gmail", title: "Payment reminder sent", meta: "Gmail · 12:41" },
  { icon: "calendar", title: "Friday chase scheduled", meta: "Google Calendar · 12:41" },
  { icon: "notion", title: "Invoice tracker updated", meta: "Notion · 12:42" },
  { icon: "slack", title: "Posted in #finance", meta: "Slack · 12:42" },
];

const TICK_MS = 750;
const BARS = [6, 10, 16, 9, 14, 20, 12, 7, 15, 18, 10, 6, 13, 17, 9, 5, 11];

function DoneDot() {
  return (
    <svg aria-hidden viewBox="0 0 20 20" className="size-5 shrink-0">
      <circle cx="10" cy="10" r="10" fill="#22A45D" />
      <path d="M5.8 10.4l2.8 2.8 5.6-6" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg aria-hidden viewBox="0 0 20 20" className="size-5 shrink-0 motion-safe:animate-spin" fill="none">
      <circle cx="10" cy="10" r="7.5" stroke="var(--line)" strokeWidth="2.5" />
      <path d="M17.5 10a7.5 7.5 0 0 0-7.5-7.5" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

// Notis-style flow: one message in the chat fans out into finished work across apps, then Tex replies.
export function IntegrationFlow() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });
  const reduce = useReducedMotion();
  const [done, setDone] = useState(0);
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const ids = reduce
      ? [window.setTimeout(() => setDone(TASKS.length), 0)]
      : [window.setTimeout(() => setDone(0), 0), ...TASKS.map((_, i) => window.setTimeout(() => setDone(i + 1), 600 + (i + 1) * TICK_MS))];
    return () => ids.forEach((id) => window.clearTimeout(id));
  }, [inView, run, reduce]);

  const finished = done >= TASKS.length;

  return (
    <div ref={ref} className="relative mx-auto grid max-w-5xl items-center gap-8 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] md:gap-16">
      {/* Dashed connectors between the chat and the work (desktop) */}
      <svg aria-hidden viewBox="0 0 1000 520" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 hidden h-full w-full md:block">
        <path d="M 410 150 C 470 150, 480 70, 545 70" fill="none" stroke="var(--muted)" strokeOpacity="0.45" strokeWidth="1.5" strokeDasharray="5 6" vectorEffect="non-scaling-stroke" />
        <path d="M 545 470 C 480 470, 470 400, 412 400" fill="none" stroke="var(--muted)" strokeOpacity="0.45" strokeWidth="1.5" strokeDasharray="5 6" vectorEffect="non-scaling-stroke" />
        <path d="M 422 393 L 410 400 L 422 407" fill="none" stroke="var(--muted)" strokeOpacity="0.6" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      </svg>

      {/* Phone */}
      <div className="relative mx-auto w-full max-w-sm rounded-[34px] border border-line bg-surface p-2 shadow-window">
        <div className="overflow-hidden rounded-[27px]">
          <div className="flex items-center gap-3 bg-surface px-4 py-3">
            <svg aria-hidden viewBox="0 0 16 16" className="size-4 text-muted" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 3L5 8l5 5" />
            </svg>
            <span className="grid size-8 place-items-center rounded-full bg-accent-soft">
              <AgentFigure who="tex" glyph size={24} label="Tex" />
            </span>
            <span className="text-[14px] font-semibold">Tex</span>
            <span className="ml-auto text-[11px] text-muted">WhatsApp</span>
          </div>
          <div className="flex min-h-[21rem] flex-col gap-2.5 bg-[#F3EFE7] px-4 py-5">
            <div className="ml-auto flex w-[78%] items-center gap-2 rounded-2xl rounded-br-md bg-[#DDF7D4] px-3 py-2.5">
              <svg aria-hidden viewBox="0 0 16 16" className="size-3.5 shrink-0 text-fg/70" fill="currentColor">
                <path d="M4 2.5v11l9-5.5z" />
              </svg>
              <span className="flex flex-1 items-center gap-[2px]">
                {BARS.map((h, i) => (
                  <span key={i} className="w-[3px] rounded-full bg-fg/45" style={{ height: h }} />
                ))}
              </span>
              <span className="text-[11px] text-fg/60">0:11</span>
            </div>
            <div className="ml-auto max-w-[80%] rounded-2xl rounded-br-md bg-[#DDF7D4] px-3.5 py-2.5 text-[14px] leading-snug">
              The Acme invoice from 3 weeks ago, just handle it
              <span className="mt-1 block text-right text-[10px] text-fg/50">12:41 ✓✓</span>
            </div>
            <div className="mt-auto min-h-[5.5rem]">
              <AnimatePresence>
                {finished && (
                  <motion.div
                    initial={reduce ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-[86%] rounded-2xl rounded-bl-md bg-surface px-3.5 py-2.5 text-[14px] leading-snug shadow-soft"
                  >
                    Done. Reminder sent with the payment link. If they stay quiet, I&apos;ll chase again Friday.
                    <span className="mt-1 block text-right text-[10px] text-muted">12:42</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* The work, app by app */}
      <div className="relative flex flex-col gap-2.5">
        <div className="flex items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3 shadow-soft">
          <span className="grid size-9 place-items-center rounded-xl bg-accent-soft">
            <AgentFigure who="tex" glyph size={28} label="Tex" />
          </span>
          <div className="flex-1 leading-tight">
            <p className="text-[14px] font-semibold">Tex</p>
            <p className="text-[12px] text-muted">{finished ? "Task complete" : "Running your task"}</p>
          </div>
          <span className={`size-2.5 rounded-full ${finished ? "bg-[#22A45D]" : "bg-[#22A45D] motion-safe:animate-pulse"}`} />
        </div>

        {TASKS.map((t, i) => {
          const isDone = i < done;
          const active = i === done && !finished && inView;
          return (
            <motion.div
              key={t.title}
              animate={{ opacity: isDone || active ? 1 : 0.55, x: active ? 4 : 0 }}
              transition={{ duration: 0.25 }}
              className="flex items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3 shadow-soft"
            >
              <BrandIcon name={t.icon} size={22} />
              <div className="flex-1 leading-tight">
                <p className="text-[14px] font-semibold">{t.title}</p>
                <p className="text-[12px] text-muted">{t.meta}</p>
              </div>
              {isDone ? <DoneDot /> : active ? <Spinner /> : <span className="size-5 rounded-full border-2 border-line" />}
            </motion.div>
          );
        })}

        <div className="flex items-center gap-3 rounded-2xl border border-dashed border-fg/25 px-4 py-3">
          <span className="flex -space-x-1.5">
            {(["github", "gmail", "notion"] as BrandName[]).map((n) => (
              <span key={n} className="grid size-7 place-items-center rounded-full border border-line bg-surface">
                <BrandIcon name={n} size={13} />
              </span>
            ))}
          </span>
          <p className="text-[13px] text-muted">+ about 20 more apps at launch, and your own MCP servers on Max</p>
        </div>

        {finished && !reduce && (
          <button type="button" onClick={() => setRun((r) => r + 1)} className="mt-1 self-end cursor-pointer text-[12.5px] font-medium text-accent hover:underline">
            Replay
          </button>
        )}
      </div>
    </div>
  );
}
