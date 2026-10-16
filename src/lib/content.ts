// All landing-page copy lives here, so wording can change without touching layout.
// Facts come from the backend HLD and the launch plan (channels, crew, AI options, plans, credits, security, roadmap).

export type AgentId = "tex" | "byte" | "patch" | "scout";

export const channels = ["Telegram", "Web app"] as const;

export const steps = [
  {
    title: "Sign up",
    body: "Create your account on the web app. You start with 100 free credits.",
  },
  {
    title: "Link Telegram",
    body: "The web app shows a one-time code. Send it to our Telegram bot, and that chat becomes your agent. Or just chat in the web app.",
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
    { icon: "github", name: "GitHub", actions: ["Review pull requests", "Open pull requests", "Comment on a PR"] },
  ],
  categories: ["Email", "Calendar", "Notes", "Tasks", "CRM", "Dev", "Research"],
  total: "Gmail, Google Calendar, Notion, Slack, GitHub and more",
} as const;

// `who` is the crew member that does the work and answers; it defaults to Tex.
export const useCases: {
  ask: string;
  result: string;
  tag: string;
  tone: { bg: string; fg: string };
  icons: ("gmail" | "calendar" | "notion" | "github" | "telegram")[];
  who?: AgentId;
}[] = [
  {
    ask: "Review every pull request on my repo and text me the verdict.",
    result: "Patch reviews it, comments on the PR, and sends a short summary to your chat.",
    tag: "Code review",
    tone: { bg: "#FDF3E1", fg: "#8A5708" },
    icons: ["github", "telegram"],
    who: "patch",
  },
  {
    ask: "Fix the typo on the pricing page and open a PR.",
    result: "Byte makes the change on a branch and opens a pull request for you to merge. It never pushes to your main branch.",
    tag: "Coding",
    tone: { bg: "#E8F7EE", fg: "#13803F" },
    icons: ["github"],
    who: "byte",
  },
  {
    ask: "Move my 3pm with Maya to tomorrow and let her know.",
    result: "Moves the event in Google Calendar, drafts the note to Maya, and sends it once you tap Approve.",
    tag: "Calendar",
    tone: { bg: "#EEF3FE", fg: "#1A56DB" },
    icons: ["calendar", "gmail"],
  },
  {
    ask: "Every Monday at 9am, send me my week.",
    result: "Reads your calendar and inbox and sends a short summary every Monday morning.",
    tag: "Automation",
    tone: { bg: "#F1EDFF", fg: "#5B34D6" },
    icons: ["calendar", "gmail"],
  },
  {
    ask: "Tell me when my boss emails.",
    result: "Watches Gmail and messages you the moment that email lands.",
    tag: "Trigger",
    tone: { bg: "#FDEDEB", fg: "#B42318" },
    icons: ["gmail"],
  },
  {
    ask: "Turn this voice note into meeting notes in Notion.",
    result: "Transcribes it and files tidy notes on the right Notion page.",
    tag: "Notes",
    tone: { bg: "#F1F0EC", fg: "#3F3D38" },
    icons: ["notion"],
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
    body: "We don't use your data to train AI models, and that includes Textcrew AI. With your own API key or Claude plan, the AI runs on your own account with that provider.",
  },
  {
    title: "Delete anytime",
    body: "Deleting your account removes your workspace, memory, messages and connected apps. Backups clear within 7 days.",
  },
  {
    title: "Locked-down sandbox",
    body: "Each agent runs in its own sandbox that can only reach approved services, so a bad website can't send it wandering.",
  },
  {
    title: "Secrets stay secret",
    body: "Your own API keys are encrypted and never shown again. Payments go through Polar, so we never see card details.",
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
    body: "Gmail, Google Calendar, Notion, Slack and GitHub, with more being added. On Max you can plug in your own MCP servers too.",
  },
  {
    title: "Three ways to run the AI",
    body: "Your own API key (Anthropic, OpenAI or OpenRouter), your Claude plan (beta), or Textcrew AI, paid in credits. Bring your own AI and that part isn't charged in credits.",
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
  role: "Captain",
  body: "The one you text. Tex handles the job itself or, as the crew arrives, hands each piece to the right specialist and puts the results together.",
};

// The three specialists arrive with or soon after launch.
export const crew: CrewMember[] = [
  { id: "byte", name: "Byte", role: "Coding", body: "Writes and fixes code on a branch and opens a pull request for you to merge. It can also hand work to your own Claude Code." },
  { id: "patch", name: "Patch", role: "Code review", body: "Runs several reviewers on a pull request, comments on the PR and sends a short verdict to your chat." },
  { id: "scout", name: "Scout", role: "Research", body: "Searches the web and reads pages. On the Max plan it also drives a real browser, for sites that need a login, clicks or forms, or that have no API." },
];

export const roadmap = [
  {
    title: "More channels",
    body: "Where the platforms allow it: iMessage as a beta, WhatsApp in regions where it is permitted, and Slack, email and Discord.",
  },
  {
    title: "Desktop app",
    body: "Let Tex work with files and apps on your own computer, and hand tasks to your own Claude Code.",
  },
  {
    title: "More apps",
    body: "More integrations, beyond Gmail, Google Calendar, Notion, Slack and GitHub.",
  },
  {
    title: "Teams and workspaces",
    body: "Shared agents for small companies, with roles and permissions.",
  },
];

export type Plan = {
  name: string;
  price: string;
  /** The regular price, said in plain words beside the launch price. Never struck out: it has never been charged. */
  regular?: string;
  waitlist?: string;
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
      "10 apps",
      "1 automation",
      "Your own AI key, your Claude plan (beta) or Textcrew AI",
    ],
  },
  {
    name: "Pro",
    price: "$19",
    regular: "$30",
    waitlist: "$9.50",
    cadence: "per month",
    blurb: "For your everyday assistant.",
    featured: true,
    items: [
      "1,500 credits every month",
      "All apps",
      "5 automations",
      "Top-ups: $10 for 800 credits",
      "Your own AI key, your Claude plan (beta) or Textcrew AI",
    ],
  },
  {
    name: "Max",
    price: "$30",
    regular: "$50",
    waitlist: "$15",
    cadence: "per month",
    blurb: "For heavy, multi-step work.",
    items: [
      "4,500 credits every month",
      "Priority when things get busy",
      "All apps, plus your own MCP servers",
      "Browser use for sites without an API, at 2 credits per minute",
      "50 automations",
      "Top-ups: $10 for 800 credits",
      "Your own AI key, your Claude plan (beta) or Textcrew AI",
    ],
  },
];

