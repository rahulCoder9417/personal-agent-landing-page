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

// One per card in `features`, in the same order, no two alike.
const FEATURE_ICONS = [
  "M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3zM5 11a7 7 0 0 0 14 0M12 18v3", // voice notes and files: microphone
  "M6 3.5h11.5v17H6a1.5 1.5 0 0 1-1.5-1.5V5A1.5 1.5 0 0 1 6 3.5zM9 3.5v17M12 8h3M12 11.5h3", // shared memory: notebook
  "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM16.5 13v7M13 16.5h7", // apps and own tools: tiles and a plus
  "M12 3l9 4.5-9 4.5-9-4.5zM3 12l9 4.5 9-4.5M3 16.5l9 4.5 9-4.5", // three ways to run the AI: three layers
  "M4 4h6v5H4zM14 15h6v5h-6zM7 9v2.5a1 1 0 0 0 1 1h8a1 1 0 0 1 1 1V15", // automations on a canvas: two linked steps
  "M3 5h18v14H3zM3 9h18M6 7h.01M8.5 7h.01M7 13h6M7 16h10", // the web app: a browser window
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
              <Icon d={FEATURE_ICONS[i]} />
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
