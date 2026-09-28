import { AgentFigure } from "./agent";
import { BetaBadge } from "./hero";
import { Container } from "./section";
import { WaitlistForm } from "./waitlist-form";

export function FinalCta() {
  return (
    <section id="waitlist" aria-labelledby="waitlist-title" className="pb-24 pt-40 sm:pb-32">
      <Container>
        <div className="relative mx-auto max-w-4xl">
          <div aria-hidden className="absolute inset-x-0 -top-[118px] flex items-end justify-center gap-2">
            <AgentFigure who="tock" size={96} />
            <AgentFigure who="scout" size={108} />
            <AgentFigure who="tex" size={150} />
            <AgentFigure who="echo" size={108} />
            <AgentFigure who="patch" size={96} />
          </div>
          <div className="relative flex flex-col items-center rounded-[28px] border border-line bg-surface px-6 py-14 text-center shadow-window sm:px-12">
            <BetaBadge />
            <h2 id="waitlist-title" className="mt-6 text-[clamp(2.2rem,5vw,3.5rem)] font-bold leading-[1.02] tracking-[-0.045em]">
              Get your crew early.
            </h2>
            <p className="mt-4 max-w-lg text-lg leading-relaxed text-muted">
              We&apos;re letting beta testers in small batches before launch. Leave your email and we&apos;ll send your
              invite as soon as there&apos;s room.
            </p>
            <WaitlistForm showChannels className="mt-8" />
          </div>
        </div>
      </Container>
    </section>
  );
}
