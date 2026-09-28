export const site = {
  name: "Textcrew",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://textcrew.ai",
  title: "Textcrew · Your AI agent, in the chats you already use",
  tagline: "Message it like a person. It gets the work done.",
  description:
    "Textcrew is a personal AI agent you message on WhatsApp, Telegram or iMessage. It does real work in Gmail, Calendar, Notion, Slack and more, asks before anything risky, and keeps working on a schedule. Private beta, launching soon.",
  status: "Private beta · Launching soon",
} as const;
