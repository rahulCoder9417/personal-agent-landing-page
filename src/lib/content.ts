// All landing-page copy lives here, so wording can change without touching layout.
// Facts come from the backend HLD and the launch plan (channels, crew, AI options, plans, credits, security, roadmap).

export type AgentId = "tex" | "byte" | "patch" | "scout";

export const channels = ["Telegram", "Web app"] as const;

export const steps = [
  {
    title: "Sign up and pick your AI",
    body: "Create your account on the web app. You start with 100 free credits. Tex runs on Textcrew AI (paid in credits), your own API key or your own Claude plan.",
  },
  {
    title: "Link Telegram",
    body: "The web app shows a one-time code. Send it to our Telegram bot, and that chat becomes your agent. Or just chat in the web app. Your Telegram chats show up there too.",
  },
  {
    title: "Connect your apps",
    body: "In Integrations, press Connect on Gmail, GitHub, Google Calendar or another app. Each signs in on their own screens, so we never see your passwords.",
  },
  {
    title: "Message it",
    body: "Type, or send a voice note, a photo or a file. Tex and its crew work in the background and reply in the same chat when it's done.",
  },
];

export const apps = {
  cards: [
    { icon: "gmail", name: "Gmail", actions: ["Read and search your email", "Draft replies for your OK", "Send email once you approve"] },
    { icon: "github", name: "GitHub", actions: ["Read pull requests and issues", "Review a pull request", "Open a pull request from a branch"] },
  ],
  categories: ["Email", "Dev", "Calendar", "Notes", "Tasks", "CRM", "Research"],
  total: "Gmail, GitHub, Google Calendar, Google Docs and more",
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
    result: "Patch reviews each one, posts a review on GitHub and sends a short verdict to your chat. It never merges or approves.",
    tag: "Code review",
    tone: { bg: "#FDF3E1", fg: "#8A5708" },
    icons: ["github", "telegram"],
    who: "patch",
  },
  {
    ask: "Fix the typo on the pricing page and open a PR.",
    result: "Byte makes the change on a new branch and opens a pull request for you to merge. It never touches your main branch.",
    tag: "Coding",
    tone: { bg: "#E8F7EE", fg: "#13803F" },
    icons: ["github"],
    who: "byte",
  },
  {
    ask: "Find out what competitors charge and summarise it.",
    result: "Scout searches the web, reads the pricing pages and hands Tex the findings. Reading a page is free.",
    tag: "Research",
    tone: { bg: "#E4F4F2", fg: "#0F6E66" },
    icons: ["telegram"],
    who: "scout",
  },
  {
    ask: "Reply to Maya that Thursday works.",
    result: "Finds her email, drafts the reply and sends it once you tap Approve. If you choose, it stops asking for that person.",
    tag: "Email",
    tone: { bg: "#EEF3FE", fg: "#1A56DB" },
    icons: ["gmail"],
  },
  {
    ask: "Every weekday at 9am, summarise my unread email.",
    result: "Reads your inbox on schedule and sends a short summary to your chat. Pause it any time.",
    tag: "Automation",
    tone: { bg: "#F1EDFF", fg: "#5B34D6" },
    icons: ["gmail", "telegram"],
  },
  {
    ask: "When an email from my manager arrives, tell me right away.",
    result: "Watches Gmail and messages you the moment that email lands.",
    tag: "Trigger",
    tone: { bg: "#FDEDEB", fg: "#B42318" },
    icons: ["gmail", "telegram"],
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
    example: "Every weekday at 9am, summarise my unread email.",
    detail: "Daily and weekly routines.",
  },
  {
    kind: "When something happens",
    example: "When an email from my manager arrives, tell me right away.",
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
    body: "Sending to other people, deleting, paying and merging wait for your Approve, in the chat or on Telegram. Delete, pay and merge always ask. For the rest you can tap \"Don't ask again\" yourself, and every skipped ask is kept as Auto-approved.",
  },
  {
    title: "Everything is logged",
    body: "The activity log shows every action Tex took, when it happened and how many credits it used. Approvals keep a record of what was approved and what ran on its own.",
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
    title: "One shared memory",
    body: "Tex keeps short notes about you: people, preferences, projects. Every chat shares them. See, fix or delete any of them in Settings.",
  },
  {
    title: "Your apps, plus your own tools",
    body: "Connect Gmail, GitHub, Google Calendar, Google Docs and more from Integrations. On Max you can plug in your own MCP servers too.",
  },
  {
    title: "Three ways to run the AI",
    body: "Textcrew AI, paid in credits; your own API key (Anthropic, OpenAI or OpenRouter); or your own Claude plan (beta). Bring your own AI and that part isn't charged in credits.",
  },
  {
    title: "Automations on a canvas",
    body: "Start from a template or describe it to Tex. Each automation is a short chain of up to 6 steps you can see, test and pause.",
  },
  {
    title: "A web app for the details",
    body: "Chat with unread dots, approvals, automations, apps, memory, credits and the full activity log in one place. Link Telegram and your chats there show up in the web app too.",
  },
  {
    title: "Credits you can see",
    body: "Each task shows what it cost. No surprise bills: at zero, Tex pauses and tells you. A task that fails on our side is refunded.",
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
  body: "The one you text, in the web chat or on Telegram. Tex handles small jobs itself, hands each bigger piece to the right specialist and puts the results together. You never pick a specialist: just ask.",
};

