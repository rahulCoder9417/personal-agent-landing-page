"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { steps } from "@/lib/content";
import { AgentFigure } from "./agent";
import { BrandIcon } from "./brand-icon";
import { Section } from "./section";

// The story told the way you'd actually live it: on your phone's lock screen, one notification at a time.
const BEATS = [
  { title: "Text the job", body: "In Telegram or the web app. Type it, or send a voice note.", ms: 3800 },
  { title: "Tex splits it up", body: "It breaks the job into steps and starts on each one.", ms: 3600 },
  { title: "You OK the risky part", body: "Anything that sends, deletes or spends waits for your tap.", ms: 4400 },
  { title: "Done, and logged", body: "One reply when it's finished. Every step lands in your activity log.", ms: 4800 },
];

const ASK = "Move my 3pm with Maya to tomorrow and let her know";
// The two pieces Tex splits this job into, one per app.
const SPLIT = [
  { app: "calendar", label: "Move the 3pm" },
  { app: "gmail", label: "Note to Maya" },
] as const;
const TYPE_MS = 2200;
const AUTO_TAP_MS = 2300;

function Check({ className = "size-3.5" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.5 8.5l3 3 6-7" />
    </svg>
  );
}

function Notification({ title, tone = "light", children }: { title: ReactNode; tone?: "light" | "dark"; children: ReactNode }) {
  const dark = tone === "dark";
  return (
    <div
      className={`rounded-[20px] px-3.5 py-3 text-left shadow-[0_10px_30px_-14px_rgb(21_21_21/0.35)] backdrop-blur-md ${
        dark ? "bg-fg/90 text-white" : "border border-white/70 bg-white/80 text-fg"
      }`}
    >
      <div className="flex items-center gap-2">
        {dark ? (
          <span className="grid size-5 place-items-center rounded-md bg-white">
            <BrandIcon name="telegram" size={12} />
          </span>
        ) : (
          <span className="grid size-5 place-items-center rounded-md bg-accent-soft">
            <AgentFigure who="tex" glyph size={16} />
          </span>
        )}
        <span className="text-[12.5px] font-semibold">{title}</span>
        <span className={`ml-auto text-[11px] ${dark ? "text-white/60" : "text-muted"}`}>now</span>
      </div>
      <div className="mt-1.5 text-[13.5px] leading-snug">{children}</div>
    </div>
  );
}

