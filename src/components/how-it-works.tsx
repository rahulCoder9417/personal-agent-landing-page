import { steps } from "@/lib/content";
import { Section } from "./section";

export function HowItWorks() {
  return (
    <Section
      id="how"
      eyebrow="How it works"
      title="Set up once. Then just text."
      lede="A few minutes to set up. No new app to learn."
    >
      <ol className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line shadow-soft sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <li key={s.title} className="flex flex-col gap-3 bg-surface p-7">
            <span className="grid size-8 place-items-center rounded-full bg-accent-soft font-mono text-sm font-medium text-accent">
              {i + 1}
            </span>
            <h3 className="mt-2 text-lg font-semibold tracking-[-0.02em]">{s.title}</h3>
            <p className="text-[15px] leading-relaxed text-muted">{s.body}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
