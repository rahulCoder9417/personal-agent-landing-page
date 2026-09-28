// All landing-page copy lives here, so wording can change without touching layout.
// Facts come from the platform overview and the backend HLD (plans, credits, security, roadmap).

export type AgentId = "tex" | "scout" | "byte" | "patch" | "echo" | "pitch" | "tock";

export const channels = ["WhatsApp", "Telegram", "iMessage", "Web app"] as const;

export const steps = [
  {
    title: "Sign up",
    body: "Create your account on the web app. You start with 100 free credits.",
  },
  {
    title: "Link your chat app",
    body: "The web app shows a one-time code. Send it to our WhatsApp number or Telegram bot, and that chat becomes your agent.",
  },
  {
    title: "Connect your apps",
    body: "Gmail, Calendar, Notion and the rest connect through their own sign-in screens. We never see your passwords.",
  },
  {
    title: "Message it",
    body: "Type or send a voice note. Tex works in the background and replies in the same chat when it's done.",
  },
];

export const apps = {
  cards: [
    { icon: "gmail", name: "Gmail", actions: ["Send and reply to email", "Draft replies for your OK", "Find that one email"] },
    { icon: "calendar", name: "Google Calendar", actions: ["Create and move events", "Find free time", "Send invites"] },
    { icon: "notion", name: "Notion", actions: ["Create pages", "Add database rows", "File meeting notes"] },
    { icon: "slack", name: "Slack", actions: ["Post to channels", "Search messages", "Set reminders"] },
  ],
  categories: ["Email", "Calendar", "Notes", "Tasks", "CRM", "Dev", "Research"],
  total: "About 25 apps at launch",
} as const;

export const useCases: { ask: string; result: string; tag: string; icons: ("gmail" | "calendar" | "notion" | "slack" | "whatsapp" | "telegram")[] }[] = [
  {
    ask: "Move my 3pm with Priya to tomorrow and let her know.",
    result: "Moves the event in Google Calendar, drafts the note to Priya, and sends it once you tap Approve.",
    tag: "Calendar",
    icons: ["calendar", "gmail"],
  },
  {
    ask: "Every Monday at 9am, send me my week.",
    result: "Reads your calendar and inbox and sends a short summary every Monday morning.",
    tag: "Automation",
    icons: ["calendar", "gmail"],
  },
  {
    ask: "Remind me Friday to chase the invoice.",
    result: "Sets the reminder and pings you in this chat on Friday.",
    tag: "Reminder",
    icons: ["whatsapp", "telegram"],
  },
  {
    ask: "Tell me when my boss emails.",
    result: "Watches Gmail and messages you the moment that email lands.",
    tag: "Trigger",
    icons: ["gmail"],
  },
  {
    ask: "Turn this voice note into meeting notes in Notion.",
    result: "Transcribes it and files tidy notes on the right Notion page.",
    tag: "Notes",
    icons: ["notion"],
  },
  {
    ask: "Post today's update in #team on Slack.",
    result: "Writes the update from your notes and posts it after you approve it.",
    tag: "Slack",
    icons: ["slack"],
  },
];

export const automations = [
  {
    kind: "Once",
    example: "Remind me Friday at 10am to call the bank.",
    detail: "Reminders and one-off follow-ups.",
  },
  {
    kind: "On repeat",
    example: "Every weekday at 8am, send me today's meetings.",
    detail: "Daily and weekly routines, in your time zone.",
  },
  {
    kind: "When something happens",
    example: "When a new lead fills my form, add it to my CRM.",
    detail: "Triggers from the apps you've connected.",
  },
];

export const trust = [
  {
    title: "Your agent is yours alone",
    body: "Every account gets a private, isolated workspace. Your agent's memory, files and notes never mix with anyone else's.",
  },
  {
    title: "We never see your passwords",
    body: "Apps connect through their own sign-in screens. Access tokens stay with our integration provider and are never handed to the agent.",
  },
  {
    title: "It asks before it acts",
    body: "Sending to other people, deleting things or spending money always waits for your Approve.",
  },
  {
    title: "Everything is logged",
    body: "The activity log shows every action Tex took, when it happened and how many credits it used.",
  },
  {
    title: "Not used to train AI",
    body: "We use AI providers' APIs, which don't train on API data. With your own key, your provider's terms apply.",
  },
  {
    title: "Delete anytime",
    body: "Deleting your account removes your workspace, memory, messages and connected apps. Backups clear within 30 days.",
  },
  {
    title: "Locked-down sandbox",
    body: "Each agent runs in its own sandbox that can only reach approved services, so a bad website can't send it wandering.",
  },
  {
    title: "Secrets stay secret",
    body: "Your own API keys are encrypted and never shown again. Payments go through Dodo Payments, so we never see card details.",
  },
];

export const features = [
  {
    title: "Voice notes, images and files",
    body: "Talk instead of typing, or send a photo or a PDF. Tex handles them as part of the job.",
  },
  {
    title: "Remembers what matters",
    body: "People, preferences and ongoing projects stay in your agent's memory, so you don't repeat yourself.",
  },
  {
    title: "Your apps, plus your own tools",
    body: "About 25 apps at launch. On Max you can plug in your own MCP servers too.",
  },
  {
    title: "Premium models, or your own key",
    body: "Pro and Max unlock premium models. Every plan can bring an Anthropic, OpenAI or OpenRouter key.",
  },
  {
    title: "A web app for the details",
    body: "History, pending approvals, automations, connected apps, credits and the full activity log in one place.",
  },
  {
    title: "Credits you can see",
    body: "Each task shows what it cost. No surprise bills: at zero, Tex pauses and tells you.",
  },
];

