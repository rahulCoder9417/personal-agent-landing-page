"use client";

import { useActionState } from "react";
import { AgentFigure } from "@/components/agent";
import { site } from "@/lib/site";
import { confirmWaitlist, type ConfirmState } from "./actions";

const COPY: Record<Exclude<ConfirmState["status"], "idle">, { title: string; body: string }> = {
  confirmed: {
    title: "You're on the list.",
    body: "Your first month of Pro or Max is 50% off. Textcrew is live, so you can sign up now.",
  },
  invalid: {
    title: "This link has expired or was already used.",
    body: "If you already confirmed, you're on the list. Textcrew is live now, so you can sign up any time.",
  },
  error: {
    title: "Something went wrong on our side.",
    body: "Your email isn't confirmed yet. Try again in a minute.",
  },
};

export function ConfirmCard({ token }: { token: string }) {
  const initial: ConfirmState = { status: token ? "idle" : "invalid" };
  const [state, action, pending] = useActionState(confirmWaitlist, initial);
  const done = state.status !== "idle" && state.status !== "error" ? COPY[state.status] : null;

  return (
    <div className="mx-auto w-full max-w-md rounded-3xl border border-line bg-surface p-8 text-center shadow-soft">
      <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-accent-soft">
        <AgentFigure who="tex" glyph size={40} label="Tex" />
      </span>

      <div role="status" aria-live="polite">
        {done ? (
          <>
            <h1 className="mt-6 text-2xl font-bold tracking-[-0.03em]">{done.title}</h1>
            <p className="mt-2 leading-relaxed text-muted">{done.body}</p>
            <a href={site.signUpUrl} className="mt-7 inline-flex h-10 items-center rounded-full bg-fg px-5 text-sm font-medium text-white hover:bg-black">
              Get started free
            </a>
          </>
        ) : (
          <>
            <h1 className="mt-6 text-2xl font-bold tracking-[-0.03em]">
              {state.status === "error" ? COPY.error.title : "Confirm your email"}
            </h1>
            <p className="mt-2 leading-relaxed text-muted">
              {state.status === "error" ? COPY.error.body : "One tap and you're on the Textcrew waitlist."}
            </p>
            <form action={action} className="mt-7">
              <input type="hidden" name="token" value={token} />
              <button
                type="submit"
                disabled={pending}
                className="inline-flex h-11 cursor-pointer items-center rounded-full bg-fg px-6 text-sm font-medium text-white transition-colors hover:bg-black disabled:cursor-wait disabled:opacity-60"
              >
                {pending ? "Confirming…" : state.status === "error" ? "Try again" : "Confirm my email"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
