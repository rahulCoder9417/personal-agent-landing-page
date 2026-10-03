"use client";

import { useEffect, useState } from "react";
import type { AgentId } from "@/lib/content";
import type { Pose } from "@/lib/agent-studio";
import { AgentFigure } from "./agent";

const LABELS: Record<AgentId, string> = {
  tex: "Tex, the captain",
  byte: "Byte, coding",
  patch: "Patch, code review",
  scout: "Scout, research",
};

// A 3D-rendered agent as a still image. Shows the 2D figure until the render is ready, or if WebGL isn't available.
export function Agent3D({
  who,
  size,
  pose = "front",
  className = "",
  float,
}: {
  who: AgentId;
  size: number;
  pose?: Pose;
  className?: string;
  float?: "a" | "b" | "c";
}) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    import("@/lib/agent-studio")
      .then(({ renderAgent }) => renderAgent(who, pose))
      .then((url) => {
        if (alive) setSrc(url);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [who, pose]);

  return (
    <span className={`relative inline-block shrink-0 ${float ? `float-${float}` : ""} ${className}`} style={{ width: size, height: size }}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element -- generated in the browser as a data URL
        <img src={src} alt={LABELS[who]} width={size} height={size} className="h-full w-full select-none" draggable={false} />
      ) : (
        <span className="flex h-full w-full items-end justify-center pb-[10%]">
          <AgentFigure who={who} size={size} label={LABELS[who]} className="h-[82%] w-auto" />
        </span>
      )}
    </span>
  );
}
