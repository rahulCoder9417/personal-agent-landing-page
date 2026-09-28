import { BrandIcon, type BrandName } from "./brand-icon";
import { FaceStack } from "./face-stack";
import { ProductShowcase } from "./product-showcase";
import { Container } from "./section";
import { WaitlistForm } from "./waitlist-form";

export function BetaBadge() {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-[13px] font-medium text-muted shadow-soft">
      <span className="relative flex size-2">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-50 motion-reduce:hidden" />
        <span className="relative inline-flex size-2 rounded-full bg-accent" />
      </span>
      Private beta · Launching soon
    </span>
  );
}

const floating: { name: BrandName; pos: string; anim: string }[] = [
  { name: "gmail", pos: "left-[7%] top-24", anim: "float-a" },
  { name: "calendar", pos: "left-[3%] top-64", anim: "float-b" },
  { name: "notion", pos: "left-[11%] top-[25rem]", anim: "float-c" },
  { name: "whatsapp", pos: "right-[7%] top-20", anim: "float-b" },
  { name: "telegram", pos: "right-[3%] top-60", anim: "float-c" },
  { name: "slack", pos: "right-[11%] top-[24rem]", anim: "float-a" },
];

const channels: BrandName[] = ["whatsapp", "telegram", "imessage", "web"];

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-16 sm:pt-24">
      <div aria-hidden className="dot-grid pointer-events-none absolute inset-x-0 top-0 h-[560px]" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 hidden h-[560px] lg:block">
        {floating.map((f) => (
          <div key={f.name} className={`absolute ${f.pos} ${f.anim}`}>
            <BrandIcon name={f.name} tile size={22} />
          </div>
        ))}
      </div>

      <Container className="relative flex flex-col items-center text-center">
        <BetaBadge />
        <h1 className="mt-7 max-w-4xl text-[clamp(2.6rem,6.4vw,4.75rem)] font-bold leading-[1.02] tracking-[-0.045em]">
          Message it like a person.
          <br />
          It gets the work done
          <span aria-hidden className="brand-caret ml-1.5 inline-block h-[0.78em] w-[0.09em] translate-y-[0.06em] bg-accent" />
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl">
          Your personal AI agent on WhatsApp, Telegram and iMessage. It does real work in your apps, asks before
          anything risky, and keeps going on a schedule.
        </p>
        <WaitlistForm className="mt-9" />
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-5">
          <div className="flex items-center gap-4 text-sm text-muted">
            <span>Text it from</span>
            {channels.map((c) => (
              <BrandIcon key={c} name={c} size={20} />
            ))}
          </div>
          <span aria-hidden className="hidden h-8 w-px bg-line sm:block" />
          <FaceStack size={34} />
        </div>
      </Container>

      <ProductShowcase />
    </section>
  );
}
