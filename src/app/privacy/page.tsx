import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { Logo } from "@/components/logo";
import { Container } from "@/components/section";

const description = "How Textcrew handles your data: a private agent workspace, no passwords, approvals before acting, and deletion anytime.";

export const metadata: Metadata = {
  title: "Privacy",
  description,
  alternates: { canonical: "/privacy" },
  // Setting openGraph here replaces the root one, so the shared social image is listed again.
  openGraph: { type: "article", title: "Privacy at Textcrew", description, url: "/privacy", images: [{ url: "/opengraph-image", width: 1200, height: 630 }] },
};

const promises = [
  {
    title: "Your agent is yours alone",
    body: "Every user gets a private, isolated agent workspace. Your agent's memory, files and notes live only there, never mixed with anyone else's.",
  },
  {
    title: "We never see your app passwords",
    body: "Connecting Gmail, Calendar and other apps uses each app's own sign-in screen. Access tokens are held by our integration provider (Composio), not stored by us, and never given to the agent.",
  },
  {
    title: "You approve before it acts on others",
    body: "Sending to other people, deleting things or spending money always needs your OK.",
  },
  {
    title: "Everything is logged for you",
    body: "The activity log shows every action the agent took, when, and what it cost.",
  },
  {
    title: "Your data isn't used to train AI models",
    body: "We use AI providers' APIs, which don't train on API data. If you bring your own API key, your provider's terms apply.",
  },
  {
    title: "Delete anytime",
    body: "Deleting your account removes your agent workspace, memory, messages, files, activity log and connected apps, and the backup copies of your workspace files. Database backups are kept for 7 days, so the rest of your data is gone from them within 7 days. We keep only billing records (payments, credits and coupons used) and an account record with your name and email removed.",
  },
  {
    title: "Minimal data",
    body: "We keep what's needed to run the service: account details, linked chat ids, message history (to show in the app), approvals, automations, credits and the activity log.",
  },
  {
    title: "Where your messages go",
    body: "A message you send passes through the chat app you use (for example Telegram), our servers, and the AI model provider that processes it. Voice notes and files are processed only to handle your request.",
  },
];

const waitlistData = [
  "Your email address and, if you pick one, the chat app you'd use",
  "Your IP address, and your approximate location worked out from it (country, region, city)",
  "Browser details: user agent, language, time zone and screen size",
  "How you found us: the referring page, the page you signed up on and any campaign tags in its link",
  "When you joined, and how many times you've signed up",
  "Whether and when you confirmed your email, and the IP address you confirmed from",
];

// Google's "Limited Use" disclosure needs a link to this policy, next to the required sentence.
const googlePolicyUrl = "https://developers.google.com/terms/api-services-user-data-policy";

// Same wording as each app's line on the web app's connect screen (backend catalog).
const googleApps = [
  ["Gmail", "your email, to read and search it, write drafts, and send email for you"],
  ["Google Calendar", "your events, to see what's on, find free time, and add or change events"],
  ["Google Drive", "your files, to find and read them, and add or organize files"],
  ["Google Docs", "your documents, to read them, and write new ones or edit them"],
  ["Google Sheets", "your spreadsheets, to read them, and add or update rows"],
];

const googleDataPath = [
  "Composio, our integration provider, which holds the access token Google gives when you connect, and fetches the data for us",
  "Our servers, and your private agent workspace",
  "The AI model that works on your request: Textcrew AI's provider, or your own provider if you use your own API key or Claude plan",
  "The chat app you use (for example Telegram), when a reply includes it",
];

const googleRules = [
  {
    title: "Not used to train AI.",
    body: "Textcrew never uses your Google data to develop, improve or train AI models. Textcrew AI runs on AI providers' APIs, which don't train on API data. If you use your own API key or Claude plan, that provider handles your requests under your own account and its terms.",
  },
  {
    title: "No one reads it.",
    body: "No person at Textcrew reads your Google data, except when you ask us to for specific items (for example, to look into a problem you reported), when it's needed for security (such as investigating abuse), or when the law requires it.",
  },
  {
    title: "Not sold or passed on.",
    body: "We never sell it. We pass it only to the services listed above, to do what you asked, or to others when the law requires it.",
  },
  {
    title: "Not used for ads.",
    body: "We never use it for advertising of any kind.",
  },
];

