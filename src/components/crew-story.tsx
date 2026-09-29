"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { AgentId } from "@/lib/content";
import { AgentFigure } from "./agent";
import { Agent3D } from "./agent-3d";

type Step = { who: AgentId; chip: string; title: string; line: string; ms: number };

const STEPS: Step[] = [
  { who: "tex", chip: "Gets the job", title: "Tex takes the job", line: "Reads your message and splits it into pieces for the crew.", ms: 4800 },
  { who: "scout", chip: "Research", title: "Scout opens its brain", line: "Searches the web and reads competitor pricing pages.", ms: 6000 },
  { who: "pitch", chip: "Leads", title: "Pitch works the computer", line: "Pulls 50 leads that fit your customer profile.", ms: 5600 },
  { who: "echo", chip: "Calls", title: "Echo gets on the phone", line: "Calls the warm leads and books demos.", ms: 6400 },
  { who: "byte", chip: "Code", title: "Byte opens a terminal", line: "Builds the pricing page and opens a pull request.", ms: 6800 },
  { who: "tex", chip: "Wrap-up", title: "Tex puts it together", line: "Sends you one summary, with anything that needs your OK.", ms: 5400 },
];

const TINT: Record<AgentId, string> = {
  tex: "#EEF1FF",
  scout: "#E4F4F2",
  byte: "#EFEAFF",
  patch: "#FDF3E1",
  echo: "#FCE8F0",
  pitch: "#E5F4EB",
  tock: "#FFEDE4",
};

const COLOR: Record<AgentId, string> = {
  tex: "#3355F5",
  scout: "#11A39B",
  byte: "#7B4DFF",
  patch: "#F5A623",
  echo: "#E93D82",
  pitch: "#22A45D",
  tock: "#FF6B2C",
};

// Counts up from 0 to `total`, one step every `every` ms, starting when the scene mounts.
function useTicker(total: number, every: number, delay = 0) {
  const reduce = useReducedMotion();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (reduce) {
      const id = window.setTimeout(() => setN(total), 0);
      return () => window.clearTimeout(id);
    }
    let timer: number | undefined;
    const start = window.setTimeout(() => {
      timer = window.setInterval(() => setN((v) => (v >= total ? v : v + 1)), every);
    }, delay);
    return () => {
      window.clearTimeout(start);
      window.clearInterval(timer);
    };
  }, [total, every, delay, reduce]);
  return n;
}

