import { apps, useCases } from "@/lib/content";
import { BrandIcon } from "./brand-icon";
import { Section } from "./section";

export function Apps() {
  return (
    <Section
      id="apps"
      eyebrow="Integrations"
      title="Run your apps from your chats."
      lede="Connect each app once through its own sign-in screen. Tex takes action in them, no app switching, no copy and paste."
    >
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {apps.cards.map((a) => (
          <li key={a.name} className="rounded-2xl border border-line bg-surface p-5 shadow-soft">
            <div className="flex items-center gap-3">
              <BrandIcon name={a.icon} tile size={16} />
              <span className="font-semibold">{a.name}</span>
            </div>
            <ul className="mt-4 flex flex-col gap-2 text-[14px] text-muted">
              {a.actions.map((x) => (
                <li key={x} className="flex items-center gap-2">
                  <span aria-hidden className="size-1 rounded-full bg-muted/60" />
                  {x}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex flex-col gap-6 rounded-2xl border border-line bg-surface-2/60 p-6 sm:p-7 lg:flex-row lg:items-center lg:justify-between">
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
      className="bg-surface-2/50"
    >
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {useCases.map((u) => (
          <li key={u.ask} className="flex flex-col rounded-2xl border border-line bg-surface p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-muted">{u.tag}</span>
              <span className="flex -space-x-1.5">
                {u.icons.map((i) => (
                  <span key={i} className="grid size-7 place-items-center rounded-full border border-line bg-surface">
                    <BrandIcon name={i} size={14} />
                  </span>
                ))}
              </span>
            </div>
            <p className="mt-4 w-fit rounded-2xl rounded-br-md bg-fg px-3.5 py-2 text-[14px] leading-snug text-white">{u.ask}</p>
            <p className="mt-4 text-[15px] leading-relaxed text-muted">{u.result}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
