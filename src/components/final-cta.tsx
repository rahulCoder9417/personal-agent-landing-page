import { waitlistDeal, type AgentId } from "@/lib/content";
import { site } from "@/lib/site";
import { Agent3D } from "./agent-3d";
import { FaceStack } from "./face-stack";
import { LiveBadge, SignUpActions } from "./hero";
import { Container } from "./section";

// Feet sit 85% down each still render, so a -15% bottom margin stands every agent on the card's top edge.
const perched: { who: AgentId; size: number; pose: "left" | "front" | "right"; hideSm?: boolean }[] = [
  { who: "scout", size: 140, pose: "left", hideSm: true },
  { who: "byte", size: 150, pose: "left" },
  { who: "tex", size: 210, pose: "front" },
  { who: "patch", size: 150, pose: "right" },
];

export function FinalCta() {
  return (
    // overflow-x-clip: on narrow phones the perched crew is wider than the screen; clip it instead of scrolling sideways.
    <section id="get-started" aria-labelledby="get-started-title" className="overflow-x-clip pb-24 pt-52 sm:pb-32">
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
            <LiveBadge />
            <h2 id="get-started-title" className="mt-6 text-[clamp(2.2rem,5vw,3.5rem)] font-bold leading-[1.02] tracking-[-0.045em]">
              Put your crew to work.
            </h2>
            <p className="mt-4 max-w-lg text-lg leading-relaxed text-muted">
              Sign up in a minute and start with 100 free credits, good for 14 days. Text Tex in the web app, or link
              Telegram.
            </p>
            <SignUpActions second={{ href: site.signInUrl, label: "Sign in" }} className="mt-8" />
            <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent-soft px-3.5 py-1.5 text-[13.5px] font-medium text-accent">
              <span aria-hidden className="grid size-5 place-items-center rounded-full bg-accent font-mono text-[10px] font-bold text-white">
                %
              </span>
              {waitlistDeal}
            </p>
            <FaceStack size={34} className="mt-8" />
          </div>
        </div>
      </Container>
    </section>
  );
}