const retention = [
  ["Beta waitlist signups", "Until you ask us to remove them"],
  ["Messages", "1 year, or until you delete them or your account"],
  ["Approvals, automations, activity log", "Until you delete them or your account"],
  ["Access to your connected apps (held by Composio)", "Until you disconnect the app or delete your account"],
  ["Raw incoming events (technical), including ones that failed", "30 days"],
  ["Backups", "7 days. When you delete your account, the backup copies of your workspace files are deleted at once, and the rest of your data is gone from the database backups within 7 days"],
  ["Billing records", "As long as the law requires"],
];

export default function PrivacyPage() {
  return (
    <>
      <header className="border-b border-line">
        <Container className="flex h-16 items-center">
          <Link href="/" aria-label="Textcrew home" className="rounded-lg">
            <Logo />
          </Link>
        </Container>
      </header>
      <main className="flex-1 py-16 sm:py-24">
        <Container className="max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.08em] text-muted">Draft · Private beta</p>
          <h1 className="mt-3 text-[clamp(2.25rem,5vw,3.5rem)] font-extrabold leading-[1.02] tracking-[-0.045em]">Privacy at Textcrew</h1>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            This is a plain-language summary of what we promise. The full privacy policy will be published before launch.
          </p>

          <div className="mt-12 flex flex-col gap-8">
            {promises.map((p) => (
              <section key={p.title} className="border-t border-line pt-6">
                <h2 className="text-xl font-bold tracking-[-0.02em]">{p.title}</h2>
                <p className="mt-2 leading-relaxed text-muted">{p.body}</p>
              </section>
            ))}
          </div>

          <section id="google-data" className="mt-14 scroll-mt-24">
            <h2 className="text-2xl font-extrabold tracking-[-0.03em]">Data from your Google apps</h2>
            <p className="mt-2 leading-relaxed text-muted">
              You can connect Gmail, Google Calendar, Google Drive, Google Docs and Google Sheets, each one separately. This part
              covers the data Textcrew gets from them through Google&apos;s APIs.
            </p>
            <p className="mt-5 rounded-2xl border border-line bg-surface p-5 leading-relaxed">
              Textcrew&apos;s use and transfer to any other app of information received from Google APIs will adhere to the{" "}
              <a href={googlePolicyUrl} className="font-medium text-accent hover:underline">
                Google API Services User Data Policy
              </a>
              , including the Limited Use requirements.
            </p>

            <h3 className="mt-8 text-lg font-bold tracking-[-0.02em]">What we read</h3>
            <p className="mt-2 leading-relaxed text-muted">
              Only data from the Google apps you connect. You sign in on Google&apos;s own page and agree there to what you
              allow. Nothing is read from an app you haven&apos;t connected.
            </p>
            <ul className="mt-4 flex list-disc flex-col gap-2 pl-5 leading-relaxed text-muted">
              {googleApps.map(([app, what]) => (
                <li key={app}>
                  <span className="font-medium text-fg">{app}</span>: {what}
                </li>
              ))}
            </ul>

            <h3 className="mt-8 text-lg font-bold tracking-[-0.02em]">What it&apos;s used for</h3>
            <p className="mt-2 leading-relaxed text-muted">
              Only to do what you ask your agent to do: answer a question, carry out a task, or run an automation you set up.
              For example, &ldquo;What&apos;s on my calendar tomorrow?&rdquo; reads tomorrow&apos;s events so Tex can answer.
              Sending to other people, deleting things or spending money always waits for your Approve.
            </p>

            <h3 className="mt-8 text-lg font-bold tracking-[-0.02em]">Where it goes</h3>
            <p className="mt-2 leading-relaxed text-muted">To do the task, data from your Google apps passes through:</p>
            <ul className="mt-4 flex list-disc flex-col gap-2 pl-5 leading-relaxed text-muted">
              {googleDataPath.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
            <p className="mt-4 leading-relaxed text-muted">
              Some of it stays where you can see it later: in your chat history, in your agent&apos;s memory if it saves a
              short note about you, and in the activity log, which lists each action with its details.
            </p>

            <h3 className="mt-8 text-lg font-bold tracking-[-0.02em]">Our rules for Google data</h3>
            <ul className="mt-4 flex list-disc flex-col gap-3 pl-5 leading-relaxed text-muted">
              {googleRules.map((r) => (
                <li key={r.title}>
                  <span className="font-semibold text-fg">{r.title}</span> {r.body}
                </li>
              ))}
            </ul>

            <h3 className="mt-8 text-lg font-bold tracking-[-0.02em]">Disconnect and delete</h3>
            <ul className="mt-4 flex list-disc flex-col gap-3 pl-5 leading-relaxed text-muted">
              <li>
                <span className="font-semibold text-fg">Disconnect an app.</span> In the web app, open Apps and press
                Disconnect on it. Composio deletes its access token for that account, and your agent can no longer read from
                it.
              </li>
              <li>
                <span className="font-semibold text-fg">Remove access at Google.</span> You can also remove it in your Google
                Account, at{" "}
                <a href="https://myaccount.google.com/connections" className="font-medium text-accent hover:underline">
                  myaccount.google.com/connections
                </a>
                . It&apos;s listed under Textcrew, or under Composio if you connected through our integration provider&apos;s
                shared Google sign-in.
              </li>
              <li>
                <span className="font-semibold text-fg">Delete what was kept.</span> Delete a conversation to remove its
                messages and files. Delete your agent&apos;s memories in Settings, under Memory.
              </li>
              <li>
                <span className="font-semibold text-fg">Delete your account.</span> In Settings, press &ldquo;Delete my
                account and data&rdquo;. It removes your agent workspace, memory, messages, files and connected apps,
                including their access tokens at Composio, and the backup copies of your workspace files. The rest of your
                data is gone from our database backups within 7 days.
              </li>
            </ul>
          </section>

          <section id="waitlist" className="mt-14 scroll-mt-24">
            <h2 className="text-2xl font-extrabold tracking-[-0.03em]">When you join the beta waitlist</h2>
            <p className="mt-2 leading-relaxed text-muted">
              We store the following so we can send beta invites, stop spam and fake signups, and understand where interest
              comes from. You&apos;re only on the list once you confirm your email from the link we send. We don&apos;t sell
              any of it, and we&apos;ll delete it whenever you ask.
            </p>
            <ul className="mt-5 flex list-disc flex-col gap-2 pl-5 leading-relaxed text-muted">
              {waitlistData.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </section>

          <section id="analytics" className="mt-14 scroll-mt-24">
            <h2 className="text-2xl font-extrabold tracking-[-0.03em]">When you visit the site</h2>
            <p className="mt-2 leading-relaxed text-muted">
              We use Vercel Web Analytics to count visits: which pages are viewed, the site that sent you here, and your country
              and device type. It sets no cookies and doesn&apos;t build a profile of you or follow you to other sites.
            </p>
          </section>

          <section className="mt-14">
            <h2 className="text-2xl font-extrabold tracking-[-0.03em]">How long we keep things</h2>
            <p className="mt-2 text-muted">Proposed retention, to be finalised in the full policy.</p>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[480px] border-collapse text-left text-[15px]">
                <thead>
                  <tr className="border-b border-line">
                    <th scope="col" className="py-3 pr-6 font-semibold">Data</th>
                    <th scope="col" className="py-3 font-semibold">Kept</th>
                  </tr>
                </thead>
                <tbody>
                  {retention.map(([data, kept]) => (
                    <tr key={data} className="border-b border-line">
                      <td className="py-3 pr-6">{data}</td>
                      <td className="py-3 text-muted">{kept}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </Container>
      </main>
      <Footer />
    </>
  );
}
