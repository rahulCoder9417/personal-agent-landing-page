import { crew, roadmap, type AgentId } from "@/lib/content";
import { Agent3D } from "./agent-3d";
import { FaceStack } from "./face-stack";
import { Reveal } from "./reveal";
import { Container, Eyebrow } from "./section";

const TINT: Record<AgentId, string> = {
  tex: "bg-accent-soft",
  scout: "bg-[#E4F4F2]",
  byte: "bg-[#EFEAFF]",
  patch: "bg-[#FDF3E1]",
  echo: "bg-[#FCE8F0]",
  pitch: "bg-[#E5F4EB]",
  tock: "bg-[#FFEDE4]",
};

// Still renders put the feet 85% of the way down and leave empty space either side of the figure,
// so negative margins line the feet up on one floor and bring the figures close together.
const lineup: { who: AgentId; size: number; pose: "left" | "front" | "right"; float: "a" | "b" | "c"; hideSm?: boolean }[] = [
  { who: "scout", size: 150, pose: "left", float: "b" },
  { who: "byte", size: 165, pose: "left", float: "c", hideSm: true },
  { who: "tex", size: 245, pose: "front", float: "a" },
  { who: "echo", size: 165, pose: "right", float: "b", hideSm: true },
  { who: "pitch", size: 150, pose: "right", float: "c" },
];

export function Crew() {
  return (
    <section id="crew" aria-labelledby="crew-title" className="py-20 sm:py-28">
      <Container>
        <Reveal className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.3fr)]">
          <div className="flex flex-col items-start">
            <Eyebrow>What&apos;s next</Eyebrow>
            <h2 id="crew-title" className="mt-5 text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.05] tracking-[-0.04em]">
              Meet your crew.
            </h2>
            <p className="mt-4 max-w-md text-lg leading-relaxed text-muted">
              Tex is the captain you text, and it&apos;s there from day one. Next come specialists Tex can hand work to, then
              combine the results for you. Every send still waits for your OK.
            </p>
            <FaceStack size={40} className="mt-6" />
            <a href="#waitlist" className="mt-7 inline-flex h-10 items-center rounded-full bg-fg px-5 text-sm font-medium text-white hover:bg-black">
              Get early access
            </a>
          </div>
          <div className="relative overflow-hidden rounded-[28px] border border-line bg-surface shadow-soft">
            <div aria-hidden className="dot-grid absolute inset-0" />
            <div aria-hidden className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-surface-2 to-transparent" />
            <div className="relative flex items-end justify-center px-2 pt-6">
              {lineup.map((a) => (
                <div
                  key={a.who}
                  className={`${a.hideSm ? "hidden sm:block" : ""} ${a.who === "tex" ? "z-10" : ""}`}
                  style={{ marginBottom: -a.size * 0.12, marginInline: -a.size * 0.2 }}
                >
                  <Agent3D who={a.who} size={a.size} pose={a.pose} float={a.float} />
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal className="mt-16" delay={0.05}>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {crew.map((m) => (
              <li key={m.id} className="flex gap-5 rounded-3xl border border-line bg-surface p-4 shadow-soft">
                <span className={`flex size-28 shrink-0 items-end justify-center overflow-hidden rounded-2xl ${TINT[m.id]}`}>
                  <span className="-mb-3">
                    <Agent3D who={m.id} size={124} />
                  </span>
                </span>
                <div className="min-w-0 py-1.5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold tracking-[-0.02em]">{m.name}</h3>
                    <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[11px] font-medium text-muted">Soon</span>
                  </div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-muted">{m.role}</p>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-muted">{m.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="mt-20" delay={0.05}>
          <h3 className="text-center text-2xl font-bold tracking-[-0.03em]">Also on the way</h3>
          <ul className="mt-8 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
            {roadmap.map((r) => (
              <li key={r.title} className="bg-surface p-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-accent">Next</p>
                <h4 className="mt-2 font-semibold tracking-[-0.01em]">{r.title}</h4>
                <p className="mt-1.5 text-[14px] leading-relaxed text-muted">{r.body}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
