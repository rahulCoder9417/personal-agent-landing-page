"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";
import type { AgentId } from "@/lib/content";
import { AgentFigure } from "./agent";
import { Agent3D } from "./agent-3d";
import { Tex3D, type StageMode } from "./tex-3d";

// One tap plays a short hand-off: Tex takes the job, two crew members pop up at their own laptops and
// work on their piece, each leaves once its job is done, then Tex reports back.
// step: 0 idle · 1 Tex thinking · 2 Tock arrives · 3 Echo arrives · 4 Tock done · 5 Echo done
//       6 Tock leaves · 7 Echo leaves · 8 Tex done
const TIMELINE: [number, number][] = [
  [0, 1],
  [1600, 2],
  [2900, 3],
  [6400, 4],
  [7800, 5],
  [8800, 6],
  [10200, 7],
  [11000, 8],
  [22000, 0],
];
const DONE_STEP = 8;
const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const STEP_AT = Object.fromEntries(TIMELINE.map(([at, s]) => [s, at]));

const CREW_TASKS: {
  who: AgentId;
  name: string;
  color: string;
  doing: string;
  done: string;
  calledAt: number;
  doneAt: number;
  leaveAt: number;
}[] = [
  { who: "tock", name: "Tock", color: "#D9521A", doing: "Moving your 3pm…", done: "Moved to tomorrow, 3pm", calledAt: 2, doneAt: 4, leaveAt: 6 },
  { who: "echo", name: "Echo", color: "#C22866", doing: "Drafting the note to Maya…", done: "Note ready for your OK", calledAt: 3, doneAt: 5, leaveAt: 7 },
];

// Swaps text with a short fade instead of a hard cut.
function FadeText({ id, className, children }: { id: string; className?: string; children: ReactNode }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={id}
        className={className}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        {children}
      </motion.span>
    </AnimatePresence>
  );
}

const WORK_FRAMES = ["work-a", "work-b"] as const;

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

// An agent typing at its laptop: two still renders swapped back and forth while it's busy.
function AtLaptop({ who, size, busy, reduce }: { who: AgentId; size: number; busy: boolean; reduce: boolean }) {
  const [frames, setFrames] = useState<string[] | null>(null);
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    let alive = true;
    import("@/lib/agent-studio")
      .then(({ renderAgent }) => Promise.all(WORK_FRAMES.map((f) => renderAgent(who, f))))
      .then((urls) => {
        if (alive) setFrames(urls);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [who]);

  useEffect(() => {
    if (!busy || reduce || !frames) return;
    const id = window.setInterval(() => setFrame((f) => 1 - f), 560);
    return () => window.clearInterval(id);
  }, [busy, reduce, frames]);

  if (!frames) return <Agent3D who={who} size={size} pose="left" />;
  const shown = busy ? frame : 0;
  return (
    <span className="relative inline-block" style={{ width: size, height: size }}>
      {frames.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element -- generated in the browser as a data URL
        <img
          key={i}
          src={src}
          alt={i === 0 ? `${who} working at a laptop` : ""}
          width={size}
          height={size}
          draggable={false}
          className={`absolute inset-0 h-full w-full select-none ${i === shown ? "opacity-100" : "opacity-0"}`}
        />
      ))}
    </span>
  );
}

function CrewMember({ task, step, reduce }: { task: (typeof CREW_TASKS)[number]; step: number; reduce: boolean }) {
  const done = step >= task.doneAt;
  const workSeconds = (STEP_AT[task.doneAt] - STEP_AT[task.calledAt]) / 1000;

  return (
    <motion.div
      className="relative flex flex-col items-center"
      style={{ marginBottom: -21, marginInline: 6 }}
      // Rises into its own spot, and sinks away once its job is done
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 26, scale: 0.86 }}
      animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.9, ease: EASE_OUT } }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.88, transition: { duration: 0.7, ease: "easeIn" } }}
    >
      {/* Status chip with a progress bar that fills while the agent works */}
      <div className="relative z-10 mb-1 w-[9.5rem] overflow-hidden rounded-xl border bg-surface px-2.5 pb-2 pt-1.5 shadow-soft" style={{ borderColor: `${task.color}33` }}>
        <p className="flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: task.color }}>
          {done ? <Check color={task.color} /> : <Spinner color={task.color} />}
          {task.name}
        </p>
        <p className="mt-0.5 truncate text-[11px] text-muted">
          <FadeText id={done ? "done" : "doing"}>{done ? task.done : task.doing}</FadeText>
        </p>
        <div className="mt-1.5 h-1 overflow-hidden rounded-full" style={{ background: `${task.color}1f` }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: task.color }}
            initial={{ width: "0%" }}
            animate={{ width: done ? "100%" : "92%" }}
            transition={{ duration: done ? 0.4 : workSeconds, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* Landing ring where it appears */}
      {!reduce && (
        <motion.span
          aria-hidden
          className="absolute bottom-3 left-1/2 h-4 w-24 -translate-x-1/2 rounded-[50%] border-2"
          style={{ borderColor: task.color }}
          initial={{ opacity: 0.7, scale: 0.3 }}
          animate={{ opacity: 0, scale: 1.6 }}
          transition={{ duration: 1.2, delay: 0.3 }}
        />
      )}

      {/* A quick typing jiggle while working, one hop when done */}
      <motion.div
        animate={reduce ? undefined : done ? { y: [0, -12, 0] } : { y: [0, -2, 0] }}
        transition={done ? { duration: 0.6, ease: "easeOut" } : { duration: 0.36, repeat: Infinity, ease: "easeInOut" }}
      >
        <AtLaptop who={task.who} size={150} busy={!done} reduce={reduce} />
      </motion.div>
    </motion.div>
  );
}

