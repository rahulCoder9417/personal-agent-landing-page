import {
  siAirtable,
  siAsana,
  siGithub,
  siGmail,
  siGooglecalendar,
  siGoogledrive,
  siGooglesheets,
  siHubspot,
  siLinear,
  siNotion,
  siTelegram,
  siTodoist,
  siTrello,
} from "simple-icons";

// Brand marks from simple-icons (CC0). Slack is not in simple-icons, so it gets a neutral "#" tile.
const ICONS = {
  gmail: siGmail,
  calendar: siGooglecalendar,
  notion: siNotion,
  telegram: siTelegram,
  github: siGithub,
  drive: siGoogledrive,
  sheets: siGooglesheets,
  linear: siLinear,
  hubspot: siHubspot,
  trello: siTrello,
  asana: siAsana,
  todoist: siTodoist,
  airtable: siAirtable,
} as const;

export type BrandName = keyof typeof ICONS | "slack" | "web";

export function BrandIcon({
  name,
  size = 20,
  tile = false,
  className = "",
}: {
  name: BrandName;
  size?: number;
  tile?: boolean;
  className?: string;
}) {
  let glyph: React.ReactNode;
  let label: string;

  if (name === "slack") {
    label = "Slack";
    glyph = (
      <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden fill="none" stroke="#4A154B" strokeWidth={2.4} strokeLinecap="round">
        <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
      </svg>
    );
  } else if (name === "web") {
    label = "Web app";
    glyph = (
      <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden fill="none" stroke="#151515" strokeWidth={1.8} strokeLinecap="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.8 3 2.8 15 0 18M12 3c-2.8 3-2.8 15 0 18" />
      </svg>
    );
  } else {
    const icon = ICONS[name];
    label = icon.title;
    glyph = (
      <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden fill={`#${icon.hex}`}>
        <path d={icon.path} />
      </svg>
    );
  }

  if (!tile) {
    return (
      <span role="img" aria-label={label} className={`inline-flex ${className}`}>
        {glyph}
      </span>
    );
  }
  return (
    <span
      role="img"
      aria-label={label}
      className={`inline-grid place-items-center rounded-[28%] border border-line bg-surface shadow-soft ${className}`}
      style={{ width: size * 2.1, height: size * 2.1 }}
    >
      {glyph}
    </span>
  );
}
