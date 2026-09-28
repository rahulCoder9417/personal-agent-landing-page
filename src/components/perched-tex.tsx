"use client";

import { useEffect, useRef, useState } from "react";
import { Tex3D, type StageMode } from "./tex-3d";

const LINES: Record<StageMode, string> = {
  idle: "Hi, I'm Tex. Text me the job.",
  typing: "On it. Moving the meeting and drafting a note to Priya…",
  done: "Done. Moved to tomorrow at 3pm and Priya has the note.",
};

// The 3D Tex sits on the top edge of the product window, the way Strawberry's companions perch on theirs,
// with a speech bubble that points at its head.
export function PerchedTex() {
  const [mode, setMode] = useState<StageMode>("idle");
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((t) => window.clearTimeout(t));
  }, []);

  function run() {
    if (mode !== "idle") return;
    setMode("typing");
    timers.current.push(
      window.setTimeout(() => setMode("done"), 2800),
      window.setTimeout(() => setMode("idle"), 7500),
    );
  }

  return (
    <div className="absolute -top-[250px] right-2 z-10 h-[300px] w-[270px] sm:-top-[284px] sm:right-10 sm:h-[340px] sm:w-[310px]">
      <Tex3D mode={mode} onActivate={run} />
      <div className="absolute right-[72%] top-[20%] hidden w-64 sm:block">
        <div className="relative rounded-2xl border border-line bg-surface px-4 py-3.5 text-left shadow-soft">
          <p className="flex items-center gap-1.5 font-mono text-[11px] tracking-[0.06em] text-muted">
            <span aria-hidden className="brand-caret h-3 w-1 bg-accent" />
            TEX
            {mode === "typing" && <span className="text-accent">· typing</span>}
          </p>
          <p aria-live="polite" className="mt-1.5 text-[15px] leading-snug">
            {LINES[mode]}
          </p>
          <button
            type="button"
            onClick={run}
            disabled={mode !== "idle"}
            className="mt-3 inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full bg-accent px-3.5 text-[13px] font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-default disabled:bg-surface-2 disabled:text-muted"
          >
            {mode === "idle" ? "Send Tex a task" : mode === "typing" ? "Working…" : "Done"}
            {mode === "idle" && <span aria-hidden>→</span>}
          </button>
          <span aria-hidden className="absolute -right-[8px] top-9 size-4 rotate-45 rounded-[3px] border-r border-t border-line bg-surface" />
        </div>
      </div>
    </div>
  );
}
