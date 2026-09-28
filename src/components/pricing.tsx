import { creditNotes, plans, waitlistDeal } from "@/lib/content";
import { Section } from "./section";

export function Pricing() {
  return (
    <Section
      id="pricing"
      eyebrow="Pricing"
      title="Start free. Pay for what you use."
      lede="Every plan runs on credits, so you pay for the work Tex actually does. Launch prices, with the regular price struck out."
      className="bg-surface-2/50"
    >
      <div className="mb-6 flex flex-col items-center justify-between gap-4 rounded-2xl border border-accent/25 bg-accent-soft px-6 py-4 text-center sm:flex-row sm:text-left">
        <p className="flex items-center gap-3 text-[15px] font-medium text-fg">
          <span aria-hidden className="grid size-8 shrink-0 place-items-center rounded-full bg-accent font-mono text-[12px] font-bold text-white">
            %
          </span>
          {waitlistDeal}
        </p>
        <a href="#waitlist" className="inline-flex h-9 shrink-0 items-center rounded-full bg-accent px-4 text-sm font-medium text-white hover:opacity-90">
          Join the waitlist
        </a>
      </div>

      <div className="grid gap-4 lg:grid-cols-3 lg:gap-0 lg:divide-x lg:divide-line lg:rounded-3xl lg:border lg:border-line lg:bg-surface lg:shadow-soft">
        {plans.map((p) => (
          <article key={p.name} className="flex flex-col rounded-3xl border border-line bg-surface p-7 lg:rounded-none lg:border-0 lg:bg-transparent lg:p-9">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">{p.name}</h3>
              {p.featured && <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-medium text-accent">Recommended</span>}
            </div>
            <p className="mt-1 text-[15px] text-muted">{p.blurb}</p>
            <p className="mt-6 flex items-baseline gap-2">
              {p.was && (
                <s className="text-2xl font-semibold tracking-[-0.03em] text-muted/60 decoration-2" aria-label={`Regular price ${p.was}`}>
                  {p.was}
                </s>
              )}
              <span className="text-5xl font-bold tracking-[-0.05em]">{p.price}</span>
              <span className="text-muted">/ {p.cadence}</span>
            </p>
            <p className="mt-3 min-h-7">
              {p.waitlist && (
                <span className="inline-flex items-center rounded-full bg-accent-soft px-3 py-1 text-[13px] font-medium text-accent">
                  Waitlist: {p.waitlist} for your first month
                </span>
              )}
            </p>
            <a
              href="#waitlist"
              className={`mt-5 inline-flex h-11 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                p.featured ? "bg-fg text-white hover:bg-black" : "bg-surface-2 text-fg hover:bg-line"
              }`}
            >
              Join the beta
            </a>
            <ul className="mt-7 flex flex-col gap-3">
              {p.items.map((item) => (
                <li key={item} className="flex gap-2.5 text-[14px] leading-snug">
                  <svg aria-hidden viewBox="0 0 24 24" className="mt-0.5 size-4 shrink-0 text-accent" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <dl className="mt-6 grid gap-6 rounded-2xl border border-line bg-surface p-6 md:grid-cols-3">
        {creditNotes.map((n) => (
          <div key={n.label}>
            <dt className="text-[15px] font-semibold">{n.label}</dt>
            <dd className="mt-1 text-[14px] leading-relaxed text-muted">{n.body}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
