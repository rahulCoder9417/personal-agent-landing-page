"use client";

export function Switch({ on, onToggle, label }: { on: boolean; onToggle: () => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onToggle}
      className={`relative h-6 w-10 shrink-0 cursor-pointer rounded-full transition-colors ${on ? "bg-accent" : "bg-line"}`}
    >
      {/* Pinned to the left edge; without left-0 the button's centring moves the knob off the track */}
      <span
        className={`absolute left-0 top-0.5 size-5 rounded-full bg-white shadow transition-transform duration-200 ease-out ${on ? "translate-x-[18px]" : "translate-x-0.5"}`}
      />
    </button>
  );
}
