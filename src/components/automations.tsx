import { automations } from "@/lib/content";
import { BrandIcon } from "./brand-icon";
import { Section } from "./section";

const KIND_ICONS = [
  "M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z", // once: clock
  "M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3M18 3v4h-4M6 21v-4h4", // repeat
  "M13 3L5 13h6l-1 8 8-10h-6z", // trigger: bolt
];

export function Automations() {
  return (
    <Section
      id="automations"
      eyebrow="Automations"
      title="Tired of asking? Automate it."
      lede="Tell Tex what should happen and when. It runs on time in your time zone and reports back in chat."
    >
      <div className="mx-auto max-w-4xl">
        <ul className="grid gap-3 sm:grid-cols-3">
          {automations.map((a, i) => (
            <li key={a.kind} className="rounded-2xl border border-line bg-surface p-4 shadow-soft">
              <svg aria-hidden viewBox="0 0 24 24" className="size-5 text-muted" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                <path d={KIND_ICONS[i]} />
              </svg>
              <p className="mt-3 font-semibold">{a.kind}</p>
              <p className="mt-1 text-[14px] text-muted">{a.detail}</p>
            </li>
          ))}
        </ul>

        <figure aria-label="Example automation: when your boss emails, Tex messages you on Telegram" className="mt-4 rounded-3xl border border-line bg-surface p-5 shadow-window sm:p-6">
          <div className="grid items-center gap-3 md:grid-cols-[1fr_auto_1fr]">
            <div>
              <p className="font-mono text-[10px] tracking-[0.08em] text-muted">WHEN THIS HAPPENS</p>
              <div className="mt-2 flex items-center gap-3 rounded-xl border border-line px-4 py-3">
                <BrandIcon name="gmail" size={20} />
                <div className="leading-tight">
                  <p className="text-[14px] font-medium">New email from your boss</p>
                  <p className="font-mono text-[11px] text-muted">Gmail</p>
                </div>
              </div>
            </div>
            <span aria-hidden className="mx-auto grid size-10 place-items-center rounded-xl bg-fg text-white md:mt-6">
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
            <div>
              <p className="font-mono text-[10px] tracking-[0.08em] text-muted">TEX DOES THIS</p>
              <div className="mt-2 flex items-center gap-3 rounded-xl border border-line px-4 py-3">
                <BrandIcon name="telegram" size={20} />
                <div className="leading-tight">
                  <p className="text-[14px] font-medium">Message me a one-line summary</p>
                  <p className="font-mono text-[11px] text-muted">Telegram</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-5 flex flex-col gap-3 border-t border-line pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="w-fit rounded-2xl rounded-br-md bg-fg px-3.5 py-2 text-[14px] text-white">Tell me when my boss emails.</p>
            <p className="font-mono text-[12px] text-muted">That one message sets it up.</p>
          </div>
        </figure>

        <p className="mt-6 text-center text-[14px] text-muted">
          Free: 3 automations · Pro: 20 · Max: 50. They pause on their own if you run out of credits.
        </p>
      </div>
    </Section>
  );
}
