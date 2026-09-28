// Beta waitlist signup, stored in Neon Postgres (table: waitlist_signups).
// Validates the email, drops bots (honeypot field), rate limits per IP in the database, and records
// the visitor's network, device, location and attribution details alongside the signup.

import { and, eq, gt, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { waitlistSignups, type NewWaitlistSignup } from "@/db/schema";

const CHANNELS = new Set(["WhatsApp", "Telegram", "iMessage"]);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const RATE_WINDOW_MINUTES = 10;
const MAX_EMAILS_PER_IP = 5;

function error(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

// Trim, cap length and turn empty values into null, so the table never stores junk or huge strings.
function clean(value: unknown, max = 500): string | null {
  if (typeof value !== "string") return null;
  const v = value.trim();
  return v ? v.slice(0, max) : null;
}

function header(request: Request, name: string, max = 500) {
  return clean(request.headers.get(name), max);
}

function decoded(value: string | null) {
  if (!value) return null;
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function number(value: string | null) {
  const n = value === null ? NaN : Number(value);
  return Number.isFinite(n) ? n : null;
}

function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0];
  return clean(forwarded, 64) ?? header(request, "x-real-ip", 64) ?? header(request, "cf-connecting-ip", 64);
}

function utm(page: string | null) {
  const empty = { utmSource: null, utmMedium: null, utmCampaign: null, utmTerm: null, utmContent: null };
  if (!page) return empty;
  try {
    const q = new URL(page, "https://placeholder.local").searchParams;
    return {
      utmSource: clean(q.get("utm_source"), 200),
      utmMedium: clean(q.get("utm_medium"), 200),
      utmCampaign: clean(q.get("utm_campaign"), 200),
      utmTerm: clean(q.get("utm_term"), 200),
      utmContent: clean(q.get("utm_content"), 200),
    };
  } catch {
    return empty;
  }
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

  const db = getDb();
  if (!db) {
    console.error("[waitlist] DATABASE_URL is not set; signup not stored");
    return error("The waitlist isn't open yet. Please try again soon.", 503);
  }

  const meta = (typeof body.meta === "object" && body.meta !== null ? body.meta : {}) as Record<string, unknown>;
  const ip = clientIp(request);
  const landingPage = clean(meta.page, 1000);

  const row: NewWaitlistSignup = {
    email,
    channel: typeof body.channel === "string" && CHANNELS.has(body.channel) ? body.channel : null,
    ip,
    userAgent: header(request, "user-agent", 1000),
    acceptLanguage: header(request, "accept-language", 200),
    browserLanguage: clean(meta.language, 50),
    timezone: clean(meta.timezone, 80) ?? header(request, "x-vercel-ip-timezone", 80),
    screen: clean(meta.screen, 30),
    country: header(request, "x-vercel-ip-country", 8) ?? header(request, "cf-ipcountry", 8),
    region: header(request, "x-vercel-ip-country-region", 50),
    city: decoded(header(request, "x-vercel-ip-city", 120)),
    latitude: number(request.headers.get("x-vercel-ip-latitude")),
    longitude: number(request.headers.get("x-vercel-ip-longitude")),
    referrer: clean(meta.referrer, 1000),
    landingPage,
    ...utm(landingPage),
  };

  try {
    if (ip) {
      const [{ count }] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(waitlistSignups)
        .where(
          and(
            eq(waitlistSignups.ip, ip),
            gt(waitlistSignups.lastSeenAt, sql`now() - make_interval(mins => ${RATE_WINDOW_MINUTES})`),
          ),
        );
      if (count >= MAX_EMAILS_PER_IP) {
        return error("Too many signups from your connection. Wait a few minutes and try again.", 429);
      }
    }

    await db
      .insert(waitlistSignups)
      .values(row)
      .onConflictDoUpdate({
        target: waitlistSignups.email,
        set: {
          channel: sql`coalesce(excluded.channel, ${waitlistSignups.channel})`,
          signupCount: sql`${waitlistSignups.signupCount} + 1`,
          lastSeenAt: sql`now()`,
        },
      });
  } catch (err) {
    console.error("[waitlist] database write failed", err);
    return error("We couldn't save your spot. Try again in a minute.", 500);
  }

  // Same answer for new and existing emails, so nobody can check who's on the list.
  return Response.json({ ok: true });
}
