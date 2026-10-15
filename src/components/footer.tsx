import Link from "next/link";
import { site } from "@/lib/site";
import { Logo } from "./logo";
import { Container } from "./section";

export function Footer() {
  return (
    <footer className="border-t border-line py-10">
      <Container className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-3">
          <Logo />
          <p className="font-mono text-xs uppercase tracking-[0.06em] text-muted">{site.status}</p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-8 gap-y-3 text-[15px] text-muted">
          <Link href="/#how" className="hover:text-fg">How it works</Link>
          <Link href="/#crew" className="hover:text-fg">The crew</Link>
          <Link href="/pricing" className="hover:text-fg">Pricing</Link>
          <Link href="/#faq" className="hover:text-fg">FAQ</Link>
          <Link href="/privacy" className="hover:text-fg">Privacy</Link>
        </nav>
      </Container>
      <Container className="mt-8">
        <p className="text-sm text-muted">© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
      </Container>
    </footer>
  );
}
