import Link from "next/link";
import { site } from "@/lib/site";
import { Logo } from "./logo";
import { MobileMenu } from "./mobile-menu";
import { Container } from "./section";

// Home sections are linked as "/#id", so the nav works from /pricing too.
const links = [
  { href: "/#how", label: "How it works" },
  { href: "/#apps", label: "Apps" },
  { href: "/#crew", label: "The crew" },
  { href: "/pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
];

// `current` is the path of the page showing the nav, so its own link is marked as the current page.
// Wide screens: the links, Sign in and Get started. Narrower: Get started and a menu with the rest.
export function Nav({ current }: { current?: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-bg/80 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-6">
        <Link href="/#top" aria-label="Textcrew home" className="flex items-center rounded-lg">
          <Logo />
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-8 text-[14px] text-muted lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={l.href === current ? "page" : undefined}
              className="transition-colors hover:text-fg aria-[current=page]:font-medium aria-[current=page]:text-fg"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-1.5">
          <a
            href={site.signInUrl}
            className="hidden h-9 items-center rounded-full px-3.5 text-sm font-medium text-muted transition-colors hover:text-fg sm:inline-flex"
          >
            Sign in
          </a>
          <a
            href={site.signUpUrl}
            className="inline-flex h-9 shrink-0 items-center rounded-full bg-fg px-4 text-sm font-medium text-white transition-colors hover:bg-black"
          >
            Get started
          </a>
          <MobileMenu links={links} current={current} />
        </div>
      </Container>
    </header>
  );
}
