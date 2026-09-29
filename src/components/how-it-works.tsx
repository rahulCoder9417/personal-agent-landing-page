"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { steps } from "@/lib/content";
import { AgentFigure } from "./agent";
import { BrandIcon, type BrandName } from "./brand-icon";
import { Section } from "./section";

const CHANNELS: { id: BrandName; label: string; y: number }[] = [
  { id: "whatsapp", label: "WhatsApp", y: 20 },
  { id: "telegram", label: "Telegram", y: 40 },
  { id: "imessage", label: "iMessage", y: 60 },
  { id: "web", label: "Web app", y: 80 },
];

const STORIES: { channel: BrandName; ask: string; app: BrandName; label: string; title: string; meta: string }[] = [
  { channel: "whatsapp", ask: "Turn this voice note into notes", app: "notion", label: "NOTION", title: "New note created", meta: "Pricing ideas · 6 key points" },
  { channel: "telegram", ask: "Move my 3pm to tomorrow", app: "calendar", label: "GOOGLE CALENDAR", title: "Meeting moved", meta: "Roadmap sync · tomorrow, 3:00 PM" },
  { channel: "imessage", ask: "Reply to the Acme thread", app: "gmail", label: "GMAIL", title: "Reply sent after your OK", meta: "Acme · Re: pricing" },
  { channel: "web", ask: "Post today's update", app: "slack", label: "SLACK", title: "Update posted", meta: "#team · 1 credit" },
  { channel: "whatsapp", ask: "Remind me Friday to chase the invoice", app: "calendar", label: "REMINDER", title: "Reminder set", meta: "Friday 10:00 · in this chat" },
];

const STORY_MS = 3800;
// Diagram coordinates live in a 1000 x 380 box; HTML pieces are placed with the same percentages.
const W = 1000;
const H = 380;
const HUB = { x: 470, y: 190 };

function channelPath(yPct: number) {
  const y = (yPct / 100) * H;
  return `M 112 ${y} C 270 ${y}, 300 ${HUB.y}, ${HUB.x - 52} ${HUB.y}`;
}

function OutputCard({ story }: { story: (typeof STORIES)[number] }) {
  return (
    <div className="rounded-2xl border border-[#CFEBD9] bg-surface p-4 shadow-soft">
      <div className="flex items-start gap-3">
        <BrandIcon name={story.app} tile size={17} />
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.08em] text-muted">
            {story.label}
            <svg aria-hidden viewBox="0 0 16 16" className="size-3.5" fill="#22A45D">
              <circle cx="8" cy="8" r="8" />
              <path d="M4.5 8.3l2.3 2.3 4.7-4.9" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </p>
          <p className="mt-0.5 font-semibold">{story.title}</p>
          <p className="text-[13px] text-muted">{story.meta}</p>
        </div>
      </div>
    </div>
  );
}

