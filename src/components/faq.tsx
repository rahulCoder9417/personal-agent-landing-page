import { faqs } from "@/lib/content";
import { Section } from "./section";

// The home page shows every question; /pricing passes only the ones about plans and credits.
export function Faq({
  items = faqs,
  id = "faq",
  title = "Questions, answered.",
  className,
}: {
  items?: readonly { q: string; a: string }[];
  id?: string;
  title?: string;
  className?: string;
}) {
  return (
    <Section id={id} eyebrow="FAQ" title={title} className={className}>
      <div className="mx-auto max-w-3xl divide-y divide-line rounded-3xl border border-line bg-surface px-6 shadow-soft sm:px-8">
        {items.map((f) => (
          <details key={f.q} className="group py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-semibold tracking-[-0.01em] [&::-webkit-details-marker]:hidden">
              {f.q}
              <span aria-hidden className="grid size-6 shrink-0 place-items-center rounded-full bg-surface-2 text-sm text-muted transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">{f.a}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}
