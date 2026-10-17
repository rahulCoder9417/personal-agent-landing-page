"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useId, useRef, useState } from "react";
import { AgentFigure } from "./agent";
import { BrandIcon, type BrandName } from "./brand-icon";
import { Section } from "./section";
import { Switch } from "./ui-switch";

type KindId = "once" | "repeat" | "event";
type Trigger = { id: string; icon: BrandName; label: string; say: string; tex: string };
type Action = { id: string; icon: BrandName; label: string; say: string; tex: string };
type Saved = { id: string; icon: BrandName; title: string; when: string; on: boolean };

const KINDS: { id: KindId; label: string; hint: string; icon: string; triggers: Trigger[] }[] = [
  {
    id: "once",
    label: "Once",
    hint: "Reminders and one-off follow-ups",
    icon: "M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z",
    triggers: [
      { id: "fri", icon: "telegram", label: "Friday at 10:00", say: "On Friday at 10am", tex: "on Friday at 10am" },
      { id: "tom", icon: "telegram", label: "Tomorrow at 9:00", say: "Tomorrow at 9am", tex: "tomorrow at 9am" },
    ],
  },
  {
    id: "repeat",
    label: "On repeat",
    hint: "Daily and weekly routines, in your time zone",
    icon: "M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3M18 3v4h-4M6 21v-4h4",
    triggers: [
      { id: "mon", icon: "telegram", label: "Every Monday, 9:00", say: "Every Monday at 9am", tex: "every Monday at 9am" },
      { id: "wkd", icon: "gmail", label: "Weekdays, 8:00", say: "Every weekday at 8am", tex: "every weekday at 8am" },
    ],
  },
  {
    id: "event",
    label: "When something happens",
    hint: "Triggers from the apps you've connected",
    icon: "M13 3L5 13h6l-1 8 8-10h-6z",
    triggers: [
      { id: "boss", icon: "gmail", label: "New email from your boss", say: "When my boss emails", tex: "when your boss emails" },
      { id: "pr", icon: "github", label: "A pull request opens", say: "When a pull request opens on acme/web", tex: "when a pull request opens on acme/web" },
    ],
  },
];

const ACTIONS: Action[] = [
  { id: "summary", icon: "telegram", label: "Message me a summary", say: "message me a one-line summary on Telegram", tex: "I'll message you a one-line summary on Telegram" },
  { id: "week", icon: "gmail", label: "Summarise my unread email", say: "summarise my unread email", tex: "I'll summarise your unread email" },
  { id: "chase", icon: "gmail", label: "Draft a reply, ask first", say: "draft a reply and ask me before sending", tex: "I'll draft a reply and ask before sending" },
  { id: "review", icon: "github", label: "Review the pull request", say: "have Patch review it and send me the verdict", tex: "Patch will review it and send you the verdict" },
];

const PRO_LIMIT = 5;

function capitalise(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function Chip({ selected, icon, label, onClick }: { selected: boolean; icon: BrandName; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`flex w-full cursor-pointer items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-left text-[13.5px] transition-colors ${
        selected ? "border-fg bg-surface font-medium shadow-soft" : "border-line bg-surface/60 text-muted hover:border-fg/40 hover:text-fg"
      }`}
    >
      <BrandIcon name={icon} size={16} />
      <span className="flex-1">{label}</span>
      <span aria-hidden className={`grid size-4 place-items-center rounded-full border ${selected ? "border-fg bg-fg" : "border-line"}`}>
        {selected && <span className="size-1.5 rounded-full bg-white" />}
      </span>
    </button>
  );
}