export type CrewMember = {
  id: AgentId;
  name: string;
  role: string;
  body: string;
};

export const captain: CrewMember = {
  id: "tex",
  name: "Tex",
  role: "Captain · available at launch",
  body: "The one you text. Tex handles the job itself or, as the crew arrives, hands each piece to the right specialist and puts the results together.",
};

export const crew: CrewMember[] = [
  { id: "scout", name: "Scout", role: "Research", body: "Deep research reports, competitor tracking and market scans." },
  { id: "byte", name: "Byte", role: "Coder", body: "Writes and fixes code, and can hand work to your own Claude Code or Codex." },
  { id: "patch", name: "Patch", role: "Code review", body: "Reviews pull requests on GitHub, leaves comments and flags risky changes." },
  { id: "echo", name: "Echo", role: "Marketing", body: "Drafts LinkedIn and X posts, blogs and newsletters in your voice, and tracks what works." },
  { id: "pitch", name: "Pitch", role: "Sales", body: "Finds leads and writes outreach in your voice. Every send goes through your approval queue." },
  { id: "tock", name: "Tock", role: "Ops", body: "Meetings, follow-ups, CRM updates and invoices, handled on time." },
];

export const roadmap = [
  {
    title: "A review queue",
    body: "See every draft your crew prepares before it ships, and approve in bulk.",
  },
  {
    title: "Desktop app",
    body: "Let Tex work with files and apps on your own computer, and hand tasks to your Claude Code or Codex.",
  },
  {
    title: "More channels",
    body: "Message your agent from Slack, email and Discord.",
  },
  {
    title: "Hundreds more apps",
    body: "Many more integrations, plus browser automation for sites without an API.",
  },
  {
    title: "Teams and workspaces",
    body: "Shared agents for small companies, with roles and permissions.",
  },
];

export type Plan = {
  name: string;
  price: string;
  cadence: string;
  blurb: string;
  items: string[];
  featured?: boolean;
};

export const plans: Plan[] = [
  {
    name: "Free",
    price: "$0",
    cadence: "forever",
    blurb: "Try it on real work.",
    items: [
      "100 credits at sign-up, plus coupon codes",
      "Standard models (fast, low cost)",
      "10 apps",
      "3 automations",
      "Bring your own AI key",
    ],
  },
  {
    name: "Pro",
    price: "$12",
    cadence: "per month",
    blurb: "For your everyday assistant.",
    featured: true,
    items: [
      "1,500 credits every month",
      "All models, including premium",
      "All 25 apps",
      "20 automations",
      "Top-ups: $10 for 800 credits",
      "Bring your own AI key",
    ],
  },
  {
    name: "Max",
    price: "$29",
    cadence: "per month",
    blurb: "For heavy, multi-step work.",
    items: [
      "4,500 credits every month",
      "All models, with priority",
      "All 25 apps plus your own MCP servers",
      "50 automations",
      "Top-ups: $10 for 800 credits",
      "Bring your own AI key",
    ],
  },
];

export const creditNotes = [
  { label: "1 credit ≈ 1 cent", body: "A simple task uses a few credits. A big multi-step task on a premium model uses more." },
  { label: "Credits expire", body: "Monthly credits at the end of the month, coupon credits 30 days after you redeem, top-ups after 12 months. The oldest-expiring credits are used first." },
  { label: "No surprise bills", body: "At zero, Tex pauses and tells you in chat. Upgrade, buy a top-up or redeem a code to carry on." },
];

export const faqs = [
  {
    q: "When does Textcrew launch?",
    a: "We're in private beta now and letting people in in small batches. Join the waitlist and we'll email you when your spot opens.",
  },
  {
    q: "How does the beta work?",
    a: "Everyone starts on the Free plan with 100 credits. Beta invites can come with a code that adds extra free credits, so you can put Tex on real work before paying anything.",
  },
  {
    q: "Which chat apps does it work with?",
    a: "WhatsApp, Telegram and iMessage, plus the web app. Slack, email and Discord are on the roadmap.",
  },
  {
    q: "Will it do things without asking me?",
    a: "Not the risky ones. Sending to other people, deleting things or spending money always waits for your Approve. Everything else is logged so you can see exactly what happened.",
  },
  {
    q: "What can it connect to?",
    a: "Gmail, Google Calendar, Notion, Slack and about 20 more apps at launch, across email, calendar, notes, tasks, CRM, dev and research. On Max you can add your own MCP servers.",
  },
  {
    q: "What is a credit?",
    a: "One credit is about one cent. Credits pay for the AI, the time your agent spends working and some paid tools. The activity log shows the credits used by every task.",
  },
  {
    q: "What happens when I run out of credits?",
    a: "Tex pauses and tells you in chat, and automations pause too. Upgrade, buy a top-up or redeem a code and it picks up where it left off.",
  },
  {
    q: "Can I use my own AI key?",
    a: "Yes, on every plan. Add an Anthropic, OpenAI or OpenRouter key and the AI itself isn't charged in credits. Your key is encrypted and only the last four characters are ever shown.",
  },
  {
    q: "Is my data used to train AI models?",
    a: "No. We use AI providers' APIs, which don't train on API data. If you bring your own key, your provider's terms apply.",
  },
  {
    q: "How do I delete my data?",
    a: "Delete your account from settings. That removes your agent's workspace, memory, messages and connected apps, and clears backups within 30 days.",
  },
];
