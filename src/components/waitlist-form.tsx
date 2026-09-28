"use client";

import Link from "next/link";
import { useId, useState, type FormEvent } from "react";

const CHANNELS = ["WhatsApp", "Telegram", "iMessage"] as const;
const FALLBACK_ERROR = "We couldn't save your spot. Try again in a minute.";

type State = { status: "idle" | "sending" | "done" | "error"; message?: string };

// Stored with the signup (see /privacy#waitlist): helps us plan the beta and spot spam.
function browserDetails() {
  return {
    page: `${window.location.pathname}${window.location.search}`,
    referrer: document.referrer || null,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    screen: `${window.screen.width}x${window.screen.height}`,
  };
}

export function WaitlistForm({ showChannels = false, className = "" }: { showChannels?: boolean; className?: string }) {
  const uid = useId();
  const [email, setEmail] = useState("");
  const [channel, setChannel] = useState<string | null>(null);
  const [state, setState] = useState<State>({ status: "idle" });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trap = event.currentTarget.elements.namedItem("company");
    const company = trap instanceof HTMLInputElement ? trap.value : "";
    setState({ status: "sending" });
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, channel, company, meta: browserDetails() }),
      });
      const data: { error?: string } = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? FALLBACK_ERROR);
      setState({ status: "done" });
    } catch (err) {
      setState({ status: "error", message: err instanceof Error ? err.message : FALLBACK_ERROR });
    }
  }

  if (state.status === "done") {
    return (
      <div role="status" className={`mx-auto w-full max-w-md rounded-2xl border border-line bg-surface px-5 py-4 text-center shadow-soft ${className}`}>
        <p className="font-semibold">You&apos;re on the list.</p>
        <p className="mt-1 text-sm text-muted">
          We&apos;ll email <span className="font-medium text-fg">{email}</span> when your invite is ready. Your first month of
          Pro or Max is 50% off.
        </p>
      </div>
    );
  }

  const sending = state.status === "sending";

  return (
    <form onSubmit={onSubmit} className={`mx-auto w-full max-w-md ${className}`}>
      <div className="flex items-center gap-1.5 rounded-full border border-line bg-surface p-1.5 shadow-soft focus-within:border-fg/40">
        <label htmlFor={`${uid}-email`} className="sr-only">
          Email address
        </label>
        <input
          id={`${uid}-email`}
          name="email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-10 min-w-0 flex-1 bg-transparent px-3.5 text-[15px] text-fg outline-none placeholder:text-muted/70"
        />
        <button
          type="submit"
          disabled={sending}
          className="h-10 shrink-0 cursor-pointer rounded-full bg-fg px-5 text-sm font-medium text-white transition-colors hover:bg-black disabled:cursor-wait disabled:opacity-60"
        >
          {sending ? "Joining…" : "Join the beta"}
        </button>
      </div>

      {showChannels && (
        <fieldset className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <legend className="sr-only">Where would you text it? (optional)</legend>
          <span aria-hidden className="text-sm text-muted">I&apos;d text it on</span>
          {CHANNELS.map((c) => (
            <label key={c} className="cursor-pointer">
              <input
                type="radio"
                name="channel"
                value={c}
                checked={channel === c}
                onChange={() => setChannel(c)}
                className="peer sr-only"
              />
              <span className="inline-flex h-8 items-center rounded-full border border-line bg-surface px-3 text-sm transition-colors hover:border-fg/40 peer-checked:border-fg peer-checked:bg-fg peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent">
                {c}
              </span>
            </label>
          ))}
        </fieldset>
      )}

      <div aria-hidden="true" className="hidden">
        <label>
          Company
          <input name="company" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {state.status === "error" ? (
        <p role="alert" className="mt-3 text-center text-sm text-danger">
          {state.message}
        </p>
      ) : (
        <p className="mt-3 text-center text-xs text-muted">
          50% off your first month for waitlist members · No spam ·{" "}
          <Link href="/privacy#waitlist" className="underline underline-offset-2 hover:text-fg">
            What we store
          </Link>
        </p>
      )}
    </form>
  );
}