export function HowItWorks() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-80px" });
  const reduce = useReducedMotion();
  const story = STORIES[index];
  const running = inView && !paused;

  useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % STORIES.length), STORY_MS);
    return () => window.clearTimeout(id);
  }, [running, index]);

  const activeChannel = CHANNELS.find((c) => c.id === story.channel) ?? CHANNELS[0];

  return (
    <Section
      id="how"
      eyebrow="How it works"
      title="One message in. Finished work out."
      lede="Text Tex from the chat app you already use. It works across your apps and reports back in the same chat."
    >
      <div ref={ref} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        {/* Desktop diagram */}
        <div className="relative mx-auto hidden aspect-[1000/380] max-w-5xl md:block">
          <svg aria-hidden viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
            {CHANNELS.map((c) => (
              <path key={c.id} d={channelPath(c.y)} fill="none" stroke="var(--line)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
            ))}
            <path d={`M ${HUB.x + 52} ${HUB.y} L 630 ${HUB.y}`} fill="none" stroke="var(--line)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
            <motion.path
              key={`in-${index}`}
              d={channelPath(activeChannel.y)}
              fill="none"
              stroke="var(--accent)"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: reduce ? 1 : 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
            <motion.path
              key={`out-${index}`}
              d={`M ${HUB.x + 52} ${HUB.y} L 630 ${HUB.y}`}
              fill="none"
              stroke="var(--accent)"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: reduce ? 1 : 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: reduce ? 0 : 0.9, ease: "easeOut" }}
            />
          </svg>

          {CHANNELS.map((c) => {
            const active = c.id === story.channel;
            return (
              <div key={c.id} className="absolute -translate-y-1/2" style={{ left: "5.6%", top: `${c.y}%` }}>
                <div className="relative">
                  {active && !reduce && <span aria-hidden className="absolute -inset-2.5 animate-ping rounded-[30%] bg-accent/10" />}
                  <div className={`relative transition-transform duration-300 ${active ? "scale-110" : "opacity-80"}`}>
                    <BrandIcon name={c.id} tile size={19} className={active ? "ring-2 ring-accent/30" : ""} />
                  </div>
                </div>
              </div>
            );
          })}

          {/* The message that came in on the active channel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`ask-${index}`}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute -translate-y-[120%] whitespace-nowrap rounded-xl rounded-bl-sm bg-fg px-3 py-1.5 text-[12.5px] text-white shadow-soft"
              style={{ left: "10.5%", top: `${activeChannel.y}%` }}
            >
              {story.ask}
            </motion.div>
          </AnimatePresence>

          {/* Hub */}
          <div className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center" style={{ left: `${(HUB.x / W) * 100}%`, top: "50%" }}>
            <div className="relative grid size-[88px] place-items-center rounded-[26px] border border-line bg-surface shadow-window">
              {!reduce && (
                <motion.span
                  key={`pulse-${index}`}
                  aria-hidden
                  className="absolute inset-0 rounded-[26px] border-2 border-accent"
                  initial={{ opacity: 0.6, scale: 1 }}
                  animate={{ opacity: 0, scale: 1.35 }}
                  transition={{ duration: 0.9, delay: 0.75 }}
                />
              )}
              <AgentFigure who="tex" glyph size={60} label="Tex" />
            </div>
            <p className="mt-3 font-mono text-[11px] tracking-[0.08em] text-muted">TEX + YOUR CREW</p>
          </div>

          {/* Result */}
          <div className="absolute w-[33%] -translate-y-1/2" style={{ left: "63.5%", top: "50%" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={`out-${index}`}
                initial={{ opacity: 0, x: -10, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.35, delay: reduce ? 0 : 1.1 }}
              >
                <OutputCard story={story} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile: the same story, stacked */}
        <div className="mx-auto flex max-w-sm flex-col items-center gap-3 md:hidden">
          <div className="flex items-center gap-2 rounded-xl bg-fg px-3 py-2 text-[13px] text-white">
            <BrandIcon name={story.channel} size={16} />
            {story.ask}
          </div>
          <span aria-hidden className="h-6 w-px bg-accent" />
          <div className="grid size-16 place-items-center rounded-2xl border border-line bg-surface shadow-soft">
            <AgentFigure who="tex" glyph size={44} label="Tex" />
          </div>
          <span aria-hidden className="h-6 w-px bg-accent" />
          <div className="w-full">
            <OutputCard story={story} />
          </div>
        </div>

        {/* Story progress */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <span className="font-mono text-[11px] tracking-[0.08em] text-muted">
            STORY {index + 1} OF {STORIES.length}
          </span>
          <div className="flex gap-1.5">
            {STORIES.map((s, i) => (
              <button
                key={s.title}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show story ${i + 1}: ${s.title}`}
                aria-current={i === index}
                className="relative h-1.5 w-7 cursor-pointer overflow-hidden rounded-full bg-line"
              >
                {i < index && <span className="absolute inset-0 bg-accent/60" />}
                {i === index && (
                  <motion.span
                    key={`bar-${index}-${running}`}
                    className="absolute inset-y-0 left-0 bg-accent"
                    initial={{ width: running ? "0%" : "100%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: running ? STORY_MS / 1000 : 0, ease: "linear" }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Setup, in four steps */}
      <ol className="mx-auto mt-16 grid max-w-5xl gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
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
