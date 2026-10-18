// The web app's small parts, redrawn for the showcase: its line icons, app logos on tinted tiles,
// buttons, pills, chips, filter pills and switch. Copied in look from user-frontend-web
// (src/components/ui.tsx, icons.tsx, brand-icon.tsx, automations/parts.tsx), not imported.

import type { ReactNode, SVGProps } from "react";
import { siGithub, siGmail, siGooglecalendar, siTelegram } from "simple-icons";
import { AgentFigure, type Mood } from "../agent";

export const cn = (...parts: (string | false | null | undefined)[]) => parts.filter(Boolean).join(" ");

// ---------------------------------------------------------------- icons (24px grid, 1.75 stroke)

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Base({ size = 20, children, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden {...rest}>
      {children}
    </svg>
  );
}

export const ChatIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z" />
  </Base>
);
export const ApprovalsIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6l7-3Z" />
    <path d="M9 12l2 2 4-4" />
  </Base>
);
export const AutomationsIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M20 12a8 8 0 1 1-2.6-5.9" />
    <path d="M20 4v4h-4" />
    <path d="M12 8v4l2.5 1.5" />
  </Base>
);
export const ActivityIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01" />
  </Base>
);
export const AppsIcon = (p: IconProps) => (
  <Base {...p}>
    <rect x="4" y="4" width="6.5" height="6.5" rx="1.5" />
    <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5" />
    <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5" />
    <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5" />
  </Base>
);
export const PricingIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 12.5V5.5a1.5 1.5 0 0 1 1.5-1.5h7L20 11.5 12.5 19 4 12.5Z" />
    <path d="M8.5 8.5h.01" />
  </Base>
);
export const SettingsIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 7h8M16 7h4M4 17h4M12 17h8" />
    <circle cx="14" cy="7" r="2" />
    <circle cx="10" cy="17" r="2" />
  </Base>
);
export const HelpIcon = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M9.6 9.4a2.5 2.5 0 0 1 4.85.85c0 1.65-2.45 2.2-2.45 3.6" />
    <path d="M12 16.9h.01" />
  </Base>
);
export const MoreIcon = (p: IconProps) => (
  <Base strokeWidth={2.4} {...p}>
    <path d="M5 12h.01M12 12h.01M19 12h.01" />
  </Base>
);
export const PanelIcon = (p: IconProps) => (
  <Base {...p}>
    <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
    <path d="M9.5 4.5v15" />
  </Base>
);
export const PanelRightIcon = (p: IconProps) => (
  <Base {...p}>
    <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
    <path d="M14.5 4.5v15" />
  </Base>
);
export const NewChatIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M11 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" />
    <path d="M17.5 3.5a2.1 2.1 0 0 1 3 3L13 14l-4 1 1-4 7.5-7.5Z" />
  </Base>
);
export const PaperclipIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M20 11.5l-8 8a5 5 0 0 1-7-7l8.5-8.5a3.3 3.3 0 0 1 4.7 4.7L9.8 17a1.7 1.7 0 0 1-2.4-2.4l7.6-7.6" />
  </Base>
);
export const SendIcon = (p: IconProps) => (
  <Base strokeWidth={2.2} {...p}>
    <path d="M12 19V5M6 11l6-6 6 6" />
  </Base>
);
export const CheckIcon = (p: IconProps) => (
  <Base strokeWidth={2} {...p}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </Base>
);
export const CloseIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Base>
);
export const ChevronRightIcon = (p: IconProps) => (
  <Base strokeWidth={2} {...p}>
    <path d="M9 6l6 6-6 6" />
  </Base>
);
export const ChevronsLeftIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M11 17l-5-5 5-5M18 17l-5-5 5-5" />
  </Base>
);
export const ClockIcon = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </Base>
);
export const CalendarIcon = (p: IconProps) => (
  <Base {...p}>
    <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
    <path d="M3.5 10h17M8 3v4M16 3v4" />
  </Base>
);
export const PlusIcon = (p: IconProps) => (
  <Base strokeWidth={2} {...p}>
    <path d="M12 5v14M5 12h14" />
  </Base>
);

// ---------------------------------------------------------------- app logos

export type AppName = "gmail" | "github" | "googlecalendar" | "telegram" | "web";

const MARKS = { gmail: siGmail, github: siGithub, googlecalendar: siGooglecalendar, telegram: siTelegram } as const;

export const APP_LABEL: Record<AppName, string> = { gmail: "Gmail", github: "GitHub", googlecalendar: "Google Calendar", telegram: "Telegram", web: "Web" };

/** An app's mark in its own colour. */
export function AppMark({ name, size = 18, className }: { name: AppName; size?: number; className?: string }) {
  if (name === "web") {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden fill="none" stroke="#151515" strokeWidth={1.8} strokeLinecap="round" className={cn("shrink-0", className)}>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.8 3 2.8 15 0 18M12 3c-2.8 3-2.8 15 0 18" />
      </svg>
    );
  }
  const icon = MARKS[name];
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden fill={`#${icon.hex}`} className={cn("shrink-0", className)}>
      <path d={icon.path} />
    </svg>
  );
}

