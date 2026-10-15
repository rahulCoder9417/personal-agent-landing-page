import { captain, crew, roadmap, type AgentId } from "@/lib/content";
import { Agent3D } from "./agent-3d";
import { CrewStory } from "./crew-story";
import { FaceStack } from "./face-stack";
import { Reveal } from "./reveal";
import { Container, Eyebrow } from "./section";

const TINT: Record<AgentId, string> = {
  tex: "bg-accent-soft",
  byte: "bg-[#EFEAFF]",
  patch: "bg-[#FDF3E1]",
  scout: "bg-[#E4F4F2]",
};

export function Crew() {
  return (
    <section id="crew" aria-labelledby="crew-title" className="py-20 sm:py-28">
      <Container>
        <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col items-start">
            <Eyebrow>What&apos;s next</Eyebrow>
            <h2 id="crew-title" className="mt-5 text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.05] tracking-[-0.04em]">
              Meet your crew.
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted">
              Tex is the captain you text, and it&apos;s there from day one. Three specialists arrive with or soon after
              launch: Byte for coding, Patch for code review and Scout for research. Tex hands them work and puts the
              results together. Every send still waits for your OK.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-4">
            <FaceStack size={40} />
            <a href="#waitlist" className="inline-flex h-10 items-center rounded-full bg-fg px-5 text-sm font-medium text-white hover:bg-black">
              Get early access
            </a>
          </div>
        </Reveal>

        <Reveal className="mt-10" delay={0.05}>
          <CrewStory />
          <p className="mt-3 text-center text-[12.5px] text-muted">A preview of how the crew will work together. The specialists arrive with or soon after launch.</p>
        </Reveal>

        <Reveal className="mt-16" delay={0.05}>
          <ul className="grid gap-4 md:grid-cols-2">
            {[captain, ...crew].map((m) => (
              <li key={m.id} className="flex gap-5 rounded-3xl border border-line bg-surface p-4 shadow-soft">
                <span className={`flex size-28 shrink-0 items-end justify-center overflow-hidden rounded-2xl ${TINT[m.id]}`}>
                  <span className="-mb-3">
                    <Agent3D who={m.id} size={124} />
                  </span>
                </span>
                <div className="min-w-0 py-1.5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold tracking-[-0.02em]">{m.name}</h3>
                    {m.id === "tex" ? (
                      <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-medium text-accent">At launch</span>
                    ) : (
                      <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[11px] font-medium text-muted">Soon</span>
                    )}
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
          <ul className="mt-8 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
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
