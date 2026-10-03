import type { AgentId } from "@/lib/content";
import { AgentFigure } from "./agent";

const ORDER: AgentId[] = ["tex", "byte", "patch", "scout"];

// All four agents' 2D faces, overlapping like a team avatar stack.
export function FaceStack({ size = 36, label = true, className = "" }: { size?: number; label?: boolean; className?: string }) {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <ul aria-label="Tex and the crew" className="flex items-center">
        {ORDER.map((who, i) => (
          <li
            key={who}
            className="grid place-items-center rounded-full bg-surface ring-2 ring-bg transition-transform hover:z-10 hover:-translate-y-1"
            style={{ width: size, height: size, marginLeft: i === 0 ? 0 : -size * 0.28, zIndex: ORDER.length - i }}
          >
            <AgentFigure who={who} glyph size={Math.round(size * 0.84)} />
          </li>
        ))}
      </ul>
      {label && (
        <span className="text-left text-[13px] leading-tight text-muted">
          <span className="font-medium text-fg">Tex</span> + 3 specialists
          <br />
          on the way
        </span>
      )}
    </div>
  );
}
