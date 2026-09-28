import { doublePrecision, index, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

// One row per email. Repeat signups update last_seen_at and signup_count; first-touch details stay as they were.
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

    signupCount: integer("signup_count").notNull().default(1),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    lastSeenAt: timestamp("last_seen_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("waitlist_signups_ip_last_seen_idx").on(t.ip, t.lastSeenAt),
    index("waitlist_signups_created_at_idx").on(t.createdAt),
  ],
);

export type NewWaitlistSignup = typeof waitlistSignups.$inferInsert;