/** An app's logo on a soft tile of its own colour, as apps appear in lists across the app. Black marks get a neutral tile. */
export function AppIcon({ name, size = 36, className }: { name: AppName; size?: number; className?: string }) {
  const hex = name === "web" ? null : MARKS[name].hex;
  const tint = hex && hex !== "181717" ? `#${hex}` : null;
  return (
    <span
      className={cn("grid shrink-0 place-items-center", className)}
      style={{ width: size, height: size, borderRadius: Math.round(size * 0.28), background: tint ? `color-mix(in srgb, ${tint} 11%, white)` : "var(--surface-2)" }}
    >
      <AppMark name={name} size={Math.round(size * 0.5)} />
    </span>
  );
}

export function IconTile({ size = 36, className, children }: { size?: number; className?: string; children: ReactNode }) {
  return (
    <span className={cn("grid shrink-0 place-items-center bg-surface-2", className)} style={{ width: size, height: size, borderRadius: Math.round(size * 0.28) }}>
      {children}
    </span>
  );
}

// ---------------------------------------------------------------- buttons, pills, chips

type Variant = "primary" | "secondary" | "ghost";

const VARIANT: Record<Variant, string> = {
  primary: "bg-fg text-white shadow-[0_1px_2px_rgb(21_21_21/0.2)] hover:bg-black",
  secondary: "bg-surface text-fg shadow-[var(--shadow-raised)] hover:bg-surface-2",
  ghost: "text-nav hover:bg-surface-2 hover:text-fg",
};

const SIZE = { sm: "h-[30px] rounded-lg px-3 text-[13px]", md: "h-[34px] rounded-[9px] px-3.5 text-[13.5px]" } as const;

export function buttonClass(variant: Variant = "secondary", size: keyof typeof SIZE = "md", className?: string) {
  return cn("inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 font-medium whitespace-nowrap transition-colors", VARIANT[variant], SIZE[size], className);
}

export type PillTone = "done" | "waiting" | "muted" | "danger";

const PILL: Record<PillTone, string> = {
  done: "bg-success-soft text-success",
  waiting: "bg-accent-soft text-accent-dark",
  muted: "bg-surface-2 text-nav",
  danger: "bg-danger-soft text-danger",
};

export function Pill({ tone = "muted", children }: { tone?: PillTone; children: ReactNode }) {
  return <span className={cn("inline-flex h-[22px] shrink-0 items-center rounded-md px-2 text-[12px] font-medium", PILL[tone])}>{children}</span>;
}

export function Chip({ mono, tone = "neutral", children }: { mono?: boolean; tone?: "neutral" | "warn"; children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 max-w-full shrink-0 items-center rounded-md px-2 text-[12px] leading-4 font-medium whitespace-nowrap",
        tone === "warn" ? "bg-warn-soft text-warn shadow-[inset_0_0_0_1px_var(--warn-line)]" : "bg-surface-2 text-fg-2",
        mono && "font-mono",
      )}
    >
      {children}
    </span>
  );
}

export type RunTone = "ok" | "warn" | "muted";

export function Dot({ tone }: { tone: RunTone }) {
  return <span aria-hidden className={cn("size-2 shrink-0 rounded-full", tone === "ok" ? "bg-online" : tone === "warn" ? "bg-warn-dot" : "bg-faint")} />;
}

/** A row of pill toggles where exactly one is chosen; the strip scrolls sideways when it doesn't fit. */
export function FilterPills<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string; count?: number }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div role="group" aria-label={label} className="flex max-w-full overflow-x-auto rounded-[10px] bg-surface-2 p-[3px] [scrollbar-width:none]">
      {options.map((option) => {
        const on = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(option.value)}
            className={cn(
              "inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-[7px] px-2.5 text-[13px] font-medium whitespace-nowrap transition-colors",
              on ? "bg-surface text-fg shadow-[var(--shadow-raised)]" : "text-nav hover:text-fg",
            )}
          >
            {option.label}
            {option.count !== undefined && <span className="text-[12px] text-muted tabular-nums">{option.count}</span>}
          </button>
        );
      })}
    </div>
  );
}

export function Switch({ on, onToggle, label }: { on: boolean; onToggle: () => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} onClick={onToggle} className="block shrink-0 cursor-pointer rounded-full">
      <span aria-hidden className={cn("relative block h-6 w-10 shrink-0 rounded-full transition-colors", on ? "bg-accent" : "bg-line-strong")}>
        <span
          className={cn(
            "absolute top-0.5 left-0 block size-5 rounded-full bg-white shadow transition-transform duration-200 ease-out",
            on ? "translate-x-[18px]" : "translate-x-0.5",
          )}
        />
      </span>
    </button>
  );
}

/** The screen's name, large, with its controls on the same line (the app's PageHeader). */
export function PageHeader({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <header className="flex shrink-0 flex-wrap items-center gap-x-5 gap-y-2.5 px-4 pt-4 pb-3 @min-[600px]:min-h-[68px] @min-[600px]:px-8 @min-[600px]:pt-5">
      <h2 className="text-[21px] leading-none font-semibold tracking-[-0.02em] whitespace-nowrap">{title}</h2>
      {children}
    </header>
  );
}

/** What a screen with nothing in it says, with Tex. */
export function Empty({ title, mood = "ready", children }: { title: string; mood?: Mood; children: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2 px-6 py-10 text-center">
      <AgentFigure who="tex" mood={mood} size={104} label="" />
      <p className="text-[16px] font-semibold tracking-[-0.01em]">{title}</p>
      <p className="max-w-sm text-[13.5px] text-muted">{children}</p>
    </div>
  );
}