export function Automations() {
  const uid = useId();
  const reduce = useReducedMotion();
  const [kind, setKind] = useState<KindId>("event");
  const [triggerId, setTriggerId] = useState("boss");
  const [actionId, setActionId] = useState("summary");
  const [saved, setSaved] = useState<Saved[]>([{ id: "seed-week", icon: "gmail", title: "Summarise my unread email", when: "Every Monday at 9am", on: true }]);
  const [confirmation, setConfirmation] = useState<{ key: number; text: string } | null>(null);
  const nextKey = useRef(0);

  const k = KINDS.find((x) => x.id === kind) ?? KINDS[0];
  const trigger = k.triggers.find((t) => t.id === triggerId) ?? k.triggers[0];
  const action = ACTIONS.find((a) => a.id === actionId) ?? ACTIONS[0];
  const sentence = `${trigger.say}, ${action.say}.`;
  const full = saved.length >= PRO_LIMIT;

  function pickKind(next: KindId) {
    setKind(next);
    setTriggerId((KINDS.find((x) => x.id === next) ?? KINDS[0]).triggers[0].id);
    setConfirmation(null);
  }

  function setUp() {
    const key = ++nextKey.current;
    if (full) {
      setConfirmation({ key, text: `That's ${PRO_LIMIT} of ${PRO_LIMIT} automations on Pro. Pause or remove one, or move to Max for 50.` });
      return;
    }
    setSaved((list) => [...list, { id: `${trigger.id}-${action.id}-${key}`, icon: action.icon, title: action.label, when: capitalise(trigger.tex), on: true }]);
    setConfirmation({ key, text: `Done. ${capitalise(trigger.tex)}, ${action.tex}. It's saved under Automations.` });
  }

  return (
    <Section
      id="automations"
      eyebrow="Automations"
      title="Tired of asking? Automate it."
      lede="Tell Tex what should happen and when, or build it on a canvas in the web app. It runs on time in your time zone and reports back in chat. Try the idea here."
    >
      <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-line bg-surface shadow-window">
        {/* Kind */}
        <div role="tablist" aria-label="Kind of automation" className="grid gap-px border-b border-line bg-line sm:grid-cols-3">
          {KINDS.map((x) => {
            const active = x.id === kind;
            return (
              <button
                key={x.id}
                type="button"
                role="tab"
                aria-selected={active}
                id={`${uid}-${x.id}`}
                onClick={() => pickKind(x.id)}
                className={`flex cursor-pointer items-start gap-3 px-5 py-4 text-left transition-colors ${active ? "bg-surface" : "bg-surface-2/60 hover:bg-surface"}`}
              >
                <span className={`mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg ${active ? "bg-accent text-white" : "bg-surface text-muted"}`}>
                  <svg aria-hidden viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
                    <path d={x.icon} />
                  </svg>
                </span>
                <span>
                  <span className={`block text-[14px] font-semibold ${active ? "" : "text-muted"}`}>{x.label}</span>
                  <span className="block text-[12.5px] text-muted">{x.hint}</span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Builder */}
        <div role="tabpanel" aria-labelledby={`${uid}-${kind}`} className="grid gap-5 p-6 sm:p-7 md:grid-cols-[1fr_auto_1fr] md:items-start">
          <fieldset>
            <legend className="font-mono text-[10px] tracking-[0.08em] text-muted">WHEN THIS HAPPENS</legend>
            <div className="mt-2.5 flex flex-col gap-2">
              {k.triggers.map((t) => (
                <Chip key={t.id} selected={t.id === trigger.id} icon={t.icon} label={t.label} onClick={() => { setTriggerId(t.id); setConfirmation(null); }} />
              ))}
            </div>
          </fieldset>
          <span aria-hidden className="mx-auto grid size-10 place-items-center rounded-xl bg-fg text-white md:mt-9">
            <svg viewBox="0 0 24 24" className="size-4 rotate-90 md:rotate-0" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
          <fieldset>
            <legend className="font-mono text-[10px] tracking-[0.08em] text-muted">TEX DOES THIS</legend>
            <div className="mt-2.5 flex flex-col gap-2">
              {ACTIONS.map((a) => (
                <Chip key={a.id} selected={a.id === action.id} icon={a.icon} label={a.label} onClick={() => { setActionId(a.id); setConfirmation(null); }} />
              ))}
            </div>
          </fieldset>
        </div>

        {/* What you'd text, and Tex's answer */}
        <div className="border-t border-line bg-surface-2/50 px-6 py-6 sm:px-7">
          <p className="font-mono text-[10px] tracking-[0.08em] text-muted">WHAT YOU&apos;D TEXT</p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <AnimatePresence mode="wait">
              <motion.p
                key={sentence}
                initial={reduce ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="w-fit max-w-full rounded-2xl rounded-br-md bg-accent px-4 py-2.5 text-[14.5px] leading-snug text-white"
              >
                {sentence}
              </motion.p>
            </AnimatePresence>
            <button
              type="button"
              onClick={setUp}
              className="inline-flex h-10 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full bg-fg px-5 text-sm font-medium text-white transition-colors hover:bg-black"
            >
              Send to Tex
              <svg aria-hidden viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </button>
          </div>
          <div aria-live="polite" className="min-h-0">
            <AnimatePresence>
              {confirmation && (
                <motion.div
                  key={confirmation.key}
                  initial={reduce ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-3 flex max-w-xl items-start gap-2.5"
                >
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-accent-soft">
                    <AgentFigure who="tex" glyph size={22} label="Tex" />
                  </span>
                  <p className="rounded-2xl rounded-bl-md border border-line bg-surface px-4 py-2.5 text-[14px] leading-snug">{confirmation.text}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Saved automations */}
        <div className="border-t border-line px-6 py-5 sm:px-7">
          <div className="flex items-center justify-between">
            <p className="text-[14px] font-semibold">Your automations</p>
            <p className="font-mono text-[11px] text-muted">
              {saved.length} of {PRO_LIMIT} on Pro
            </p>
          </div>
          <ul className="mt-3 flex flex-col gap-2">
            <AnimatePresence initial={false}>
              {saved.map((a) => (
                <motion.li
                  key={a.id}
                  layout={!reduce}
                  initial={reduce ? false : { opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-center gap-3 rounded-xl border border-line px-4 py-2.5">
                    <BrandIcon name={a.icon} size={16} />
                    <div className="min-w-0 flex-1 leading-tight">
                      <p className={`truncate text-[13.5px] font-medium ${a.on ? "" : "text-muted"}`}>{a.title}</p>
                      <p className="truncate font-mono text-[11px] text-muted">{a.on ? a.when : `${a.when} · paused`}</p>
                    </div>
                    <Switch on={a.on} label={`${a.on ? "Pause" : "Resume"} ${a.title}`} onToggle={() => setSaved((l) => l.map((x) => (x.id === a.id ? { ...x, on: !x.on } : x)))} />
                    <button
                      type="button"
                      aria-label={`Remove ${a.title}`}
                      onClick={() => setSaved((l) => l.filter((x) => x.id !== a.id))}
                      className="grid size-7 cursor-pointer place-items-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-fg"
                    >
                      <svg aria-hidden viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                        <path d="M4 4l8 8M12 4l-8 8" />
                      </svg>
                    </button>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-4xl">
        <p className="text-center text-[15px] font-semibold tracking-[-0.01em]">In the web app, every automation has the same shape</p>
        <ol className="mt-4 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4">
          {[
            { n: "1", t: "What starts it", d: "A time, a repeat, or something happening in a connected app." },
            { n: "2", t: "Read (optional)", d: "Tex reads from an app, like your inbox or a pull request." },
            { n: "3", t: "Tex and the crew", d: "Tex does the thinking, with Byte, Patch or Scout when they fit." },
            { n: "4", t: "Write or send (optional)", d: "The result goes to an app or your chat. Risky steps ask first." },
          ].map((x) => (
            <li key={x.n} className="bg-surface p-4">
              <p className="font-mono text-[10px] tracking-[0.08em] text-accent">STEP {x.n}</p>
              <p className="mt-1.5 text-[14px] font-semibold">{x.t}</p>
              <p className="mt-1 text-[13px] leading-relaxed text-muted">{x.d}</p>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-center text-[14px] leading-relaxed text-muted">
          Up to 6 steps each. Start from a ready-made template, including pull-request review for a GitHub repo, test a run before you switch it on, and approve questions an automation asks right on Telegram.
        </p>
      </div>

      <p className="mt-6 text-center text-[14px] text-muted">
        Free: 1 automation · Pro: 5 · Max: 50. They pause on their own if you run out of credits.
      </p>
    </Section>
  );
}
