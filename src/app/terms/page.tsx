import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { Logo } from "@/components/logo";
import { Container } from "@/components/section";

const description = "The terms for using Textcrew in its private beta: accounts, acceptable use, your data, credits and payments.";

export const metadata: Metadata = {
  title: "Terms",
  description,
  alternates: { canonical: "/terms" },
  // Setting openGraph here replaces the root one, so the shared social image is listed again.
  openGraph: { type: "article", title: "Textcrew terms of service", description, url: "/terms", images: [{ url: "/opengraph-image", width: 1200, height: 630 }] },
};

// Text still to be decided by the founder. It shows highlighted on the page, so a missing one can't go unnoticed.
function Placeholder({ children }: { children: ReactNode }) {
  return <mark className="rounded bg-patch/25 px-1 text-fg">[PLACEHOLDER: {children}]</mark>;
}

const contactEmail = <Placeholder>contact email</Placeholder>;

function Clause({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-line pt-6">
      <h2 className="text-xl font-bold tracking-[-0.02em]">{title}</h2>
      <div className="mt-2 flex flex-col gap-3 leading-relaxed text-muted">{children}</div>
    </section>
  );
}

function List({ children }: { children: ReactNode }) {
  return <ul className="flex list-disc flex-col gap-2 pl-5">{children}</ul>;
}

const linkClass = "font-medium text-accent hover:underline";

