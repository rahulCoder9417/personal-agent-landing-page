import { AgentFigure } from "./agent";
import { BrandIcon, type BrandName } from "./brand-icon";
import { PerchedTex } from "./perched-tex";
import { Container } from "./section";

type Status = "done" | "waiting" | "scheduled";

const activity: { icon: BrandName; title: string; meta: string; status: Status }[] = [
  { icon: "calendar", title: "Moved “Roadmap sync” to tomorrow, 3:00 PM", meta: "Google Calendar · 2 credits", status: "done" },
  { icon: "gmail", title: "Email to Priya about the new time", meta: "Gmail · waiting for your OK", status: "waiting" },
  { icon: "notion", title: "Filed notes from your voice note", meta: "Notion · 3 credits", status: "done" },
  { icon: "telegram", title: "Every Monday 9:00, send me my week", meta: "Automation · next run Monday", status: "scheduled" },
  { icon: "slack", title: "Posted today’s update in #team", meta: "Slack · 1 credit", status: "done" },
];

const STATUS: Record<Status, { label: string; cls: string }> = {
  done: { label: "Done", cls: "bg-[#E7F6EC] text-[#14713D]" },
  waiting: { label: "Needs OK", cls: "bg-accent-soft text-accent" },
  scheduled: { label: "Scheduled", cls: "bg-surface-2 text-muted" },
};

function Bubble({ from, children }: { from: "you" | "tex"; children: React.ReactNode }) {
  return from === "you" ? (
    <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-fg px-3.5 py-2 text-[14px] leading-snug text-white">{children}</div>
  ) : (
    <div className="max-w-[88%] rounded-2xl rounded-bl-md border border-line bg-surface px-3.5 py-2 text-[14px] leading-snug">{children}</div>
  );
}

export function ProductShowcase() {
  return (
    <Container className="relative mt-[18rem] pb-20 sm:mt-[20rem] sm:pb-28">
      <div className="relative mx-auto max-w-5xl">
        <PerchedTex />
        <figure
          aria-label="Example: Tex handling a request in WhatsApp, with its activity feed"
          className="relative grid overflow-hidden rounded-[22px] border border-line bg-surface text-left shadow-window md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]"
        >
          <div className="flex flex-col border-b border-line bg-[#F7F6F2] md:border-r md:border-b-0">
            <div className="flex items-center gap-3 border-b border-line bg-surface px-5 py-3">
              <span className="grid size-9 place-items-center rounded-full bg-accent-soft">
                <AgentFigure who="tex" glyph size={28} label="Tex" />
              </span>
              <div className="leading-tight">
                <p className="text-sm font-semibold">Tex</p>
                <p className="flex items-center gap-1.5 font-mono text-[11px] text-muted">
                  <span className="size-1.5 rounded-full bg-[#22A45D]" />
                  online
                </p>
              </div>
              <BrandIcon name="whatsapp" size={18} className="ml-auto" />
            </div>
            <div className="flex flex-1 flex-col gap-2 p-5">
              <Bubble from="you">Move my 3pm with Priya to tomorrow and let her know</Bubble>
              <Bubble from="tex">On it. Your 3pm is “Roadmap sync”. Moving it to tomorrow, same time.</Bubble>
              <div className="max-w-[92%] rounded-2xl rounded-bl-md border border-fg/80 bg-surface p-3.5">
                <p className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.06em] text-muted">
                  <span aria-hidden className="h-3 w-1 bg-accent" />
                  NEEDS YOUR OK
                </p>
                <p className="mt-1.5 text-[14px] font-semibold">Send this email to Priya?</p>
                <p className="mt-1.5 rounded-lg bg-surface-2 px-3 py-2 text-[13px] leading-relaxed text-muted">
                  Hi Priya, could we move today&apos;s 3pm to tomorrow, same time? Thanks!
                </p>
                <div aria-hidden className="mt-2.5 grid grid-cols-2 gap-2 text-center text-[13px] font-medium">
                  <span className="rounded-full border border-line py-1.5">Reject</span>
                  <span className="rounded-full bg-fg py-1.5 text-white">Approve</span>
                </div>
              </div>
              <Bubble from="tex">Done. Moved to tomorrow at 3pm and Priya has the note.</Bubble>
            </div>
            <div aria-hidden className="mx-4 mb-4 flex items-center rounded-full border border-line bg-surface px-4 py-2.5 text-[13px] text-muted">
              Message Tex…
              <svg viewBox="0 0 24 24" className="ml-auto size-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                <rect x="9" y="3" width="6" height="11" rx="3" />
                <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
              </svg>
            </div>
          </div>

          <div className="flex flex-col">
            <div aria-hidden className="flex items-center gap-1 border-b border-line px-4 py-2.5 text-[13px]">
              <span className="rounded-full bg-surface-2 px-3 py-1 font-medium">Activity</span>
              <span className="flex items-center gap-1.5 px-3 py-1 text-muted">
                Approvals <span className="grid size-4 place-items-center rounded-full bg-accent text-[10px] text-white">1</span>
              </span>
              <span className="px-3 py-1 text-muted">Automations</span>
            </div>
            <ul className="divide-y divide-line">
              {activity.map((a) => (
                <li key={a.title} className="flex items-center gap-3 px-5 py-3.5">
                  <BrandIcon name={a.icon} tile size={14} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-medium">{a.title}</p>
                    <p className="truncate font-mono text-[11px] text-muted">{a.meta}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${STATUS[a.status].cls}`}>
                    {STATUS[a.status].label}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-auto flex items-center justify-between border-t border-line px-5 py-3 font-mono text-[11px] text-muted">
              <span>Every action is logged</span>
              <span>credits shown per task</span>
            </div>
          </div>
        </figure>
      </div>
    </Container>
  );
}
