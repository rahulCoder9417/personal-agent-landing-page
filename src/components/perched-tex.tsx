"use client";

import { useEffect, useRef, useState } from "react";
import { Tex3D, type StageMode } from "./tex-3d";

const LINES: Record<StageMode, string> = {
  idle: "Hi, I'm Tex. Text me the job.",
  typing: "On it. Moving the meeting and drafting a note to Priya…",
  done: "Done. Moved to tomorrow at 3pm and Priya has the note.",
};

// The 3D Tex sits on the top edge of the product window, the way Strawberry's companions perch on theirs.
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
      <div className="absolute right-[86%] top-[14%] hidden w-60 rounded-2xl rounded-br-md border border-line bg-surface p-3.5 text-left shadow-soft sm:block">
        <p aria-live="polite" className="text-[14px] leading-snug">
          {LINES[mode]}
        </p>
        <button
          type="button"
          onClick={run}
          disabled={mode !== "idle"}
          className="mt-2.5 cursor-pointer text-[13px] font-medium text-accent hover:underline disabled:cursor-default disabled:text-muted disabled:no-underline"
        >
          {mode === "idle" ? "Send Tex a task →" : mode === "typing" ? "Working…" : "Done ✓"}
        </button>
      </div>
    </div>
  );
}
