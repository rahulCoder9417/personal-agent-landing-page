"use client";

// The Activity screen as the web app draws it (user-frontend-web src/app/(app)/activity/ and
// src/components/activity/activity-row.tsx): filter pills, then one line per action under its day:
// when, who (a face or your initials), what, and what it cost.

import { useState } from "react";
import { AgentFigure } from "../agent";
import type { Entry } from "./data";
import { AutomationsIcon, cn, FilterPills, PageHeader } from "./ui";

type Filter = "all" | "tex" | "crew" | "you" | "memory" | "automations" | "approvals";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "tex", label: "Tex" },
  { value: "crew", label: "Crew" },
  { value: "you", label: "You" },
  { value: "memory", label: "Memory" },
  { value: "automations", label: "Automations" },
  { value: "approvals", label: "Approvals" },
];

const CREW_TINT: Record<string, string> = { byte: "#F1ECFF", patch: "#FEF4E3", scout: "#E6F5F4" };

function ActorMark({ actor }: { actor: Entry["actor"] }) {
  const base = "grid size-[30px] shrink-0 place-items-center rounded-full";
  if (actor === "byte" || actor === "patch" || actor === "scout")
    return (
      <span className={base} style={{ background: CREW_TINT[actor] }}>
        <AgentFigure who={actor} mood="ready" glyph size={22} label="" />
      </span>
    );
  if (actor === "agent" || actor === "tex")
    return (
      <span className={cn(base, "bg-accent-soft")}>
        <AgentFigure who="tex" mood="ready" glyph size={22} label="" />
      </span>
    );
  if (actor === "user")
    return (
      <span aria-hidden className={cn(base, "bg-fg text-[12px] font-semibold text-white")}>
        AM
      </span>
    );
  return (
    <span aria-hidden className={cn(base, "bg-surface-2 text-nav")}>
      <AutomationsIcon size={15} />
    </span>
  );
}

const credits = (n: number) => `${n.toLocaleString("en-US")} ${n === 1 ? "credit" : "credits"}`;

export function ActivityScreen({ entries }: { entries: Entry[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  // Approvals asked for and answered count as Approvals; you answering one counts as You too.
  const shown = entries.filter((e) => filter === "all" || e.filter === filter || (filter === "you" && e.actor === "user"));
  const today = entries.reduce((sum, e) => sum + e.credits, 0);

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
      <PageHeader title="Activity">
        <p className="truncate text-[13px] text-muted">Everything Tex did, when, and what it cost.</p>
      </PageHeader>
      <div className="scroll-pane min-h-0 flex-1 overflow-y-auto">
        <div className="flex flex-col gap-4 px-4 pt-2 pb-10 @min-[600px]:px-8">
          <div className="flex min-h-[30px] flex-wrap items-center gap-4">
            <FilterPills label="Filter activity" options={FILTERS} value={filter} onChange={setFilter} />
            <span className="ml-auto text-[12px] text-muted">
              {shown.length} {shown.length === 1 ? "entry" : "entries"} · {credits(today)} used today
            </span>
          </div>
          {shown.length === 0 ? (
            <div className="rounded-xl border border-line bg-surface px-5 py-7 text-muted">Nothing matches this filter in what’s loaded so far.</div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-line bg-surface">
              <h3 className="bg-chrome px-5 py-[9px] text-[11.5px] font-medium text-muted">Today</h3>
              <ul>
                {shown.map((e) => (
                  <li key={e.id} className="flex min-h-[54px] items-center gap-4 border-t border-line px-5 py-2 @max-[520px]:gap-2.5 @max-[520px]:px-3.5">
                    <span className="w-[64px] shrink-0 text-[12px] text-muted @max-[520px]:w-[54px]">{e.time}</span>
                    <ActorMark actor={e.actor} />
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate font-medium @max-[520px]:line-clamp-2 @max-[520px]:whitespace-normal">{e.summary}</span>
                      <span className="truncate text-[12px] text-muted">
                        {e.who} · {e.label}
                      </span>
                    </div>
                    <span className={cn("w-[72px] shrink-0 text-right text-[12px] @max-[520px]:w-auto @max-[520px]:min-w-4", e.credits > 0 ? "text-fg" : "text-muted")}>
                      {e.credits > 0 ? credits(e.credits) : "—"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <p className="text-center text-[12px] text-muted">newest first · kept until you delete your account</p>
        </div>
      </div>
    </div>
  );
}