export const waitlistDeal = "Waitlist members get 50% off their first month of Pro or Max.";

export const paymentNote =
  "Prices are in US dollars. Depending on where you live, tax such as GST or VAT is added at checkout or already included. Payments are handled by Polar, our merchant of record. Plans renew every month until you cancel; cancel any time in the web app and you keep your plan until the end of the month you paid for.";

export const creditNotes = [
  { label: "1 credit ≈ 1 cent", body: "Credits pay for your agent's running time (1 credit per 10 minutes), actions that change something in your apps (1 credit each; reading and searching are free), browser time on Max (2 credits per minute) and Textcrew AI if you use it. Bring your own AI and that part isn't charged in credits." },
  { label: "Credits last 90 days", body: "Every credit is good for 90 days from the day you get it, whether it came from your plan, a top-up or a code. The oldest credits are used first." },
  { label: "No surprise bills", body: "At zero, Tex pauses and tells you in chat. Upgrade, buy a top-up or redeem a code to carry on." },
];

// `pricing` marks the questions repeated on the /pricing page.
export const faqs: { q: string; a: string; pricing?: boolean }[] = [
  {
    q: "When does Textcrew launch?",
    a: "We're in private beta now and letting people in in small batches. Join the waitlist and we'll email you when your spot opens.",
  },
  {
    q: "How does the beta work?",
    pricing: true,
    a: "Everyone starts on the Free plan with 100 credits. Waitlist members get 50% off their first month of Pro or Max, and beta invites can come with a code that adds extra free credits, so you can put Tex on real work before paying anything.",
  },
  {
    q: "What will it cost?",
    pricing: true,
    a: "Free is $0. Pro is $19 a month and Max is $30 a month. These are launch prices: the regular prices are $30 and $50 a month. If you join the waitlist, your first month of Pro or Max is half price: $9.50 or $15.",
  },
  {
    q: "Which chat apps does it work with?",
    a: "Telegram and the web app at launch. More channels are planned where the platforms allow it: iMessage as a beta, WhatsApp in regions where it is permitted, and Slack, email and Discord.",
  },
  {
    q: "How many automations can I run?",
    pricing: true,
    a: "One on Free, five on Pro and 50 on Max. Set one up by texting Tex, like \"every Monday at 9am, send me my week\". Automations pause on their own if you run out of credits.",
  },
  {
    q: "Will it do things without asking me?",
    a: "Not the risky ones. Sending to other people, deleting things or spending money always waits for your Approve. Everything else is logged so you can see exactly what happened.",
  },
  {
    q: "What can it connect to?",
    pricing: true,
    a: "Gmail, Google Calendar, Notion, Slack and GitHub, and more apps are being added. Free connects 10 apps; Pro and Max connect all of them. On Max you can add your own MCP servers, and your agent can use a real browser for sites without an API.",
  },
  {
    q: "What is a credit?",
    pricing: true,
    a: "One credit is about one cent. Credits pay for Textcrew AI if you use it, your agent's running time (1 credit per 10 minutes), actions in your apps (1 credit per action that changes something, such as sending an email or creating an event; reading and searching are free) and, on the Max plan, browser time (2 credits per minute). If you bring your own AI, the AI part isn't charged in credits. Every credit lasts 90 days, and the activity log shows the credits used by every task.",
  },
  {
    q: "How do I cancel a paid plan?",
    pricing: true,
    a: "In the web app, on Pricing, press Cancel plan. Your plan doesn't renew, and you keep it until the end of the month you paid for, then move to Free. Your credits stay until they expire. Invoices, receipts and your card are on Polar's billing page, one click from the same screen.",
  },
  {
    q: "What happens when I run out of credits?",
    pricing: true,
    a: "Tex pauses and tells you in chat, and automations pause too. Upgrade, buy a top-up or redeem a code and it picks up where it left off.",
  },
  {
    q: "Do I need my own AI key?",
    pricing: true,
    a: "No. There are three ways to run the AI: your own API key (Anthropic, OpenAI or OpenRouter), your Claude plan (beta), which runs Claude Code, or Textcrew AI, paid in credits. If you bring your own AI, the AI part isn't charged in credits. An API key is encrypted, and only its last four characters are ever shown.",
  },
  {
    q: "Is my data used to train AI models?",
    a: "No. We don't use your data to train AI models, and that includes Textcrew AI. With your own API key or Claude plan, the AI runs on your own account with that provider.",
  },
  {
    q: "How do I delete my data?",
    a: "Delete your account from settings. That removes your agent's workspace, memory, messages and connected apps, and clears backups within 7 days.",
  },
];

export const pricingFaqs = faqs.filter((f) => f.pricing);
