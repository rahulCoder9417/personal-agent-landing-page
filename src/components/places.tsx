import { places } from "@/lib/content";
import { Section } from "./section";

export function Places() {
  return (
    <Section id="where" eyebrow="Where" title="Use it where you already are." lede="Start in the web app or on Telegram today. Desktop and mobile apps are in beta.">
      <ul className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {places.map((p) => (
          <li key={p.name} className="flex flex-col rounded-3xl border border-line bg-surface p-5 shadow-soft">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-lg font-semibold tracking-[-0.02em]">{p.name}</h3>
              <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${p.status === "Live" ? "bg-[#E7F6EC] text-[#14713D]" : "bg-surface-2 text-muted"}`}>{p.status}</span>
            </div>
            <p className="mt-2 text-[14px] leading-relaxed text-muted">{p.body}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