// The three specialists work inside the chat with Tex; there is no separate Crew page in the web app.
export const crew: CrewMember[] = [
  { id: "byte", name: "Byte", role: "Coding", body: "Writes and fixes code in your GitHub repos on a new branch, runs the tests and opens a pull request for you to merge. It never pushes to your main branch." },
  { id: "patch", name: "Patch", role: "Code review", body: "Reads a pull request, runs the tests and looks for bugs, security problems and missing tests. Posts one review on the PR and sends a short verdict to your chat. It never merges or approves." },
  { id: "scout", name: "Scout", role: "Research", body: "Searches the web, reads the pages and comes back with an answer and its links. On the Max plan it can also drive a real browser, for pages that need clicking." },
];

// Where Textcrew can be used. Desktop and mobile are in beta: shown as a label only, no download links.
export const places: { name: string; status: "Live" | "In beta"; body: string }[] = [
  { name: "Web app", status: "Live", body: "At app.textcrew.in. Works in your phone's browser too, and you can add it to your home screen." },
  { name: "Telegram", status: "Live", body: "Link your chat with a one-time code and text Tex like a friend." },
  { name: "Desktop app", status: "In beta", body: "Tex on your computer. Not open to everyone yet." },
  { name: "Mobile app", status: "In beta", body: "Tex as an app on your phone. Not open to everyone yet." },
];

export const roadmap = [
  {
    title: "More channels",
    body: "Telegram and the web app are the two today. Where the platforms allow it, iMessage as a beta and WhatsApp in regions where it is permitted may follow.",
  },
  {
    title: "Desktop app",
    body: "Let Tex work with files and apps on your own computer, and hand tasks to your own Claude Code.",
  },
  {
    title: "More apps",
    body: "The catalogue has 25 apps, and the full list is on the Integrations page in the web app. New ones are added over time.",
  },
  {
    title: "Teams and workspaces",
    body: "Shared agents for small companies, with roles and permissions.",
  },
];

export type Plan = {
  name: string;
  price: string;
  /** The regular price, shown crossed out beside the launch price with a "Launch price" tag (from 17 Oct 2026). It has never been charged. */
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
      "Sign-up credits last 14 days",
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
      "All 25 apps",
      "5 automations",
      "Top-ups: $10 for 800 credits",
      "Your own AI key, your Claude plan (beta) or Textcrew AI",
      "Unused credits carry over for 90 days",
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
      "All 25 apps, plus your own MCP servers",
      "50 automations",
      "Scout's web search: 1 credit per search",
      "Browser use: 2 credits per minute",
      "Top-ups: $10 for 800 credits",
      "Your own AI key, your Claude plan (beta) or Textcrew AI",
      "Unused credits carry over for 90 days",
    ],
  },
];

