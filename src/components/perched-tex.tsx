"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import type { AgentId } from "@/lib/content";
import { AgentFigure } from "./agent";
import { Agent3D } from "./agent-3d";
import { Tex3D, type StageMode } from "./tex-3d";

// One tap plays a short hand-off: Tex takes the job, calls two crew members, and reports back.
// step: 0 idle · 1 Tex thinking · 2 Tock called · 3 Echo called · 4 Tock done · 5 Echo done · 6 Tex done
// The crew stays on screen through step 6 and leaves when the demo resets.
const TIMELINE: [number, number][] = [
  [0, 1],
  [900, 2],
  [1500, 3],
  [2700, 4],
  [3400, 5],
  [4000, 6],
  [11000, 0],
];

const CREW_TASKS: { who: AgentId; name: string; color: string; doing: string; done: string; calledAt: number; doneAt: number }[] = [
  { who: "tock", name: "Tock", color: "#D9521A", doing: "Moving your 3pm…", done: "Moved to tomorrow, 3pm", calledAt: 2, doneAt: 4 },
  { who: "echo", name: "Echo", color: "#C22866", doing: "Drafting the note to Priya…", done: "Note ready for your OK", calledAt: 3, doneAt: 5 },
];

function Spinner({ color }: { color: string }) {
  return (
    <svg aria-hidden viewBox="0 0 16 16" className="size-3.5 motion-safe:animate-spin" fill="none">
      <circle cx="8" cy="8" r="6" stroke={color} strokeOpacity="0.25" strokeWidth="2.5" />
      <path d="M14 8a6 6 0 0 0-6-6" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function Check({ color }: { color: string }) {
  return (
    <svg aria-hidden viewBox="0 0 16 16" className="size-3.5" fill="none" stroke={color} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.5 8.5l3 3 6-7" />
    </svg>
  );
}

export function PerchedTex() {
  const [step, setStep] = useState(0);
  const [run, setRun] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (run === 0) return;
    const ids = TIMELINE.map(([at, next]) => window.setTimeout(() => setStep(next), at));
    return () => ids.forEach((id) => window.clearTimeout(id));
  }, [run]);

  // Warm up the crew renders so they pop in instantly when Tex calls them.
  useEffect(() => {
    const id = window.setTimeout(() => {
      import("@/lib/agent-studio")
        .then(({ renderAgent }) => Promise.all(CREW_TASKS.map((t) => renderAgent(t.who, "left"))))
        .catch(() => {});
    }, 1500);
    return () => window.clearTimeout(id);
  }, []);

  function start() {
    if (step === 0) setRun((r) => r + 1);
  }

  function replay() {
    setStep(0);
    setRun((r) => r + 1);
  }

  const mode: StageMode = step === 0 ? "idle" : step === 6 ? "done" : "typing";
  const calling = step >= 2 && step < 6;
  const pop = reduce
    ? { initial: false as const, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, y: 28, scale: 0.85 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 16, scale: 0.9 },
        transition: { type: "spring" as const, stiffness: 260, damping: 20 },
      };

  return (
    <div className="absolute -top-[250px] right-2 z-10 h-[300px] w-[270px] sm:-top-[284px] sm:right-[36%] sm:h-[340px] sm:w-[310px]">
      {/* Crew members Tex calls in, standing on the window edge to its left */}
      <div aria-hidden className="pointer-events-none absolute bottom-[13%] right-[80%] hidden items-end sm:flex">
        <AnimatePresence>
          {[...CREW_TASKS].reverse().map((t) =>
            step >= t.calledAt ? (
              <motion.div key={t.who} {...pop} className="relative flex flex-col items-center" style={{ marginBottom: -21, marginInline: -24 }}>
                <span
                  className="mb-1 inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border bg-surface px-2.5 py-1 text-[11px] font-medium shadow-soft"
                  style={{ borderColor: `${t.color}40`, color: t.color }}
                >
                  {step >= t.doneAt ? <Check color={t.color} /> : <Spinner color={t.color} />}
                  {t.name}
                </span>
                <Agent3D who={t.who} size={140} pose="left" />
              </motion.div>
            ) : null,
          )}
        </AnimatePresence>
      </div>

      <Tex3D mode={mode} onActivate={start} />

      {/* Tex's speech bubble, to its right */}
      <div className="absolute left-[74%] top-[14%] hidden w-[19rem] sm:block">
        <div className="relative rounded-2xl border border-line bg-surface px-4 py-3.5 text-left shadow-soft">
          <span aria-hidden className="absolute -left-[8px] top-9 size-4 rotate-45 rounded-[3px] border-b border-l border-line bg-surface" />
          <p className="flex items-center gap-1.5 font-mono text-[11px] tracking-[0.06em] text-muted">
            <span aria-hidden className="brand-caret h-3 w-1 bg-accent" />
            TEX
            {step >= 1 && step < 6 && <span className="text-accent">· {calling ? "calling the crew" : "thinking"}</span>}
          </p>

          <div aria-live="polite" className="mt-1.5 text-[15px] leading-snug">
            {step === 0 && <p>Hi, I&apos;m Tex. Text me the job.</p>}
            {step === 1 && <p>On it: move your 3pm with Priya and let her know. Calling the crew…</p>}
            {step >= 2 && step < 6 && <p>I&apos;ve split the job between two crewmates.</p>}
            {step === 6 && <p>Done. Moved to tomorrow at 3pm, and Priya gets the note once you approve.</p>}
          </div>

          {step >= 2 && step < 6 && (
            <ul className="mt-3 flex flex-col gap-2">
              {CREW_TASKS.map((t) =>
                step >= t.calledAt ? (
                  <li key={t.who} className="flex items-center gap-2.5 rounded-xl bg-surface-2/70 px-2.5 py-2">
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-surface">
                      <AgentFigure who={t.who} glyph size={22} />
                    </span>
                    <span className="min-w-0 flex-1 text-[13px] leading-tight">
                      <span className="font-semibold">{t.name}</span>
                      <span className="block truncate text-muted">{step >= t.doneAt ? t.done : t.doing}</span>
                    </span>
                    {step >= t.doneAt ? <Check color={t.color} /> : <Spinner color={t.color} />}
                  </li>
                ) : null,
              )}
            </ul>
          )}

          {step === 6 && <p className="mt-2 text-[12px] text-muted">A preview of the crew. At launch, Tex handles this on its own.</p>}

          {(step === 0 || step === 6) && (
            <button
              type="button"
              onClick={step === 6 ? replay : start}
              className="mt-3 inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full bg-accent px-3.5 text-[13px] font-medium text-white transition-opacity hover:opacity-90"
            >
              {step === 0 ? "Send Tex a task" : "Run it again"}
              <span aria-hidden>→</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