function Appear({ show, children, className = "" }: { show: boolean; children: ReactNode; className?: string }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className={className}>
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Tick({ color = "#22A45D" }: { color?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 16 16" className="size-4 shrink-0" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.5 8.5l3 3 6-7" />
    </svg>
  );
}

/* ---------- Scenes (the work panel on the right) ---------- */

function TexJob() {
  const n = useTicker(6, 520, 200);
  const jobs: { who: AgentId; task: string }[] = [
    { who: "scout", task: "Research competitor pricing" },
    { who: "pitch", task: "Find 50 leads that fit" },
    { who: "echo", task: "Call the warm ones" },
    { who: "byte", task: "Build the new pricing page" },
  ];
  return (
    <div className="flex h-full flex-col justify-center gap-3 p-6">
      <Appear show={n >= 1} className="ml-auto max-w-[88%] rounded-2xl rounded-br-md bg-fg px-4 py-2.5 text-[14px] leading-snug text-white">
        We launch the new pricing page Friday. Research competitors, get 50 leads, call the warm ones and build the page.
      </Appear>
      <Appear show={n >= 2} className="max-w-[80%] rounded-2xl rounded-bl-md border border-line bg-surface px-4 py-2.5 text-[14px]">
        On it. Splitting this across the crew:
      </Appear>
      <div className="flex flex-col gap-2">
        {jobs.map((j, i) => (
          <Appear key={j.who} show={n >= i + 3}>
            <div className="flex items-center gap-3 rounded-xl border border-line bg-surface px-3 py-2">
              <span className="grid size-7 place-items-center rounded-full" style={{ background: TINT[j.who] }}>
                <AgentFigure who={j.who} glyph size={22} />
              </span>
              <span className="text-[13.5px] font-semibold capitalize">{j.who}</span>
              <span className="text-[13.5px] text-muted">{j.task}</span>
              <svg aria-hidden viewBox="0 0 16 16" className="ml-auto size-3.5" fill="none" stroke={COLOR[j.who]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </div>
          </Appear>
        ))}
      </div>
    </div>
  );
}

function ScoutSearch() {
  const query = "competitor pricing pages, AI assistants";
  const typed = useTicker(query.length, 38, 250);
  const found = useTicker(4, 550, 1800);
  const results = [
    { site: "competitor-a.com/pricing", note: "3 plans · $20 to $99 a month" },
    { site: "competitor-b.com/pricing", note: "Usage-based · free tier" },
    { site: "competitor-c.io/plans", note: "Seats + credits · annual discount" },
    { site: "Reviews and forum threads", note: "What people say about price" },
  ];
  return (
    <div className="flex h-full flex-col gap-4 p-6">
      <div className="flex items-center gap-2.5 rounded-full border border-line bg-surface px-4 py-2.5 shadow-soft">
        <svg aria-hidden viewBox="0 0 16 16" className="size-4 text-muted" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="7" cy="7" r="4.5" />
          <path d="M10.5 10.5L14 14" />
        </svg>
        <span className="text-[14px]">
          {query.slice(0, typed)}
          {typed < query.length && <span className="brand-caret ml-px inline-block h-4 w-[2px] translate-y-0.5 bg-fg" />}
        </span>
      </div>
      <ul className="flex flex-col gap-2">
        {results.map((r, i) => (
          <Appear key={r.site} show={found > i}>
            <li className="flex items-center gap-3 rounded-xl border border-line bg-surface px-3.5 py-2.5">
              <span className="grid size-7 place-items-center rounded-lg bg-[#E4F4F2] font-mono text-[11px] font-bold text-[#0C7F79]">{i + 1}</span>
              <span className="min-w-0 flex-1 leading-tight">
                <span className="block truncate text-[13.5px] font-medium">{r.site}</span>
                <span className="block truncate text-[12px] text-muted">{r.note}</span>
              </span>
              <Tick color="#11A39B" />
            </li>
          </Appear>
        ))}
      </ul>
      <p className="mt-auto font-mono text-[11px] text-muted">Read {Math.min(found * 3, 12)} pages · writing the brief</p>
    </div>
  );
}

function PitchLeads() {
  const rows = useTicker(6, 480, 400);
  const count = useTicker(50, 60, 400);
  const leads = [
    ["Jordan Lee", "Acme Corp", "Head of Ops", 94],
    ["Sam Rivera", "Northwind", "Founder", 91],
    ["Priti Nair", "Brightlane", "COO", 88],
    ["Alex Chen", "Tidewater", "VP Sales", 86],
    ["Noor Haddad", "Fieldhouse", "Founder", 84],
    ["Chris Park", "Lumen Labs", "Ops Lead", 81],
  ] as const;
  return (
    <div className="flex h-full items-center justify-center p-6">
      {/* Laptop */}
      <div className="w-full max-w-md">
        <div className="rounded-t-2xl border-[6px] border-b-0 border-[#1d1c21] bg-[#1d1c21]">
          <div className="overflow-hidden rounded-t-lg bg-surface">
            <div className="flex items-center justify-between border-b border-line px-3 py-2">
              <span className="text-[12px] font-semibold">Leads</span>
              <span className="rounded-full bg-[#E5F4EB] px-2 py-0.5 font-mono text-[10px] text-[#178247]">{count} found</span>
            </div>
            <div className="min-h-[13.5rem] divide-y divide-line">
              {leads.map(([name, company, role, fit], i) => (
                <Appear key={name} show={rows > i}>
                  <div className="flex items-center gap-2 px-3 py-1.5 text-[11.5px]">
                    <span className="grid size-5 place-items-center rounded-full bg-surface-2 text-[9px] font-semibold">
                      {name.split(" ").map((p) => p[0]).join("")}
                    </span>
                    <span className="w-24 truncate font-medium">{name}</span>
                    <span className="flex-1 truncate text-muted">
                      {company} · {role}
                    </span>
                    <span className="rounded bg-[#E5F4EB] px-1.5 font-mono text-[10px] text-[#178247]">{fit}</span>
                  </div>
                </Appear>
              ))}
            </div>
          </div>
        </div>
        <div className="mx-auto h-3 w-[108%] -translate-x-[3.7%] rounded-b-xl bg-gradient-to-b from-[#d9d7d0] to-[#c3c0b8]" />
        <p className="mt-3 text-center font-mono text-[11px] text-muted">{count >= 50 ? "Added 50 leads to your CRM" : "Scanning company sites and profiles…"}</p>
      </div>
    </div>
  );
}

function EchoCall() {
  const secs = useTicker(40, 110, 900);
  const lines = useTicker(3, 1100, 900);
  const connected = secs > 0;
  const transcript = [
    { who: "Echo", text: "Hi Jordan, I'm calling about the new pricing you asked about last week." },
    { who: "Jordan", text: "Yes, perfect timing. Can we see a demo?" },
    { who: "Echo", text: "Of course. Thursday at 2pm works for the team?" },
  ];
  return (
    <div className="flex h-full items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-[28px] border border-line bg-surface p-5 shadow-soft">
        <div className="flex items-center gap-3">
          <span className="relative grid size-11 place-items-center rounded-full bg-[#FCE8F0] font-semibold text-[#C22866]">
            JL
            {!connected && <span aria-hidden className="absolute inset-0 animate-ping rounded-full bg-[#E93D82]/25" />}
          </span>
          <div className="leading-tight">
            <p className="text-[14px] font-semibold">Jordan Lee · Acme Corp</p>
            <p className="font-mono text-[11px] text-muted">
              {connected ? `Connected · 00:${String(secs).padStart(2, "0")}` : "Calling…"}
            </p>
          </div>
        </div>
        <div className="mt-4 flex h-8 items-center justify-center gap-[3px]">
          {Array.from({ length: 28 }).map((_, i) => (
            <motion.span
              key={i}
              className="w-[3px] rounded-full bg-[#E93D82]"
              animate={connected ? { height: [4, 6 + ((i * 7) % 22), 4] } : { height: 4 }}
              transition={{ duration: 0.6 + (i % 5) * 0.08, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </div>
        <div className="mt-4 flex min-h-[9.5rem] flex-col gap-2">
          {transcript.map((t, i) => (
            <Appear key={i} show={lines > i}>
              <p className={`w-fit max-w-[92%] rounded-2xl px-3 py-2 text-[12.5px] leading-snug ${t.who === "Echo" ? "bg-[#FCE8F0] text-fg" : "ml-auto bg-surface-2"}`}>
                <span className="font-semibold">{t.who}: </span>
                {t.text}
              </p>
            </Appear>
          ))}
        </div>
        <Appear show={lines >= 3}>
          <p className="mt-2 flex items-center justify-center gap-1.5 rounded-full bg-[#E7F6EC] py-1.5 text-[12.5px] font-medium text-[#14713D]">
            <Tick /> Demo booked · Thu 2:00 PM
          </p>
        </Appear>
      </div>
    </div>
  );
}

function ByteTerminal() {
  const script: { t: "cmd" | "out" | "code" | "ok"; s: string }[] = [
    { t: "cmd", s: "git checkout -b pricing-page" },
    { t: "out", s: "Switched to a new branch 'pricing-page'" },
    { t: "cmd", s: "code src/app/pricing/page.tsx" },
    { t: "code", s: "export default function Pricing() {" },
    { t: "code", s: '  return <Plans tiers={["Free", "Pro", "Max"]} />;' },
    { t: "code", s: "}" },
    { t: "cmd", s: "pnpm test" },
    { t: "ok", s: "✓ 24 tests passed" },
    { t: "cmd", s: 'gh pr create --title "New pricing page"' },
    { t: "ok", s: "✓ PR #128 opened · waiting for your review" },
  ];
  const shown = useTicker(script.length, 440, 300);
  return (
    <div className="flex h-full items-center justify-center p-6">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-[#16151A] shadow-window">
        <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-2.5">
          <span className="size-2.5 rounded-full bg-[#FF5F57]" />
          <span className="size-2.5 rounded-full bg-[#FEBC2E]" />
          <span className="size-2.5 rounded-full bg-[#28C840]" />
          <span className="ml-2 font-mono text-[11px] text-white/50">byte@textcrew: ~/site</span>
        </div>
        <div className="min-h-[16rem] px-4 py-3 font-mono text-[12px] leading-[1.7]">
          {script.slice(0, shown).map((l, i) => (
            <motion.p key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="whitespace-pre-wrap break-words">
              {l.t === "cmd" && (
                <>
                  <span className="text-[#9B82FF]">$ </span>
                  <span className="text-white">{l.s}</span>
                </>
              )}
              {l.t === "out" && <span className="text-white/55">{l.s}</span>}
              {l.t === "code" && <span className="text-[#8FD6FF]">{l.s}</span>}
              {l.t === "ok" && <span className="text-[#5BE38F]">{l.s}</span>}
            </motion.p>
          ))}
          {shown < script.length && <span className="brand-caret inline-block h-3.5 w-2 translate-y-0.5 bg-white/80" />}
        </div>
      </div>
    </div>
  );
}

function TexWrap() {
  const n = useTicker(5, 450, 200);
  const done: { who: AgentId; text: string }[] = [
    { who: "scout", text: "Compared 3 competitor pricing pages" },
    { who: "pitch", text: "Found 50 leads and added them to your CRM" },
    { who: "echo", text: "Called 6 warm leads, booked 2 demos" },
    { who: "byte", text: "Built the pricing page, PR #128 is ready" },
  ];
  return (
    <div className="flex h-full flex-col justify-center gap-3 p-6">
      <Appear show={n >= 1} className="rounded-2xl rounded-bl-md border border-line bg-surface p-4">
        <p className="text-[14px] font-semibold">All done. Here&apos;s what the crew did:</p>
        <ul className="mt-3 flex flex-col gap-2">
          {done.map((d, i) => (
            <Appear key={d.who} show={n >= i + 2}>
              <li className="flex items-center gap-2.5 text-[13.5px]">
                <span className="grid size-6 place-items-center rounded-full" style={{ background: TINT[d.who] }}>
                  <AgentFigure who={d.who} glyph size={18} />
                </span>
                <span className="flex-1">{d.text}</span>
                <Tick />
              </li>
            </Appear>
          ))}
        </ul>
      </Appear>
      <Appear show={n >= 5} className="flex items-center gap-2 self-start rounded-full bg-accent-soft px-3 py-1.5 text-[12.5px] font-medium text-accent">
        One thing needs your OK: merge PR #128
      </Appear>
    </div>
  );
}

const SCENES = [TexJob, ScoutSearch, PitchLeads, EchoCall, ByteTerminal, TexWrap];

/* ---------- Stage decorations (left side) ---------- */

function Brain() {
  const nodes: [number, number][] = [
    [34, 30], [52, 20], [70, 30], [86, 22], [40, 50], [60, 44], [80, 52], [50, 64], [72, 66],
  ];
  const edges: [number, number][] = [
    [0, 1], [1, 2], [2, 3], [0, 4], [4, 5], [5, 2], [5, 6], [6, 3], [4, 7], [7, 8], [8, 6], [5, 8],
  ];
  return (
    <motion.svg
      aria-hidden
      viewBox="0 0 120 90"
      className="absolute left-1/2 top-[4%] w-40 -translate-x-1/2"
      initial={{ opacity: 0, scale: 0.2, y: 60 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 160, damping: 14, delay: 0.2 }}
    >
      <path d="M58 12 C40 4 20 10 16 28 C4 34 6 56 18 62 C20 76 38 84 58 78 Z" fill="#CFF1EC" stroke="#0C7F79" strokeWidth="2.5" />
      <path d="M62 12 C80 4 100 10 104 28 C116 34 114 56 102 62 C100 76 82 84 62 78 Z" fill="#CFF1EC" stroke="#0C7F79" strokeWidth="2.5" />
      {edges.map(([a, b], i) => (
        <motion.line
          key={i}
          x1={nodes[a][0]}
          y1={nodes[a][1]}
          x2={nodes[b][0]}
          y2={nodes[b][1]}
          stroke="#11A39B"
          strokeWidth="1.5"
          initial={{ pathLength: 0, opacity: 0.2 }}
          animate={{ pathLength: 1, opacity: [0.3, 1, 0.3] }}
          transition={{ pathLength: { duration: 0.5, delay: 0.5 + i * 0.08 }, opacity: { duration: 1.4, repeat: Infinity, delay: i * 0.1 } }}
        />
      ))}
      {nodes.map(([x, y], i) => (
        <motion.circle
          key={i}
          cx={x}
          cy={y}
          r="3"
          fill="#11A39B"
          animate={{ scale: [1, 1.6, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.13 }}
        />
      ))}
    </motion.svg>
  );
}

function Ripples() {
  return (
    <div aria-hidden className="absolute left-1/2 top-[22%] -translate-x-1/2">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="absolute left-1/2 top-1/2 size-40 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#E93D82]"
          initial={{ scale: 0.4, opacity: 0.6 }}
          animate={{ scale: 1.6, opacity: 0 }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.65, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

function CodeGlyphs() {
  const glyphs = ["</>", "{ }", "$_", "=>"];
  return (
    <div aria-hidden className="absolute inset-0">
      {glyphs.map((g, i) => (
        <motion.span
          key={g}
          className="absolute font-mono text-[15px] font-bold text-[#7B4DFF]"
          style={{ left: `${18 + i * 20}%`, top: `${12 + (i % 2) * 14}%` }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: [0, 1, 0.6], y: [10, -6, 0] }}
          transition={{ duration: 1.6, delay: 0.2 + i * 0.25, repeat: Infinity, repeatType: "reverse" }}
        >
          {g}
        </motion.span>
      ))}
    </div>
  );
}

function StageDecor({ step }: { step: number }) {
  if (step === 1) return <Brain />;
  if (step === 3) return <Ripples />;
  if (step === 4) return <CodeGlyphs />;
  return null;
}

/* ---------- The story ---------- */

export function CrewStory() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-120px" });
  const reduce = useReducedMotion();
  const step = STEPS[index];
  const running = inView && !paused;
  const Scene = SCENES[index];

  useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % STEPS.length), step.ms);
    return () => window.clearTimeout(id);
  }, [running, index, step.ms]);

  return (
    <div ref={ref} className="overflow-hidden rounded-[28px] border border-line bg-surface shadow-window">
      {/* Steps */}
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <div className="flex flex-1 gap-1.5 overflow-x-auto [scrollbar-width:none]">
          {STEPS.map((s, i) => {
            const active = i === index;
            return (
              <button
                key={`${s.who}-${s.chip}`}
                type="button"
                onClick={() => setIndex(i)}
                aria-current={active}
                className={`relative flex shrink-0 cursor-pointer items-center gap-2 overflow-hidden rounded-full border py-1.5 pl-1.5 pr-3 text-[12.5px] transition-colors ${
                  active ? "border-fg/15 bg-surface-2 font-medium" : "border-transparent text-muted hover:text-fg"
                }`}
              >
                <span className="grid size-6 place-items-center rounded-full" style={{ background: TINT[s.who] }}>
                  <AgentFigure who={s.who} glyph size={19} />
                </span>
                <span className="capitalize">{s.who}</span>
                <span className="text-muted">· {s.chip}</span>
                {active && (
                  <motion.span
                    key={`bar-${index}-${running}`}
                    className="absolute bottom-0 left-0 h-[2px]"
                    style={{ background: COLOR[s.who] }}
                    initial={{ width: running ? "0%" : "100%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: running ? s.ms / 1000 : 0, ease: "linear" }}
                  />
                )}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? "Play the story" : "Pause the story"}
          className="grid size-8 shrink-0 cursor-pointer place-items-center rounded-full border border-line text-muted transition-colors hover:text-fg"
        >
          {paused ? (
            <svg aria-hidden viewBox="0 0 16 16" className="size-3.5" fill="currentColor">
              <path d="M5 3.5v9l7.5-4.5z" />
            </svg>
          ) : (
            <svg aria-hidden viewBox="0 0 16 16" className="size-3.5" fill="currentColor">
              <rect x="4" y="3.5" width="2.8" height="9" rx="1" />
              <rect x="9.2" y="3.5" width="2.8" height="9" rx="1" />
            </svg>
          )}
        </button>
      </div>

      <div className="grid md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        {/* Stage */}
        <div className="relative flex min-h-[22rem] flex-col items-center justify-end overflow-hidden transition-colors duration-500 md:min-h-[27rem]" style={{ background: TINT[step.who] }}>
          <div aria-hidden className="dot-grid absolute inset-0 opacity-60" />
          <AnimatePresence mode="wait">
            <motion.div
              key={`stage-${index}`}
              className="relative flex h-full w-full flex-col items-center justify-end"
              initial={reduce ? false : { opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.35 }}
            >
              <StageDecor step={index} />
              {index > 0 && index < 5 && (
                <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-surface/90 px-2.5 py-1 text-[11.5px] text-muted shadow-soft">
                  <AgentFigure who="tex" glyph size={16} />
                  Handed off by Tex
                </span>
              )}
              <div style={{ marginBottom: -44 }}>
                <Agent3D who={step.who} size={340} />
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="relative w-full border-t border-black/5 bg-surface/80 px-5 py-3 backdrop-blur">
            <p className="text-[15px] font-semibold">{step.title}</p>
            <p className="text-[13px] text-muted">{step.line}</p>
          </div>
        </div>

        {/* Work */}
        <div className="relative min-h-[24rem] border-t border-line bg-bg md:border-l md:border-t-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={`scene-${index}`}
              className="h-full"
              initial={reduce ? false : { opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.3 }}
            >
              <Scene />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
