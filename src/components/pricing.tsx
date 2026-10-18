import Link from "next/link";
import { creditNotes, paymentNote, plans, waitlistDeal } from "@/lib/content";
import { site } from "@/lib/site";
import { Reveal } from "./reveal";
import { Container, Eyebrow } from "./section";

// The body of the /pricing page: its header, the deal for people who joined the waitlist, the three plans and how credits work.
export function Pricing() {
  return (
    <section id="plans" aria-labelledby="pricing-title" className="relative overflow-hidden pb-20 pt-16 sm:pb-28 sm:pt-24">
      <div aria-hidden className="dot-grid pointer-events-none absolute inset-x-0 top-0 h-[480px]" />
      <Container className="relative">
        <header className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <Eyebrow>Pricing</Eyebrow>
          <h1 id="pricing-title" className="mt-6 text-[clamp(2.4rem,5.6vw,4rem)] font-bold leading-[1.02] tracking-[-0.045em]">
            Start free. Pay for what you use.
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted sm:text-xl">
            Everyone starts on Free with 100 credits, good for 14 days. Pro and Max add credits every month, all apps and more automations.
            Every plan runs on credits, so you pay for the work Tex actually does. Bring your own Claude plan or API key and you don&apos;t pay for the AI twice: credits cover the agent&apos;s time, not the AI.
          </p>
          <p className="mt-3 text-[15px] text-muted">Pro and Max are at launch prices for now.</p>
        </header>

        <div className="mb-6 mt-12 flex items-center justify-center gap-3 rounded-2xl border border-accent/25 bg-accent-soft px-6 py-4 text-left sm:mt-14">
          <span aria-hidden className="grid size-8 shrink-0 place-items-center rounded-full bg-accent font-mono text-[12px] font-bold text-white">
            %
          </span>
          <p className="text-[15px] font-medium text-fg">{waitlistDeal}</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3 lg:gap-0 lg:divide-x lg:divide-line lg:rounded-3xl lg:border lg:border-line lg:bg-surface lg:shadow-soft">
          {plans.map((p) => (
            <article key={p.name} className="flex flex-col rounded-3xl border border-line bg-surface p-7 lg:rounded-none lg:border-0 lg:bg-transparent lg:p-9">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">{p.name}</h2>
                {p.featured && <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-medium text-accent">Recommended</span>}
              </div>
              <p className="mt-1 text-[15px] text-muted">{p.blurb}</p>
              <p className="mt-6 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                {p.regular && (
                  <s aria-label={`Regular price ${p.regular}`} className="text-2xl font-normal text-muted decoration-1">
                    {p.regular}
                  </s>
                )}
                <span className="text-5xl font-bold tracking-[-0.05em]">{p.price}</span>
                <span className="text-muted">/ {p.cadence}</span>
              </p>
              {/* The regular price is crossed out above; the tag says it has never been charged. */}
              <p className="mt-2 min-h-6">
                {p.regular && <span className="inline-flex rounded-full bg-surface-2 px-2.5 py-0.5 text-[12px] font-medium text-muted">Launch price</span>}
              </p>
              <p className="mt-3 min-h-7">
                {p.waitlist && (
                  <span className="inline-flex items-center rounded-full bg-accent-soft px-3 py-1 text-[13px] font-medium text-accent">
                    Joined the waitlist? {p.waitlist} for your first month
                  </span>
                )}
              </p>
              <a
                href={site.signUpUrl}
                className={`mt-5 inline-flex h-11 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                  p.featured ? "bg-fg text-white hover:bg-black" : "bg-surface-2 text-fg hover:bg-line"
                }`}
              >
                {p.name === "Free" ? "Get started free" : "Get started"}
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

        <section aria-labelledby="credits-title" className="mt-6 rounded-2xl border border-line bg-surface p-6">
          <h2 id="credits-title" className="text-lg font-semibold tracking-[-0.01em]">
            How credits work
          </h2>
          <dl className="mt-5 grid gap-6 md:grid-cols-3">
            {creditNotes.map((n) => (
              <div key={n.label}>
                <dt className="text-[15px] font-semibold">{n.label}</dt>
                <dd className="mt-1 text-[14px] leading-relaxed text-muted">{n.body}</dd>
              </div>
            ))}
          </dl>
        </section>

        <p className="mt-6 text-center text-[14px] leading-relaxed text-muted">
          {paymentNote} You can ask for a refund within 14 days of a payment: see the{" "}
          <Link href="/terms#refunds" className="font-medium text-accent hover:underline">
            Terms
          </Link>
          . Questions about a payment:{" "}
          <a href={`mailto:${site.contactEmail}`} className="font-medium text-accent hover:underline">
            {site.contactEmail}
          </a>
          .
        </p>
      </Container>
    </section>
  );
}

// The short pricing block on the home page; the full plans live on /pricing.
export function PricingTeaser() {
  return (
    <section id="pricing" aria-labelledby="pricing-title" className="bg-surface-2/50 py-20 sm:py-24">
      <Container>
        <Reveal className="mx-auto flex max-w-4xl flex-col items-center gap-8 rounded-3xl border border-line bg-surface px-6 py-9 text-center shadow-soft sm:px-10 md:flex-row md:justify-between md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <Eyebrow>Pricing</Eyebrow>
            <h2 id="pricing-title" className="mt-5 text-[clamp(1.75rem,3.2vw,2.5rem)] font-bold leading-[1.05] tracking-[-0.04em]">
              Start free. Pay for what you use.
            </h2>
            <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-muted">
              Every plan runs on credits, so you pay for the work Tex actually does. Bring your own Claude plan or API key and you don&apos;t pay for the AI twice: credits cover the agent&apos;s time, not the AI.
            </p>
            <ul className="mt-5 flex flex-wrap justify-center gap-2 md:justify-start">
              {plans.map((p) => (
                <li key={p.name} className="inline-flex items-baseline gap-1.5 rounded-full border border-line bg-surface-2 px-3 py-1 text-[13px]">
                  <span className="font-medium">{p.name}</span>
                  {p.regular && (
                    <s aria-label={`Regular price ${p.regular}`} className="text-muted decoration-1">
                      {p.regular}
                    </s>
                  )}
                  <span className="font-semibold">{p.price}</span>
                  <span className="text-muted">{p.cadence === "per month" ? "/ month" : p.cadence}</span>
                  {p.regular && <span className="text-[11.5px] text-muted">Launch price</span>}
                </li>
              ))}
            </ul>
          </div>
          <Link
            href="/pricing"
            className="group inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-fg px-6 text-sm font-medium text-white transition-colors hover:bg-black"
          >
            See pricing
            <svg aria-hidden viewBox="0 0 16 16" className="size-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}
