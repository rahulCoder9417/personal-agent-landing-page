export const site = {
  name: "Textcrew",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://textcrew.in",
  // Search results: says what it is. Social cards use the tagline instead.
  seoTitle: "Textcrew: your AI crew on Telegram and the web",
  title: "Textcrew · Got a lot of work? Just text your crew.",
  tagline: "Got a lot of work? Just text your crew.",
  // Kept under ~160 characters so search results show it whole.
  description:
    "Text your AI crew on Telegram or the web app. Tex splits the job, gets it done in Gmail, GitHub, Google Calendar and more, runs automations, and asks before anything risky.",
  keywords: [
    "AI agent",
    "AI assistant",
    "personal AI agent",
    "AI agent on Telegram",
    "AI assistant on Telegram",
    "AI code review",
    "pull request review",
    "AI executive assistant",
    "AI automation",
    "Gmail automation",
    "GitHub AI agent",
    "multi-agent AI",
    "Textcrew",
  ],
  status: "Private beta · Launching soon",
  // Where people write to us: questions, account and payment help. Shown in the footer, on the
  // privacy page and the pricing page. Change it here only.
  contactEmail: "support@textcrew.in",
} as const;
