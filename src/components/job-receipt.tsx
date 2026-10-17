"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import { BrandIcon, type BrandName } from "./brand-icon";

// One text, one receipt: every app action Tex took for the job, printed line by line with what it cost.
// The app shelf lights up as each app gets used. Reading and searching are free; an action that changes something is 1 credit.
const LINES: { app: BrandName; action: string; detail: string; credits: number }[] = [
  { app: "github", action: "Listed the open pull requests", detail: "GitHub · acme/web", credits: 0 },
  { app: "github", action: "Read PR #128 and its tests", detail: "GitHub · 4 files changed", credits: 0 },
  { app: "gmail", action: "Found Maya's last email", detail: "Gmail · from Tuesday", credits: 0 },
  { app: "gmail", action: "Sent Maya the verdict", detail: "Gmail · after your OK", credits: 1 },
];

const SHELF: BrandName[] = ["gmail", "github"];
const LINE_MS = 850;
const TOTAL = LINES.reduce((sum, l) => sum + l.credits, 0);

export function JobReceipt() {
  const ref = useRef<HTMLDivElement>(null);
  const edgeId = useId();
  const inView = useInView(ref, { once: true, margin: "-140px" });
  const reduce = useReducedMotion();
  const [printed, setPrinted] = useState(0);
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const steps = LINES.length + 2; // the lines, then the totals, then Tex's note
    const ids = reduce
      ? [window.setTimeout(() => setPrinted(steps), 0)]
      : [window.setTimeout(() => setPrinted(0), 0), ...Array.from({ length: steps }, (_, i) => window.setTimeout(() => setPrinted(i + 1), 500 + (i + 1) * LINE_MS))];
    return () => ids.forEach((id) => window.clearTimeout(id));
  }, [inView, run, reduce]);

  const shown = LINES.slice(0, printed);
  const used = new Set(shown.map((l) => l.app));
  const current = printed > 0 && printed <= LINES.length ? LINES[printed - 1].app : null;
  const printing = inView && printed < LINES.length + 2;
  const creditsSoFar = shown.reduce((sum, l) => sum + l.credits, 0);

  return (
    <div ref={ref} className="mx-auto grid max-w-5xl grid-cols-1 items-start gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-14">
      {/* The ask, and the apps it touches */}
      <div className="flex flex-col gap-5 md:pt-6">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted">You texted Tex · 12:41</p>
          <div className="mt-2.5 flex items-start gap-3">
            <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-fg px-4 py-3 text-[15px] leading-snug text-white">
              Which PRs on acme/web are ready? Email Maya the list.
              <span className="mt-1.5 flex items-center gap-1.5 text-[11px] text-white/60">
                <svg aria-hidden viewBox="0 0 16 16" className="size-3" fill="currentColor">
                  <path d="M8 1.5a2.5 2.5 0 0 0-2.5 2.5v4a2.5 2.5 0 0 0 5 0V4A2.5 2.5 0 0 0 8 1.5zM3.5 7.5a.75.75 0 0 1 1.5 0 3 3 0 0 0 6 0 .75.75 0 0 1 1.5 0 4.5 4.5 0 0 1-3.75 4.43V14h-1.5v-2.07A4.5 4.5 0 0 1 3.5 7.5z" />
                </svg>
                Voice note, 0:11
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-line bg-surface p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <p className="text-[14px] font-semibold">Apps Tex can use</p>
            <p className="font-mono text-[11px] text-muted">{used.size} used on this job</p>
          </div>
          <ul className="mt-4 grid grid-cols-4 gap-2.5">
            {SHELF.map((app) => {
              const lit = used.has(app);
              const now = current === app;
              return (
                <li
                  key={app}
                  className={`relative grid aspect-square place-items-center rounded-2xl border transition-all duration-500 ${
                    lit ? "border-accent/30 bg-accent-soft/60" : "border-line bg-surface-2/50"
                  } ${now ? "scale-105 shadow-soft" : ""}`}
                >
                  <span className={`transition-all duration-500 ${lit ? "" : "opacity-40 grayscale"}`}>
                    <BrandIcon name={app} size={22} />
                  </span>
                  {lit && <span aria-hidden className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-[#22A45D]" />}
                </li>
              );
            })}
            <li className="grid aspect-square place-items-center rounded-2xl border border-dashed border-line px-1 text-center text-[10.5px] leading-tight text-muted">Your MCP servers (Max)</li>
            <li className="grid aspect-square place-items-center rounded-2xl border border-dashed border-line px-1 text-center text-[10.5px] leading-tight text-muted">More coming</li>
          </ul>
          <p className="mt-4 text-[13px] leading-relaxed text-muted">
            Each app connects once, through its own sign-in screen. Tex never sees your passwords.
          </p>
        </div>
      </div>

      {/* The receipt */}
      <div className="mx-auto w-full max-w-[400px]">
        {/* Printer slot */}
        <div className="relative z-10 flex h-7 items-center rounded-full bg-fg px-4 shadow-soft">
          <span className="h-1 flex-1 rounded-full bg-white/15" />
          <span className={`ml-3 size-2 rounded-full ${printing ? "bg-[#22A45D] motion-safe:animate-pulse" : "bg-white/30"}`} />
        </div>

        <div className="mx-3 -mt-3.5 drop-shadow-[0_14px_22px_rgb(21_21_21/0.12)]">
          <div className="bg-white px-6 pb-5 pt-8 font-mono text-[12px] text-fg">
            <p className="text-center text-[13px] font-semibold tracking-[0.18em]">TEXTCREW</p>
            <p className="mt-1 text-center text-[11px] text-muted">JOB #0142 · TUE 12:41</p>
            <p aria-hidden className="mt-4 overflow-hidden whitespace-nowrap text-line">{"-".repeat(60)}</p>

            <ul className="mt-2 flex flex-col">
              <AnimatePresence initial={false}>
                {shown.map((l) => (
                  <motion.li
                    key={l.action}
                    initial={reduce ? false : { opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-start gap-3 py-2"
                  >
                    <span className="mt-0.5 shrink-0">
                      <BrandIcon name={l.app} size={15} />
                    </span>
                    <span className="min-w-0 flex-1 leading-snug">
                      <span className="block font-sans text-[13.5px] font-medium text-fg">{l.action}</span>
                      <span className="block text-[11px] text-muted">{l.detail}</span>
                    </span>
                    <span className="shrink-0 pt-0.5 text-[12px]">{l.credits === 0 ? "free" : `${l.credits} cr`}</span>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>

            {printed > LINES.length && (
              <motion.div initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
                <p aria-hidden className="mt-2 overflow-hidden whitespace-nowrap text-line">{"-".repeat(60)}</p>
                <div className="mt-2 flex justify-between text-muted">
                  <span>WAITED FOR YOUR OK</span>
                  <span>1</span>
                </div>
                <div className="mt-1 flex justify-between text-[14px] font-semibold">
                  <span>TOTAL</span>
                  <span>{TOTAL} credits</span>
                </div>
                <p className="text-right text-[11px] text-muted">about {TOTAL}¢</p>
              </motion.div>
            )}

            {printed > LINES.length + 1 && (
              <motion.div initial={reduce ? false : { opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <p aria-hidden className="mt-3 overflow-hidden whitespace-nowrap text-line">{"-".repeat(60)}</p>
                <p className="mt-3 font-sans text-[13.5px] leading-relaxed text-fg">
                  “Done. PR #128 is ready to merge, #131 needs a fix. Maya has the note.”
                </p>
                <p className="mt-1 text-[11px] text-muted">— Tex, in your chat</p>
                <div aria-hidden className="mt-4 flex h-8 items-end justify-center gap-[2px]">
                  {Array.from({ length: 44 }, (_, i) => (
                    <span key={i} className="bg-fg" style={{ width: i % 3 === 0 ? 2 : 1, height: i % 5 === 0 ? 32 : 26 }} />
                  ))}
                </div>
              </motion.div>
            )}

            {printed <= LINES.length && (
              <p className="mt-2 text-center text-[11px] text-muted">
                {printed === 0 ? "Waiting for the job…" : `Working · ${creditsSoFar} credit${creditsSoFar === 1 ? "" : "s"} so far`}
              </p>
            )}
          </div>
          {/* Torn edge: a row of small triangles hanging off the paper */}
          <svg aria-hidden className="block h-2 w-full" preserveAspectRatio="none">
            <defs>
              <pattern id={edgeId} width="14" height="8" patternUnits="userSpaceOnUse">
                <path d="M0 0H14L7 8Z" fill="#fff" />
              </pattern>
            </defs>
            <rect width="100%" height="8" fill={`url(#${edgeId})`} />
          </svg>
        </div>

        {!printing && inView && !reduce && (
          <button type="button" onClick={() => setRun((r) => r + 1)} className="mx-auto mt-4 block cursor-pointer text-[12.5px] font-medium text-accent hover:underline">
            Print it again
          </button>
        )}
      </div>
    </div>
  );
}
