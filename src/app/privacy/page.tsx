import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { Logo } from "@/components/logo";
import { Container } from "@/components/section";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How Textcrew handles your data: a private agent workspace, no passwords, approvals before acting, and deletion anytime.",
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
    body: "Deleting your account removes your agent workspace, memory, messages, connected apps and backups. Backups are fully cleared within 30 days.",
  },
  {
    title: "Minimal data",
    body: "We keep what's needed to run the service: account details, linked chat ids, message history (to show in the app), approvals, automations, credits and the activity log.",
  },
  {
    title: "Where your messages go",
    body: "A message you send passes through the chat app you use (for example WhatsApp or Telegram), our servers, and the AI model provider that processes it. Voice notes and files are processed only to handle your request.",
  },
];

const waitlistData = [
  "Your email address and, if you pick one, the chat app you'd use",
  "Your IP address, and your approximate location worked out from it (country, region, city)",
  "Browser details: user agent, language, time zone and screen size",
  "How you found us: the referring page, the page you signed up on and any campaign tags in its link",
  "When you joined, and how many times you've signed up",
];

const retention = [
  ["Beta waitlist signups", "Until you ask us to remove them"],
  ["Messages, approvals, automations, activity log", "Until you delete them or your account"],
  ["Raw incoming events (technical)", "30 days"],
  ["Backups", "14 days rolling; deleted accounts are cleared within 30 days"],
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

          <section id="waitlist" className="mt-14 scroll-mt-24">
            <h2 className="text-2xl font-extrabold tracking-[-0.03em]">When you join the beta waitlist</h2>
            <p className="mt-2 leading-relaxed text-muted">
              We store the following so we can send beta invites, stop spam and fake signups, and understand where interest
              comes from. We don&apos;t sell it. To be removed, reply to any email from us.
            </p>
            <ul className="mt-5 flex list-disc flex-col gap-2 pl-5 leading-relaxed text-muted">
              {waitlistData.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
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
