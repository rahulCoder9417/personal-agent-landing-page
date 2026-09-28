import type { ReactNode } from "react";
import { Reveal } from "./reveal";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 ${className}`}>{children}</div>;
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-[13px] font-medium text-muted shadow-soft">
      <span aria-hidden className="size-1.5 rounded-full bg-accent" />
      {children}
    </span>
  );
}

export function Section({
  id,
  eyebrow,
  title,
  lede,
  children,
  className = "",
}: {
  id?: string;
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const headingId = id ? `${id}-title` : undefined;
  return (
    <section id={id} aria-labelledby={headingId} className={`py-20 sm:py-28 ${className}`}>
      <Container>
        <Reveal className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 id={headingId} className="mt-5 text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.05] tracking-[-0.04em]">
            {title}
          </h2>
          {lede && <p className="mt-4 text-lg leading-relaxed text-muted">{lede}</p>}
        </Reveal>
        <Reveal className="mt-14" delay={0.05}>
          {children}
        </Reveal>
      </Container>
    </section>
  );
}
