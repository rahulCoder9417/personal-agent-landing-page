"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { site } from "@/lib/site";

// Below 1024px the header has no room for its links: a menu button opens them in a panel under the
// header, with Sign in and Get started at the foot. Escape, a link or a tap outside closes it.
export function MobileMenu({ links, current }: { links: { href: string; label: string }[]; current?: string }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    const onPointer = (event: PointerEvent) => !root.current?.contains(event.target as Node) && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    // The panel is placed against the header (the nearest positioned box), full width under it.
    <div ref={root} className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((was) => !was)}
        className="ml-1 grid size-9 cursor-pointer place-items-center rounded-full text-fg transition-colors hover:bg-surface-2"
      >
        <svg aria-hidden viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round">
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>
      {open && (
        <div id={panelId} className="absolute inset-x-0 top-full border-b border-line bg-bg px-4 pb-5 pt-2 shadow-soft sm:px-6">
          <nav aria-label="Menu" className="flex flex-col">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                aria-current={l.href === current ? "page" : undefined}
                className="border-b border-line py-3.5 text-[16px] font-medium text-fg aria-[current=page]:text-accent"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="mt-5 grid grid-cols-2 gap-2.5">
            <a href={site.signInUrl} className="inline-flex h-11 items-center justify-center rounded-full border border-line bg-surface text-[15px] font-medium shadow-soft">
              Sign in
            </a>
            <a href={site.signUpUrl} className="inline-flex h-11 items-center justify-center rounded-full bg-fg text-[15px] font-medium text-white">
              Get started
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