export default function TermsPage() {
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
          <h1 className="mt-3 text-[clamp(2.25rem,5vw,3.5rem)] font-extrabold leading-[1.02] tracking-[-0.045em]">Terms of service</h1>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            These terms are the agreement between you and Textcrew when you use Textcrew: the web app, the Telegram bot and
            this website. They&apos;re short and in plain words. By creating an account or using Textcrew, you agree to them.
          </p>
          <p className="mt-3 text-sm text-muted">Last updated 15 October 2026.</p>

          <div className="mt-12 flex flex-col gap-8">
            <Clause id="who" title="Who we are">
              <p>
                Textcrew is a personal AI agent you text from Telegram or the web app. It&apos;s run by{" "}
                <Placeholder>operator&apos;s legal name</Placeholder>, <Placeholder>postal address</Placeholder>
                {" "}(&ldquo;Textcrew&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;). You can reach us at {contactEmail}.
              </p>
            </Clause>

            <Clause id="beta" title="Textcrew is in beta">
              <p>Textcrew is in private beta, and we&apos;re letting people in in small batches. During the beta:</p>
              <List>
                <li>features can change, break or be removed, and the service can be slow or unavailable at times;</li>
                <li>some options are labelled beta, such as running the AI on your own Claude plan;</li>
                <li>we may limit sign-ups, or end the beta, telling you first where we can.</li>
              </List>
              <p>Don&apos;t rely on Textcrew as the only copy of anything important.</p>
            </Clause>

            <Clause id="account" title="Your account">
              <List>
                <li>You need to be at least 18 to use Textcrew.</li>
                <li>
                  Give true details when you sign up, and keep your sign-in safe. You&apos;re responsible for what&apos;s done
                  through your account, including what your agent does on your instructions.
                </li>
                <li>An account is for one person. Don&apos;t share it, and don&apos;t make extra accounts to collect free credits.</li>
                <li>Link only Telegram chats you control: messages from a linked chat go to your agent.</li>
              </List>
            </Clause>

            <Clause id="acceptable-use" title="Acceptable use">
              <p>Don&apos;t use Textcrew, or ask your agent, to:</p>
              <List>
                <li>break the law, or anyone else&apos;s rights, including their privacy and copyright;</li>
                <li>send spam, scams or harassment, or pretend to be someone else;</li>
                <li>get into accounts, apps or data you&apos;re not allowed to use;</li>
                <li>
                  attack, probe or overload Textcrew or anyone else&apos;s systems, or get around our limits, sandbox or safety
                  checks;
                </li>
                <li>make malware, or anything else meant to cause harm;</li>
                <li>break the rules of the apps you connect (such as Google, Telegram or GitHub) or of the AI provider you use.</li>
              </List>
              <p>
                We may pause or close an account that breaks these rules (see{" "}
                <a href="#termination" className={linkClass}>
                  Ending your account
                </a>
                ).
              </p>
            </Clause>

            <Clause id="your-data" title="Your data and connected apps">
              <p>
                You keep ownership of what you send to Textcrew and of what your agent makes for you. You let us store and
                process it only to run Textcrew for you.
              </p>
              <p>
                When you connect an app such as Gmail, Google Calendar or GitHub, you sign in on that app&apos;s own page and
                allow your agent to act there for you. Actions that send to other people, delete things or spend money wait
                for your Approve, unless you&apos;ve given a standing OK, such as turning on pull-request review for a repo.
                You&apos;re responsible for what you approve. You can disconnect an app or delete your account at any time.
              </p>
              <p>
                The{" "}
                <Link href="/privacy" className={linkClass}>
                  Privacy page
                </Link>{" "}
                says what we keep, for how long, and how we handle data from your Google apps.
              </p>
            </Clause>

            <Clause id="other-services" title="Other companies' services">
              <p>
                Textcrew works with other companies&apos; services: Telegram, the apps you connect (such as Google and
                GitHub), Composio (which connects them), Clerk (sign-in), Polar (payments), our hosting providers, and AI
                providers, including your own if you bring an API key or a Claude plan. Their own terms apply to your use of
                them. We&apos;re not responsible for their services, or for them being down or changing.
              </p>
            </Clause>

            <Clause id="payments" title="Credits and payments">
              <List>
                <li>
                  Textcrew runs on credits. One credit is about one cent. Credits pay for your agent&apos;s running time,
                  actions that change something in your apps, Textcrew AI if you use it, and browser time on Max. The current
                  plans, prices and credit costs are in the{" "}
                  <Link href="/#pricing" className={linkClass}>
                    pricing section
                  </Link>
                  .
                </li>
                <li>
                  Paid plans and top-ups are sold through Polar, our payment provider, so we never see your card details.
                  Prices are in US dollars. Depending on where you live, tax such as GST or VAT may be added at checkout.
                </li>
                <li>
                  Plans renew every month until you cancel. Cancel in the web app, in Settings, under Plans: you keep your
                  plan until the end of the period you paid for, then move to Free.
                </li>
                <li>
                  Each credit lasts 90 days from the day you get it, whether it came from a plan, a top-up or a code. The
                  oldest are used first, and unused credits expire. Credits have no cash value and can&apos;t be moved to
                  another account.
                </li>
                <li>
                  At zero credits your agent pauses and tells you, and automations pause too. A task that was already running
                  can take you a little below zero; that is paid from your next credits. Your card is never charged for it.
                </li>
                <li>If a task fails because of an error on our side, you&apos;re told, and its credits are given back automatically.</li>
                <li>We can end a promotion or coupon code at any time. Free credits obtained by misusing a code can be taken back.</li>
                <li>
                  Refunds: <Placeholder>refund policy; the site doesn&apos;t state one yet</Placeholder>. When a payment is
                  refunded, the credits it bought are taken back, in proportion for a partial refund.
                </li>
              </List>
            </Clause>

            <Clause id="ai-output" title="AI can be wrong">
              <p>
                Textcrew&apos;s agents use AI models, and AI makes mistakes. An answer can be wrong, incomplete or out of
                date, and your agent can misunderstand what you meant.
              </p>
              <List>
                <li>Check anything important before you rely on it, and read an approval before you tap Approve.</li>
                <li>
                  Code from Byte arrives as a pull request for you to review, and reviews from Patch can miss problems. You
                  decide what to merge.
                </li>
                <li>Nothing Textcrew says is legal, medical, financial or other professional advice.</li>
              </List>
            </Clause>

            <Clause id="liability" title="Limitation of liability">
              <p>
                Textcrew is provided as it is and as available, especially during the beta. We don&apos;t promise that it will
                always work, be free of errors, or suit your purpose.
              </p>
              <p>As far as the law allows:</p>
              <List>
                <li>we&apos;re not liable for indirect or consequential losses, such as lost profits, lost business, or lost or damaged data;</li>
                <li>we&apos;re not liable for actions you instructed or approved, or for other companies&apos; services;</li>
                <li>our total liability to you for all claims is limited to what you paid us in the 12 months before the claim.</li>
              </List>
              <p>
                Nothing in these terms limits a liability that the law doesn&apos;t allow us to limit, or takes away rights you
                have as a consumer.
              </p>
            </Clause>

            <Clause id="termination" title="Ending your account">
              <p>
                You can stop at any time. Delete your account in the web app, in Settings, with &ldquo;Delete my account and
                data&rdquo;. That also stops your plan from renewing, and unused credits are lost. The{" "}
                <Link href="/privacy" className={linkClass}>
                  Privacy page
                </Link>{" "}
                says what is removed and when.
              </p>
              <p>
                We may suspend or close your account if you break these terms, if your use puts other people or Textcrew at
                risk, or if the law requires it. Where we reasonably can, we&apos;ll tell you first and say why. If we close
                Textcrew altogether, we&apos;ll tell you in advance.
              </p>
            </Clause>

            <Clause id="changes" title="Changes to these terms">
              <p>
                We may update these terms, for example when we add features or leave the beta. The new version goes on this
                page with a new date. For a significant change we&apos;ll tell you in advance, in the app or by email. If you
                keep using Textcrew after a change takes effect, the new terms apply. If you don&apos;t agree, you can delete
                your account.
              </p>
            </Clause>

            <Clause id="law" title="Governing law">
              <p>
                These terms are governed by the laws of <Placeholder>country, and state if needed</Placeholder>. Disputes go
                to the courts of <Placeholder>city</Placeholder>. If you use Textcrew as a consumer, you keep any protections
                the law where you live gives you.
              </p>
            </Clause>

            <Clause id="contact" title="Contact">
              <p>Questions about these terms, your account or a payment: {contactEmail}.</p>
            </Clause>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
