import { Section } from "./section";

const options = [
  { name: "Your Claude plan", tag: "beta", body: "Use the Claude plan you already pay for. The AI runs on your own account." },
  { name: "Your API key", tag: null, body: "Anthropic, OpenAI or OpenRouter. Your key is encrypted and never shown in full." },
  { name: "Textcrew AI", tag: null, body: "Don't have either? Use ours, paid in credits." },
];

export function BringYourOwn() {
  return (
    <Section
      id="bring-your-own"
      eyebrow="Bring your own AI"
      title="Don't pay for the AI twice."
      lede="Most AI agents charge you for their AI on top of everything else. Textcrew lets you bring the Claude plan or API key you already have."
      className="bg-surface-2/50"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-line bg-surface p-6 shadow-soft">
          <p className="text-[13px] font-medium uppercase tracking-wide text-muted">Other AI agents</p>
          <p className="mt-3 text-lg font-semibold tracking-[-0.01em]">You pay for their AI inside their price.</p>
          <p className="mt-2 text-[14px] leading-relaxed text-muted">The AI is bundled in, so you pay for it again even if you already have your own.</p>
        </div>
        <div className="rounded-2xl border border-accent/30 bg-accent-soft p-6 shadow-soft">
          <p className="text-[13px] font-medium uppercase tracking-wide text-accent">Textcrew</p>
          <p className="mt-3 text-lg font-semibold tracking-[-0.01em]">Connect the Claude plan or key you already have.</p>
          <p className="mt-2 text-[14px] leading-relaxed text-muted">You pay only for your agent&apos;s time, not the AI twice. Credits cover running time (1 credit per 5 minutes) and app actions that change something.</p>
        </div>
      </div>
      <ul className="mt-4 grid gap-4 sm:grid-cols-3">
        {options.map((o) => (
          <li key={o.name} className="rounded-2xl border border-line bg-surface p-5 shadow-soft">
            <h3 className="flex items-center gap-2 font-semibold tracking-[-0.01em]">
              {o.name}
              {o.tag && <span className="rounded-full border border-line bg-surface-2 px-2 py-0.5 text-[11px] font-medium text-muted">{o.tag}</span>}
            </h3>
            <p className="mt-1.5 text-[14px] leading-relaxed text-muted">{o.body}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