function LockScreen({ beat, typed, tapping, approved, onApprove }: { beat: number; typed: number; tapping: boolean; approved: boolean; onApprove: () => void }) {
  const reduce = useReducedMotion();

  const cards: { id: string; node: ReactNode }[] = [];
  cards.push({
    id: "ask",
    node: (
      <Notification title="You → Tex" tone="dark">
        {ASK.slice(0, typed)}
        {typed < ASK.length ? (
          <span aria-hidden className="brand-caret ml-px inline-block h-3.5 w-[2px] translate-y-0.5 bg-white" />
        ) : (
          <span className="mt-1 block text-right text-[10.5px] text-white/60">Delivered ✓✓</span>
        )}
      </Notification>
    ),
  });
  if (beat >= 1) {
    cards.push({
      id: "split",
      node: (
        <Notification title="Tex">
          On it. Moving your 3pm in Calendar and drafting the note to Maya in Gmail.
          {beat < 3 && (
            <span className="mt-2 flex gap-1.5">
              {SPLIT.map((s) => (
                <span key={s.app} className="flex items-center gap-1.5 rounded-full bg-surface-2 py-0.5 pl-1.5 pr-2 text-[11px] font-medium">
                  <BrandIcon name={s.app} size={12} />
                  {s.label}
                  {beat > 1 ? <Check className="size-3 text-[#22A45D]" /> : <span className="size-1.5 rounded-full bg-accent motion-safe:animate-pulse" />}
                </span>
              ))}
            </span>
          )}
        </Notification>
      ),
    });
  }
  if (beat >= 2) {
    cards.push({
      id: "ok",
      node: (
        <Notification title={<span className="text-accent">Tex · Needs your OK</span>}>
          <span className="font-semibold">Email to Maya</span>
          {!approved && (
            <span className="mt-1 block rounded-xl bg-surface-2 px-2.5 py-2 text-[12.5px] text-muted">
              “Hi Maya, could we move today&apos;s 3pm to tomorrow, same time? Thanks!”
            </span>
          )}
          {approved ? (
            <span className="mt-2 flex items-center justify-center gap-1.5 rounded-full bg-[#E7F6EC] py-1.5 text-[12.5px] font-medium text-[#14713D]">
              <Check /> Approved · sending
            </span>
          ) : (
            <span className="mt-2 grid grid-cols-2 gap-1.5">
              <span className="grid h-8 place-items-center rounded-full border border-line bg-surface text-[12.5px] font-medium">Not now</span>
              <button
                type="button"
                onClick={onApprove}
                className="relative grid h-8 cursor-pointer place-items-center overflow-hidden rounded-full bg-fg text-[12.5px] font-medium text-white"
              >
                Approve
                {tapping && !reduce && (
                  <motion.span
                    aria-hidden
                    className="absolute size-8 rounded-full bg-white/40"
                    initial={{ scale: 0, opacity: 0.9 }}
                    animate={{ scale: 4, opacity: 0 }}
                    transition={{ duration: 0.6 }}
                  />
                )}
              </button>
            </span>
          )}
        </Notification>
      ),
    });
  }
  if (beat >= 3) {
    cards.push({
      id: "done",
      node: (
        <Notification title="Tex">
          Done. Moved to tomorrow at 3pm, and Maya has the note.
          <span className="mt-1.5 block font-mono text-[10.5px] text-muted">3 credits · in your activity log</span>
        </Notification>
      ),
    });
  }

  // The approval card is tall, so on that beat only the two newest show in full.
  const maxVisible = beat === 2 ? 2 : 3;

  return (
    <div className="relative mx-auto w-full max-w-[340px] rounded-[48px] border border-line bg-surface p-2.5 shadow-window">
      <div className="relative h-[640px] overflow-hidden rounded-[40px] bg-[linear-gradient(165deg,#DFE5FF_0%,#EEEAFF_42%,#FAF2E8_100%)]">
        {/* Faint Tex on the wallpaper */}
        <div aria-hidden className="absolute -bottom-10 left-1/2 -translate-x-1/2 opacity-[0.08]">
          <AgentFigure who="tex" glyph size={300} />
        </div>

        <div className="flex items-center justify-between px-7 pt-4 text-[12px] font-semibold text-fg/80">
          <span>9:41</span>
          <span aria-hidden className="flex items-center gap-1">
            <span className="flex items-end gap-[2px]">
              {[4, 6, 8, 10].map((h) => (
                <span key={h} className="w-[3px] rounded-sm bg-fg/80" style={{ height: h }} />
              ))}
            </span>
            <span className="ml-1 h-[11px] w-[22px] rounded-[3px] border border-fg/50 p-[1.5px]">
              <span className="block h-full w-3/4 rounded-[1px] bg-fg/80" />
            </span>
          </span>
        </div>

        <div className="mt-5 text-center">
          <p className="text-[13px] font-medium text-fg/60">Tuesday 30 September</p>
          <p className="text-[62px] font-semibold leading-none tracking-[-0.04em] text-fg/85">9:41</p>
        </div>

        {/* Newest on top; like iOS, older notifications fold into a stack underneath */}
        <div className="absolute inset-x-3 top-[168px] flex flex-col gap-2">
          <AnimatePresence initial={false}>
            {[...cards].reverse().slice(0, maxVisible).map((c) => (
              <motion.div
                key={c.id}
                layout={!reduce}
                initial={reduce ? false : { opacity: 0, y: -14, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                {c.node}
              </motion.div>
            ))}
            {cards.length > maxVisible && (
              <motion.div
                key="older"
                layout={!reduce}
                aria-hidden
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                className="-mt-3.5 flex flex-col items-center"
              >
                <span className="h-3 w-[94%] rounded-b-[18px] bg-white/70 shadow-[0_6px_14px_-8px_rgb(21_21_21/0.3)]" />
                <span className="h-2.5 w-[88%] rounded-b-[16px] bg-white/45" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Lock screen shortcuts and home bar */}
        <div aria-hidden className="absolute inset-x-0 bottom-0 flex items-end justify-between px-9 pb-9">
          <span className="grid size-11 place-items-center rounded-full bg-fg/10 backdrop-blur">
            <svg viewBox="0 0 16 16" className="size-4 text-fg/70" fill="currentColor">
              <path d="M5 1h6l-1 5h2l-6 9 1-6H4z" />
            </svg>
          </span>
          <span className="grid size-11 place-items-center rounded-full bg-fg/10 backdrop-blur">
            <svg viewBox="0 0 16 16" className="size-4 text-fg/70" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="1.5" y="4" width="13" height="9" rx="2" />
              <circle cx="8" cy="8.5" r="2.5" />
              <path d="M5.5 4l1-2h3l1 2" />
            </svg>
          </span>
        </div>
        <span aria-hidden className="absolute bottom-2.5 left-1/2 h-[5px] w-28 -translate-x-1/2 rounded-full bg-fg/70" />
      </div>
    </div>
  );
}

export function HowItWorks() {
  const reduce = useReducedMotion() ?? false;
  const [beat, setBeat] = useState(0);
  const [typed, setTyped] = useState(0);
  const [tapping, setTapping] = useState(false);
  const [approved, setApproved] = useState(false);
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-100px" });
  const running = inView && !paused && !reduce;

  function go(next: number) {
    setBeat(next);
    setApproved(next > 2);
    setTapping(false);
    setTyped(next === 0 && !reduce ? 0 : ASK.length);
  }

  // Types the message out while the first beat plays.
  useEffect(() => {
    if (beat !== 0 || !running || typed >= ASK.length) return;
    const id = window.setTimeout(() => setTyped((t) => t + 1), TYPE_MS / ASK.length);
    return () => window.clearTimeout(id);
  }, [beat, running, typed]);

  // On the approval beat, a finger taps Approve unless you get there first.
  useEffect(() => {
    if (beat !== 2 || approved || !running) return;
    const tap = window.setTimeout(() => setTapping(true), AUTO_TAP_MS - 300);
    const ok = window.setTimeout(() => setApproved(true), AUTO_TAP_MS);
    return () => {
      window.clearTimeout(tap);
      window.clearTimeout(ok);
    };
  }, [beat, approved, running]);

  // Moves to the next beat, and loops back to the start after the last one.
  useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(() => go((beat + 1) % BEATS.length), BEATS[beat].ms);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- go only sets state
  }, [running, beat]);

  function approveNow() {
    setApproved(true);
    window.setTimeout(() => go(3), 700);
  }

  const shownBeat = reduce ? BEATS.length - 1 : beat;

  return (
    <Section
      id="how"
      eyebrow="How it works"
      title="Text it. Tex handles the rest."
      lede="No new app to learn. You send a text, Tex splits the job into steps, and anything risky waits for your tap."
    >
      <div
        ref={ref}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] md:gap-16"
      >
        <ol className="flex flex-col gap-2">
          {BEATS.map((b, i) => {
            const active = i === shownBeat;
            return (
              <li key={b.title}>
                <button
                  type="button"
                  onClick={() => go(i)}
                  aria-current={active ? "step" : undefined}
                  className={`relative flex w-full cursor-pointer gap-4 overflow-hidden rounded-2xl border p-5 text-left transition-colors ${
                    active ? "border-line bg-surface shadow-soft" : "border-transparent hover:bg-surface/60"
                  }`}
                >
                  <span
                    className={`grid size-8 shrink-0 place-items-center rounded-full font-mono text-[12px] transition-colors ${
                      active ? "bg-fg text-white" : i < shownBeat ? "bg-accent-soft text-accent" : "bg-surface-2 text-muted"
                    }`}
                  >
                    {i < shownBeat ? <Check /> : i + 1}
                  </span>
                  <span className="min-w-0">
                    <span className={`block text-[17px] font-semibold tracking-[-0.02em] ${active ? "text-fg" : "text-fg/70"}`}>{b.title}</span>
                    <span className={`mt-1 block text-[14.5px] leading-relaxed ${active ? "text-muted" : "text-muted/80"}`}>{b.body}</span>
                  </span>
                  {active && running && (
                    <motion.span
                      key={`bar-${i}`}
                      aria-hidden
                      className="absolute bottom-0 left-0 h-[2px] bg-accent"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: b.ms / 1000, ease: "linear" }}
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ol>

        <LockScreen beat={shownBeat} typed={reduce ? ASK.length : typed} tapping={tapping} approved={reduce || approved} onApprove={approveNow} />
      </div>

      {/* Setup, in four steps */}
      <ol className="mx-auto mt-20 grid max-w-5xl gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <li key={s.title} className="border-t border-line pt-4">
            <p className="flex items-center gap-2 font-semibold">
              <span className="grid size-6 place-items-center rounded-full bg-accent-soft font-mono text-[11px] text-accent">{i + 1}</span>
              {s.title}
            </p>
            <p className="mt-2 text-[14px] leading-relaxed text-muted">{s.body}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