export function PerchedTex() {
  const [step, setStep] = useState(0);
  const [run, setRun] = useState(0);
  const reduce = useReducedMotion() ?? false;

  useEffect(() => {
    if (run === 0) return;
    const ids = TIMELINE.map(([at, next]) => window.setTimeout(() => setStep(next), at));
    return () => ids.forEach((id) => window.clearTimeout(id));
  }, [run]);

  // Warm up the crew renders so they pop in instantly when Tex calls them.
  useEffect(() => {
    const id = window.setTimeout(() => {
      import("@/lib/agent-studio")
        .then(({ renderAgent }) => Promise.all(CREW_TASKS.flatMap((t) => WORK_FRAMES.map((f) => renderAgent(t.who, f)))))
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

  const mode: StageMode = step === 0 ? "idle" : step === DONE_STEP ? "done" : "typing";
  const working = step >= 2 && step < DONE_STEP;
  const phase = step === 0 ? "idle" : step === 1 ? "thinking" : working ? "working" : "done";

  return (
    <div className="absolute -top-[250px] right-2 z-10 h-[300px] w-[270px] sm:-top-[284px] sm:right-[38%] sm:h-[340px] sm:w-[310px]">
      {/* Crew members at their own laptops, standing on the window edge well to Tex's left */}
      <div aria-hidden className="pointer-events-none absolute bottom-[13%] right-[92%] hidden items-end sm:flex">
        <AnimatePresence>
          {[...CREW_TASKS].reverse().map((t) =>
            step >= t.calledAt && step < t.leaveAt ? <CrewMember key={t.who} task={t} step={step} reduce={reduce} /> : null,
          )}
        </AnimatePresence>
      </div>

      <Tex3D mode={mode} onActivate={start} />

      {/* Tex's speech bubble, to its right with room to breathe */}
      <div className="absolute left-[94%] top-[12%] hidden w-[20rem] sm:block">
        <div className="relative rounded-2xl border border-line bg-surface px-5 py-4 text-left shadow-soft">
          <span aria-hidden className="absolute -left-[8px] top-10 size-4 rotate-45 rounded-[3px] border-b border-l border-line bg-surface" />
          <p className="flex items-center gap-1.5 font-mono text-[11px] tracking-[0.06em] text-muted">
            <span aria-hidden className="brand-caret h-3 w-1 bg-accent" />
            TEX
            {(phase === "thinking" || phase === "working") && (
              <FadeText id={phase} className="text-accent">
                · {phase === "working" ? "crew at work" : "thinking"}
              </FadeText>
            )}
          </p>

          <p aria-live="polite" className="mt-2 text-[15px] leading-relaxed">
            <FadeText id={phase} className="block">
              {phase === "idle" && <>Hi, I&apos;m Tex. Got a lot on? Text me the job.</>}
              {phase === "thinking" && <>On it: move your 3pm with Maya and let her know. Calling the crew…</>}
              {phase === "working" && <>I&apos;ve split the job between two crewmates.</>}
              {phase === "done" && <>Done. Moved to tomorrow at 3pm, and Maya gets the note once you approve.</>}
            </FadeText>
          </p>

          {working && (
            <ul className="mt-3.5 flex flex-col gap-2">
              {CREW_TASKS.map((t) =>
                step >= t.calledAt ? (
                  <motion.li
                    key={t.who}
                    initial={reduce ? false : { opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, ease: EASE_OUT }}
                    className="flex items-center gap-2.5 rounded-xl bg-surface-2/70 px-3 py-2"
                  >
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-surface">
                      <AgentFigure who={t.who} glyph size={22} />
                    </span>
                    <span className="min-w-0 flex-1 text-[13px] leading-tight">
                      <span className="font-semibold">{t.name}</span>
                      <FadeText id={step >= t.doneAt ? "done" : "doing"} className="block truncate text-muted">
                        {step >= t.doneAt ? t.done : t.doing}
                      </FadeText>
                    </span>
                    {step >= t.doneAt ? <Check color={t.color} /> : <Spinner color={t.color} />}
                  </motion.li>
                ) : null,
              )}
            </ul>
          )}

          {phase === "done" && <p className="mt-2.5 text-[12px] leading-relaxed text-muted">A preview of the crew. At launch, Tex handles this on its own.</p>}

          {(phase === "idle" || phase === "done") && (
            <button
              type="button"
              onClick={phase === "done" ? replay : start}
              className="mt-4 inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full bg-accent px-4 text-[13px] font-medium text-white transition-opacity hover:opacity-90"
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
