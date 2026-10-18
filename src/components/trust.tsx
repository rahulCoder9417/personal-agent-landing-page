import { features, trust } from "@/lib/content";
import { Section } from "./section";

const TRUST_ICONS = [
  "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z", // shield
  "M6 11V8a6 6 0 0 1 12 0v3M5 11h14v10H5z", // lock
  "M5 12.5l4.5 4.5L19 7.5", // check
  "M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01", // list
  "M4 4l16 16M9.5 5.5A8 8 0 0 1 20 12a8 8 0 0 1-1.3 4.4M6.2 7.8A8 8 0 0 0 12 20a8 8 0 0 0 4.1-1.1", // no training
  "M5 7h14M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3", // trash
  "M4 7l8-4 8 4v10l-8 4-8-4zM4 7l8 4 8-4M12 11v10", // sandbox
  "M14 10a4 4 0 1 0-4 4l-6 6M7 17l2 2", // key
];

const FEATURE_ICONS = [
  "M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3zM5 11a7 7 0 0 0 14 0M12 18v3", // voice
  "M9 4a4 4 0 0 0-4 4v1a4 4 0 0 0 0 7 4 4 0 0 0 4 4h6a4 4 0 0 0 4-4 4 4 0 0 0 0-7V8a4 4 0 0 0-4-4z", // memory
  "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM16.5 13v7M13 16.5h7", // apps
  "M12 3l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-.5z", // models
  "M3 5h18v14H3zM3 9h18M8 13h5", // web app
  "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v10M9.5 9.5c0-1 1-1.5 2.5-1.5s2.5.7 2.5 1.8c0 2.2-5 1.4-5 3.9 0 1.1 1 1.8 2.5 1.8s2.5-.6 2.5-1.5", // credits
];

function Icon({ d }: { d: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

export function Trust() {
  return (
    <Section
      id="trust"
      eyebrow="Privacy and security"
      title="You're in the driver's seat."
      lede="An agent that acts for you has to earn trust. These promises are built into how Textcrew works."
      className="bg-surface-2/50"
    >
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {trust.map((t, i) => (
          <li key={t.title} className="rounded-2xl border border-line bg-surface p-5 shadow-soft">
            <span className="grid size-9 place-items-center rounded-xl bg-accent-soft text-accent">
              <Icon d={TRUST_ICONS[i % TRUST_ICONS.length]} />
            </span>
            <h3 className="mt-4 font-semibold tracking-[-0.01em]">{t.title}</h3>
            <p className="mt-1.5 text-[14px] leading-relaxed text-muted">{t.body}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function Features() {
  return (
    <Section
      id="features"
      eyebrow="Out of the box"
      title="Everything Tex does on day one."
      lede="What you get the moment you sign up."
    >
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <li key={f.title} className="flex gap-4 rounded-2xl border border-line bg-surface p-5 shadow-soft">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-line bg-surface-2 text-fg">
              <Icon d={FEATURE_ICONS[i % FEATURE_ICONS.length]} />
            </span>
            <div>
              <h3 className="font-semibold tracking-[-0.01em]">{f.title}</h3>
              <p className="mt-1.5 text-[14px] leading-relaxed text-muted">{f.body}</p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
