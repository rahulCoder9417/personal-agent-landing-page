import { site } from "@/lib/site";
import { BrandIcon, type BrandName } from "./brand-icon";
import { DemoVideo } from "./demo-video";
import { FaceStack } from "./face-stack";
import { ProductShowcase } from "./product-showcase";
import { Container } from "./section";

export function LiveBadge() {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-[13px] font-medium text-muted shadow-soft">
      <span className="relative flex size-2">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#22A45D] opacity-50 motion-reduce:hidden" />
        <span className="relative inline-flex size-2 rounded-full bg-[#22A45D]" />
      </span>
      {site.status}
    </span>
  );
}

// The two ways in, used by the hero and the closing section: sign up (the main one) and a second
// action beside it (watch the demo, or sign in).
export function SignUpActions({ second, className = "" }: { second: { href: string; label: string; icon?: "play" }; className?: string }) {
  return (
    <div className={`flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:items-center ${className}`}>
      <a
        href={site.signUpUrl}
        className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-fg px-7 text-[15px] font-medium text-white shadow-soft transition-colors hover:bg-black"
      >
        Get started free
        <svg aria-hidden viewBox="0 0 16 16" className="size-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 8h10M9 4l4 4-4 4" />
        </svg>
      </a>
      <a
        href={second.href}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-line bg-surface px-6 text-[15px] font-medium text-fg shadow-soft transition-colors hover:border-fg/30"
      >
        {second.icon === "play" && (
          <svg aria-hidden viewBox="0 0 16 16" className="size-3.5 text-accent" fill="currentColor">
            <path d="M4.5 2.8v10.4a.6.6 0 0 0 .9.5l8.2-5.2a.6.6 0 0 0 0-1L5.4 2.3a.6.6 0 0 0-.9.5z" />
          </svg>
        )}
        {second.label}
      </a>
    </div>
  );
}

const floating: { name: BrandName; pos: string; anim: string }[] = [
  { name: "gmail", pos: "left-[7%] top-24", anim: "float-a" },
  { name: "telegram", pos: "left-[3%] top-64", anim: "float-b" },
  { name: "github", pos: "right-[7%] top-20", anim: "float-b" },
  { name: "web", pos: "right-[3%] top-60", anim: "float-c" },
];

const channels: BrandName[] = ["telegram", "web"];

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
        <LiveBadge />
        <h1 className="mt-7 max-w-4xl text-[clamp(2.6rem,6.4vw,4.75rem)] font-bold leading-[1.02] tracking-[-0.045em]">
          Got a lot of work?
          <br />
          Just text your crew
          <span aria-hidden className="brand-caret ml-1.5 inline-block h-[0.78em] w-[0.09em] translate-y-[0.06em] bg-accent" />
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl">
          Send one message on Telegram or in the web app. Tex, your AI captain, splits the job, calls in Byte, Patch and
          Scout when it helps, works in your apps and checks with you before anything risky.
        </p>
        <p className="mt-5 max-w-2xl text-[15px] font-medium text-fg sm:text-base">
          Bring your own Claude plan or API key. Don&apos;t pay for the AI twice.
        </p>
        <SignUpActions second={{ href: "#video", label: "Watch the demo", icon: "play" }} className="mt-9" />
        <p className="mt-4 text-[13.5px] text-muted">
          Start with 100 free credits, good for 14 days. Have an account?{" "}
          <a href={site.signInUrl} className="font-medium text-fg underline-offset-2 hover:underline">
            Sign in
          </a>
        </p>
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
        <div id="video" className="mt-14 w-full max-w-5xl scroll-mt-24 sm:mt-16">
          <DemoVideo />
          <p className="mt-3 text-[13px] text-muted">Textcrew in 57 seconds: one text, the crew at work, your OK, bring your own AI.</p>
        </div>
        <a
          href="#demo"
          className="group mt-16 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-[13px] font-medium text-muted shadow-soft transition-colors hover:text-fg"
        >
          Try the web app yourself
          <svg aria-hidden viewBox="0 0 16 16" className="size-3.5 transition-transform group-hover:translate-y-0.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 3v10M4 9l4 4 4-4" />
          </svg>
        </a>
      </Container>

      <ProductShowcase />
    </section>
  );
}