export const waitlistDeal = "Waitlist members get 50% off their first month of Pro or Max.";

export const paymentNote =
  "Prices are in US dollars. Depending on where you live, tax such as GST or VAT is added at checkout or already included. Payments are handled by Polar, our merchant of record. Plans renew every month until you cancel; cancel any time in the web app and you keep your plan until the end of the month you paid for.";

export const creditNotes = [
  { label: "1 credit ≈ 1 cent", body: "Credits pay for your agent's running time (1 credit per 5 minutes), actions that change something in your apps (1 credit each; reading and searching are free), browser time on Max (2 credits per minute) and Textcrew AI if you use it. Bring your own AI and that part isn't charged in credits." },
  { label: "Credits last 90 days", body: "Credits from your plan, a top-up or a code are good for 90 days from the day you get them. The 100 free credits at sign-up last 14 days. The oldest credits are used first." },
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
    a: "Everyone starts on the Free plan with 100 credits, good for 14 days. Waitlist members get 50% off their first month of Pro or Max, and beta invites can come with a code that adds extra free credits, so you can put Tex on real work before paying anything.",
  },
  {
    q: "What will it cost?",
    pricing: true,
    a: "Free is $0. Pro is $19 a month and Max is $30 a month. These are launch prices: the regular prices are $30 and $50 a month. If you join the waitlist, your first month of Pro or Max is half price: $9.50 or $15.",
  },
  {
    q: "Where can I use Textcrew?",
    a: "In the web app at app.textcrew.in, which also works in your phone's browser (you can add it to your home screen), and on Telegram. Both are live. A desktop app and a mobile app are in beta.",
  },
  {
    q: "Which chat apps does it work with?",
    a: "Telegram and the web app. Link Telegram with a one-time code and your Telegram chats also show up in the web app. WhatsApp and iMessage are not live yet; we will add channels where the platforms allow it.",
  },
  {
    q: "How many automations can I run?",
    pricing: true,
    a: "One on Free, five on Pro and 50 on Max. Each can have up to 6 steps. Start from a template, build it on the canvas in the web app, or just tell Tex, like \"every weekday at 9am, summarise my unread email\". You can also switch on pull-request review for a repo. Automations pause on their own if you run out of credits.",
  },
  {
    q: "Will it do things without asking me?",
    a: "Not the risky ones. Sending to other people, deleting, paying and changing what is already there wait for your Approve, in the chat or on Telegram. If you trust an action, tap \"Don't ask again\" on its card to make a skip rule, only for those people or for anyone. Delete, pay and merge always ask. Anything that ran on its own is kept under Auto-approved, and everything is logged.",
  },
  {
    q: "What can it connect to?",
    pricing: true,
    a: "Gmail, GitHub, Google Calendar, Google Docs and more. The full list is on the Integrations page in the web app (Apps). The catalogue has 25 apps: Free allows 10; Pro and Max allow all 25. On Max you can add your own MCP servers, and Scout can use a real browser.",
  },
  {
    q: "What is a credit?",
    pricing: true,
    a: "One credit is about one cent. Credits pay for Textcrew AI if you use it, your agent's running time (1 credit per 5 minutes), actions in your apps (1 credit per action that changes something, such as sending an email or creating an event; reading and searching are free) and, on the Max plan, browser time (2 credits per minute). If you bring your own AI, the AI part isn't charged in credits. Credits from a plan, a top-up or a code last 90 days, and the 100 free sign-up credits last 14 days. The activity log shows the credits used by every task.",
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
    q: "What is the crew?",
    a: "Tex is the one you text. For bigger jobs it hands pieces to Byte (writes code and opens a pull request), Patch (reviews pull requests) and Scout (searches the web), then puts the results together. There is no separate screen for them: you ask in the chat, in the web app or on Telegram.",
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
