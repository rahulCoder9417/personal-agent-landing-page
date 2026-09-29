// Waitlist email confirmation (double opt-in): link tokens and the emails that carry them.
// Emails go out through Resend's HTTP API. Without RESEND_API_KEY in development, the link is logged instead.

import { createHash, randomBytes } from "node:crypto";
import { site } from "./site";

export const CONFIRM_LINK_HOURS = 48;

export function newConfirmToken() {
  const token = randomBytes(32).toString("base64url");
  return { token, hash: hashConfirmToken(token) };
}

// Only this hash is stored, so a database leak can't be used to confirm anyone.
export function hashConfirmToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

type Email = { subject: string; text: string; html: string };

function layout(title: string, body: string, button?: { href: string; label: string }) {
  const cta = button
    ? `<p style="margin:28px 0"><a href="${button.href}" style="display:inline-block;background:#151515;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;padding:12px 22px;border-radius:999px">${button.label}</a></p>`
    : "";
  return `<!doctype html><html><body style="margin:0;background:#fbfaf7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#151515">
<div style="max-width:480px;margin:0 auto;padding:40px 24px">
<p style="margin:0 0 24px;font-weight:700;font-size:16px;line-height:32px"><img src="${site.url}/email/tex.png" width="32" height="32" alt="" style="vertical-align:middle;border-radius:8px;margin-right:8px">textcrew<span style="color:#3355f5">▌</span></p>
<h1 style="margin:0 0 12px;font-size:22px;line-height:1.25">${title}</h1>
${body}
${cta}
<p style="margin:32px 0 0;font-size:12px;color:#6a6862">You're getting this because someone entered this address on ${site.url.replace(/^https?:\/\//, "")}. If it wasn't you, ignore this email and nothing happens. This address doesn't receive replies.</p>
</div></body></html>`;
}

function confirmEmail(link: string): Email {
  const p = (t: string) => `<p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:#3d3c38">${t}</p>`;
  return {
    subject: "Confirm your spot on the Textcrew waitlist",
    text: `Confirm your email to join the Textcrew beta waitlist:\n\n${link}\n\nThe link works for ${CONFIRM_LINK_HOURS} hours. Waitlist members get 50% off their first month of Pro or Max.\n\nIf you didn't ask for this, ignore this email.`,
    html: layout(
      "Confirm your spot",
      p("Tap the button to confirm your email and join the Textcrew beta waitlist.") +
        p(`Waitlist members get 50% off their first month of Pro or Max. The link works for ${CONFIRM_LINK_HOURS} hours.`),
      { href: link, label: "Confirm my email" },
    ),
  };
}

// Returns false when the email couldn't be sent, so the caller can say so.
export async function sendConfirmEmail(to: string, link: string) {
  const email = confirmEmail(link);
  const key = process.env.RESEND_API_KEY;

  if (!key) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`[waitlist] RESEND_API_KEY not set; would email ${to}: ${email.subject}\n  ${link}`);
      return true;
    }
    console.error("[waitlist] RESEND_API_KEY is not set; confirmation email not sent");
    return false;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
      body: JSON.stringify({
        from: process.env.WAITLIST_FROM_EMAIL ?? "Textcrew <no-reply@textcrew.in>",
        to: [to],
        subject: email.subject,
        text: email.text,
        html: email.html,
      }),
    });
    if (!res.ok) {
      console.error("[waitlist] Resend rejected the email", res.status, await res.text().catch(() => ""));
      return false;
    }
    return true;
  } catch (err) {
    console.error("[waitlist] couldn't reach Resend", err);
    return false;
  }
}
