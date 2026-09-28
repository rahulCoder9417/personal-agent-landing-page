import type { AgentId } from "@/lib/content";
import { Agent3D } from "./agent-3d";
import { FaceStack } from "./face-stack";
import { BetaBadge } from "./hero";
import { Container } from "./section";
import { WaitlistForm } from "./waitlist-form";

// Feet sit 85% down each still render, so a -15% bottom margin stands every agent on the card's top edge.
const perched: { who: AgentId; size: number; pose: "left" | "front" | "right"; hideSm?: boolean }[] = [
  { who: "tock", size: 130, pose: "left", hideSm: true },
  { who: "scout", size: 150, pose: "left" },
  { who: "tex", size: 210, pose: "front" },
  { who: "echo", size: 150, pose: "right" },
  { who: "patch", size: 130, pose: "right", hideSm: true },
];

export function FinalCta() {
  return (
    <section id="waitlist" aria-labelledby="waitlist-title" className="pb-24 pt-52 sm:pb-32">
      <Container>
        <div className="relative mx-auto max-w-4xl">
          <div className="absolute inset-x-0 bottom-full flex items-end justify-center">
            {perched.map((a) => (
              <div key={a.who} className={`-mx-5 ${a.hideSm ? "hidden sm:block" : ""} ${a.who === "tex" ? "z-10" : ""}`} style={{ marginBottom: -a.size * 0.15 }}>
                <Agent3D who={a.who} size={a.size} pose={a.pose} />
              </div>
            ))}
          </div>
          <div className="relative flex flex-col items-center rounded-[28px] border border-line bg-surface px-6 pb-14 pt-16 text-center shadow-window sm:px-12">
            <BetaBadge />
            <h2 id="waitlist-title" className="mt-6 text-[clamp(2.2rem,5vw,3.5rem)] font-bold leading-[1.02] tracking-[-0.045em]">
              Get your crew early.
            </h2>
            <p className="mt-4 max-w-lg text-lg leading-relaxed text-muted">
              We&apos;re letting beta testers in small batches before launch. Join the waitlist and your first month of Pro
              or Max is half price.
            </p>
            <WaitlistForm showChannels className="mt-8" />
            <FaceStack size={34} className="mt-8" />
          </div>
        </div>
      </Container>
    </section>
  );
}
