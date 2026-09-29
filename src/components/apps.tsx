import { apps, useCases } from "@/lib/content";
import { AgentFigure } from "./agent";
import { BrandIcon } from "./brand-icon";
import { JobReceipt } from "./job-receipt";
import { Section } from "./section";

export function Apps() {
  return (
    <Section
      id="apps"
      eyebrow="Integrations"
      title="Run your apps from your chats."
      lede="One text can touch several apps. Tex does the work in each one and hands you a receipt: what it did, where, and what it cost."
    >
      <JobReceipt />

      <div className="mx-auto mt-14 flex max-w-5xl flex-col gap-6 rounded-2xl border border-line bg-surface-2/60 p-6 sm:p-7 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xl font-semibold tracking-[-0.02em]">{apps.total}.</p>
          <p className="mt-1 max-w-md text-[15px] text-muted">
            Across email, calendar, notes, tasks, CRM, dev and research. On Max, plug in your own MCP servers too.
          </p>
        </div>
        <ul className="flex flex-wrap gap-2">
          {apps.categories.map((c) => (
            <li key={c} className="rounded-full border border-line bg-surface px-3 py-1.5 text-[13px] font-medium">
              {c}
            </li>
          ))}
          <li className="rounded-full border border-dashed border-fg/30 bg-surface px-3 py-1.5 text-[13px] font-medium">
            + Your own MCP servers
          </li>
        </ul>
      </div>
    </Section>
  );
}

export function UseCases() {
  return (
    <Section
      id="use-cases"
      eyebrow="Popular use cases"
      title="Delegate the busywork."
      lede="Real requests, the way you'd actually type them. Or send a voice note."
    >
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {useCases.map((u) => (
          <li key={u.ask} className="flex flex-col overflow-hidden rounded-3xl border border-line bg-surface shadow-soft">
            <div className="flex flex-1 flex-col gap-5 p-6" style={{ background: u.tone.bg }}>
              <div className="flex items-center justify-between">
                <span
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/85 px-2.5 py-1 text-[12px] font-semibold"
                  style={{ color: u.tone.fg }}
                >
                  <span aria-hidden className="size-1.5 rounded-full" style={{ background: u.tone.fg }} />
                  {u.tag}
                </span>
                <span className="flex -space-x-2">
                  {u.icons.map((i) => (
                    <span key={i} className="grid size-8 place-items-center rounded-full bg-white shadow-soft ring-2" style={{ ["--tw-ring-color" as string]: u.tone.bg }}>
                      <BrandIcon name={i} size={15} />
                    </span>
                  ))}
                </span>
              </div>
              <p className="ml-auto max-w-[92%] rounded-2xl rounded-br-md bg-white px-4 py-2.5 text-[15px] leading-snug text-fg shadow-soft">
                {u.ask}
              </p>
            </div>
            <div className="flex gap-3 border-t border-line px-6 py-5">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-accent-soft">
                <AgentFigure who="tex" glyph size={24} label="Tex" />
              </span>
              <p className="text-[14.5px] leading-relaxed text-muted">{u.result}</p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
