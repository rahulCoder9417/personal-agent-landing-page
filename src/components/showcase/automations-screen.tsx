"use client";

// The Automations list as the web app draws it (user-frontend-web src/components/automations/
// automation-list.tsx and parts.tsx): the headline with the plan's count, filter buttons, and one row
// per automation with its apps, when it runs, the last and next run, and its switch.

import { useState, type ReactNode } from "react";
import { AgentFigure } from "../agent";
import { AUTOMATIONS, type DemoAutomation } from "./data";
import { AppIcon, buttonClass, CalendarIcon, ChatIcon, Chip, ClockIcon, cn, Dot, PlusIcon, Switch } from "./ui";

const T1 = "text-[24px] leading-8 font-semibold tracking-[-0.015em]";
const T2 = "text-[14px] leading-5";
const T3 = "text-[12px] leading-4";

// The table's columns once the sheet is wide enough; narrower, each row stacks.
const GRID = "@min-[700px]:grid-cols-[96px_minmax(0,1fr)_112px_136px_48px]";

type Filter = "all" | "schedule" | "event" | "needs";

function Mark({ slug }: { slug: DemoAutomation["marks"][number] }) {
  if (slug === "tex" || slug === "patch") return <AgentFigure who={slug} mood="ready" glyph size={28} label="" />;
  if (slug === "schedule" || slug === "once")
    return (
      <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-surface-2 text-fg">
        {slug === "schedule" ? <ClockIcon size={14} strokeWidth={2} /> : <CalendarIcon size={14} strokeWidth={2} />}
      </span>
    );
  return <AppIcon name={slug} size={28} />;
}

function LogoStack({ marks, dim }: { marks: DemoAutomation["marks"]; dim: boolean }) {
  return (
    <span aria-hidden className={cn("flex items-center", dim && "opacity-50")}>
      {marks.map((slug, i) => (
        <span key={slug} className={cn("grid rounded-[10px] bg-surface shadow-[0_0_0_2px_var(--surface)]", i > 0 && "-ml-1")}>
          <Mark slug={slug} />
        </span>
      ))}
    </span>
  );
}

function FilterButton({ on, onClick, count, children }: { on: boolean; onClick: () => void; count: number; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={cn(
        T3,
        "inline-flex h-8 cursor-pointer items-center gap-2 rounded-full px-3 font-medium transition-colors",
        on ? "bg-fg text-white" : "bg-surface text-fg shadow-[inset_0_0_0_1px_var(--line-strong)] hover:bg-bg",
      )}
    >
      {children}
      <span className={on ? "text-[#bdb8ae]" : "text-muted"}>{count}</span>
    </button>
  );
}

export function AutomationsScreen({ enabled, onToggle }: { enabled: Record<string, boolean>; onToggle: (id: string) => void }) {
  const [filter, setFilter] = useState<Filter>("all");
  const running = AUTOMATIONS.filter((a) => enabled[a.id]).length;
  const paused = AUTOMATIONS.length - running;
  const count = (which: Filter) => (which === "all" ? AUTOMATIONS.length : which === "needs" ? 0 : AUTOMATIONS.filter((a) => a.kind === which).length);
  const shown = AUTOMATIONS.filter((a) => filter === "all" || a.kind === filter);

  return (
    <div className="scroll-pane min-h-0 flex-1 overflow-y-auto">
      <div className="flex w-full min-w-0 flex-col gap-6 px-4 pt-5 pb-10 @min-[600px]:px-8 @min-[600px]:pt-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex min-w-0 flex-col gap-1">
            <h2 className={T1}>Automations</h2>
            <p className={cn(T2, "text-muted")}>
              {running} running{paused ? ` · ${paused} paused` : ""} · {AUTOMATIONS.length} of 5 on your Pro plan
            </p>
          </div>
          <div aria-hidden className="flex items-center gap-2">
            <span className={buttonClass("secondary", "md", "cursor-default rounded-[10px]")}>
              <ChatIcon size={16} />
              Ask Tex
            </span>
            <span className={buttonClass("primary", "md", "cursor-default rounded-[10px]")}>
              <PlusIcon size={16} />
              New automation
            </span>
          </div>
        </header>

        <section aria-label="Your automations" className="flex min-w-0 flex-col gap-4">
          <div role="group" aria-label="Show" className="flex flex-wrap gap-2">
            <FilterButton on={filter === "all"} onClick={() => setFilter("all")} count={count("all")}>
              All
            </FilterButton>
            <FilterButton on={filter === "schedule"} onClick={() => setFilter("schedule")} count={count("schedule")}>
              On a schedule
            </FilterButton>
            <FilterButton on={filter === "event"} onClick={() => setFilter("event")} count={count("event")}>
              When something happens
            </FilterButton>
            <FilterButton on={filter === "needs"} onClick={() => setFilter("needs")} count={count("needs")}>
              Needs you
            </FilterButton>
          </div>

          <div className="rounded-2xl bg-surface shadow-[0_0_0_1px_var(--line)]">
            <ul>
              <li aria-hidden className={cn(T3, "hidden gap-4 px-6 py-3 font-medium text-muted @min-[700px]:grid", GRID)}>
                <span>Apps</span>
                <span>Automation</span>
                <span>Last run</span>
                <span>Next run</span>
                <span className="text-right">On</span>
              </li>
              {shown.map((a) => {
                const on = enabled[a.id];
                return (
                  <li
                    key={a.id}
                    className={cn(
                      "grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-2 border-t border-line px-4 py-4 transition-colors hover:bg-[#fbfaf7] @min-[700px]:items-center @min-[700px]:gap-4 @min-[700px]:px-6",
                      GRID,
                    )}
                  >
                    <span className="col-span-2 @min-[700px]:col-span-1">
                      <LogoStack marks={a.marks} dim={!on} />
                    </span>
                    <div className="flex min-w-0 flex-col gap-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className={cn(T2, "font-semibold break-words", on ? "text-fg" : "text-muted")}>{a.title}</span>
                        {a.repo && <Chip mono>{a.repo}</Chip>}
                      </span>
                      <span className={cn(T3, "text-muted")}>{a.line}</span>
                    </div>
                    <span className={cn(T3, "col-span-2 flex min-w-0 items-center gap-2 text-fg-2 @min-[700px]:col-span-1")}>
                      <Dot tone={a.last.tone} />
                      <span className="min-w-0">
                        <span className="sr-only">Last run: </span>
                        {a.last.text}
                      </span>
                    </span>
                    <span className={cn(T3, "col-span-2 min-w-0 @min-[700px]:col-span-1", on ? "text-fg-2" : "text-muted")}>
                      <span className="@min-[700px]:sr-only">Next run: </span>
                      {on ? a.next : "Paused"}
                    </span>
                    <span className="col-start-2 row-start-2 flex items-center justify-end @min-[700px]:col-start-auto @min-[700px]:row-start-auto">
                      <Switch on={on} label={`${on ? "Pause" : "Resume"} ${a.title}`} onToggle={() => onToggle(a.id)} />
                    </span>
                  </li>
                );
              })}
              {shown.length === 0 && <li className={cn(T2, "border-t border-line px-6 py-8 text-muted")}>Nothing needs you right now.</li>}
            </ul>
          </div>

          <p className={cn(T3, "max-w-[72ch] text-muted")}>
            A run costs what the same request in chat would: 1 credit per 5 minutes of running time, and 1 credit for each app action that changes something.
            Reading and searching are free. An automation pauses on its own if you run out of credits. Results land in your{" "}
            <span className="font-medium text-accent-dark">Automations chat</span>.
          </p>
        </section>
      </div>
    </div>
  );
}
