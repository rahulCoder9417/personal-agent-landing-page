import { doublePrecision, index, integer, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";

// One row per email. Repeat signups update last_seen_at and signup_count; first-touch details stay as they were.
// A signup only counts as on the waitlist once the email is confirmed (verified_at is set).
export const waitlistSignups = pgTable(
  "waitlist_signups",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull().unique(),
    channel: text("channel"),

    // Network and device
    ip: text("ip"),
    userAgent: text("user_agent"),
    acceptLanguage: text("accept_language"),
    browserLanguage: text("browser_language"),
    timezone: text("timezone"),
    screen: text("screen"),

    // Approximate location from the hosting provider's IP headers (Vercel / Cloudflare)
    country: text("country"),
    region: text("region"),
    city: text("city"),
    latitude: doublePrecision("latitude"),
    longitude: doublePrecision("longitude"),

    // Where they came from
    referrer: text("referrer"),
    landingPage: text("landing_page"),
    utmSource: text("utm_source"),
    utmMedium: text("utm_medium"),
    utmCampaign: text("utm_campaign"),
    utmTerm: text("utm_term"),
    utmContent: text("utm_content"),

    // Email confirmation (double opt-in). Only a hash of the emailed link's token is stored.
    verifiedAt: timestamp("verified_at", { withTimezone: true }),
    verifiedIp: text("verified_ip"),
    verifyTokenHash: text("verify_token_hash"),
    verifyExpiresAt: timestamp("verify_expires_at", { withTimezone: true }),
    verifySentAt: timestamp("verify_sent_at", { withTimezone: true }),
    verifyEmailsSent: integer("verify_emails_sent").notNull().default(0),

    signupCount: integer("signup_count").notNull().default(1),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    lastSeenAt: timestamp("last_seen_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("waitlist_signups_ip_last_seen_idx").on(t.ip, t.lastSeenAt),
    index("waitlist_signups_created_at_idx").on(t.createdAt),
    uniqueIndex("waitlist_signups_verify_token_hash_idx").on(t.verifyTokenHash),
  ],
);

export type NewWaitlistSignup = typeof waitlistSignups.$inferInsert;
