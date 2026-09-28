// Beta waitlist signup.
// Validates the email, drops bots (honeypot field), rate limits per IP, then forwards the signup
// as JSON to WAITLIST_WEBHOOK_URL (Zapier, Make, Loops, your own backend…).
// Without a webhook it only logs in development and refuses in production, so signups are never silently lost.

const CHANNELS = new Set(["WhatsApp", "Telegram", "iMessage"]);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

// Per-instance memory only; good enough to slow down casual abuse on a landing page.
const hits = new Map<string, number[]>();

function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

function error(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return error("Send your email address to join the waitlist.", 400);
  }

  // Bots fill every field; people never see this one.
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return Response.json({ ok: true });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return error("Enter a valid email address, like you@company.com.", 400);
  }
  const channel = typeof body.channel === "string" && CHANNELS.has(body.channel) ? body.channel : null;

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  if (limited(ip)) {
    return error("Too many tries from your connection. Wait a few minutes and try again.", 429);
  }

  const webhook = process.env.WAITLIST_WEBHOOK_URL;
  if (!webhook) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[waitlist] (no WAITLIST_WEBHOOK_URL set, not stored)", { email, channel });
      return Response.json({ ok: true });
    }
    return error("The waitlist isn't open yet. Please try again soon.", 503);
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(process.env.WAITLIST_WEBHOOK_SECRET ? { authorization: `Bearer ${process.env.WAITLIST_WEBHOOK_SECRET}` } : {}),
      },
      body: JSON.stringify({ email, channel, source: "landing-page", joinedAt: new Date().toISOString() }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`webhook responded ${res.status}`);
  } catch (err) {
    console.error("[waitlist] forward failed", err);
    return error("We couldn't save your spot. Try again in a minute.", 502);
  }

  return Response.json({ ok: true });
}
