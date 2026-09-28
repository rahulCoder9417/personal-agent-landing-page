import { AgentFigure } from "./agent";

export function Logo({ size = 26 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-2">
      <AgentFigure who="tex" glyph size={size} label="Textcrew" />
      <span className="font-mono text-[1.05rem] font-bold tracking-[-0.03em] text-fg">textcrew</span>
      <span aria-hidden className="brand-caret -ml-1 inline-block h-4 w-[7px] bg-accent" />
    </span>
  );
}
