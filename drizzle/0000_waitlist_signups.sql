CREATE TABLE "waitlist_signups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"channel" text,
	"ip" text,
	"user_agent" text,
	"accept_language" text,
	"browser_language" text,
	"timezone" text,
	"screen" text,
	"country" text,
	"region" text,
	"city" text,
	"latitude" double precision,
	"longitude" double precision,
	"referrer" text,
	"landing_page" text,
	"utm_source" text,
	"utm_medium" text,
	"utm_campaign" text,
	"utm_term" text,
	"utm_content" text,
	"signup_count" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_seen_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "waitlist_signups_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE INDEX "waitlist_signups_ip_last_seen_idx" ON "waitlist_signups" USING btree ("ip","last_seen_at");--> statement-breakpoint
CREATE INDEX "waitlist_signups_created_at_idx" ON "waitlist_signups" USING btree ("created_at");