import { Logo } from "./logo";
import { Container } from "./section";

const links = [
  { href: "#how", label: "How it works" },
  { href: "#apps", label: "Apps" },
  { href: "#crew", label: "The crew" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-bg/80 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-6">
        <a href="#top" aria-label="Textcrew, back to top" className="flex items-center gap-2.5 rounded-lg">
          <Logo />
          <span className="rounded-md border border-line bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] font-medium tracking-[0.08em] text-muted">
            BETA
          </span>
        </a>
        <nav aria-label="Main" className="hidden items-center gap-8 text-[14px] text-muted md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="transition-colors hover:text-fg">
              {l.label}
            </a>
          ))}
        </nav>
        <a
          href="#waitlist"
          className="inline-flex h-9 shrink-0 items-center rounded-full bg-fg px-4 text-sm font-medium text-white transition-colors hover:bg-black"
        >
          Join the beta
        </a>
      </Container>
    </header>
  );
}
