ALTER TABLE "waitlist_signups" ADD COLUMN "verified_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "waitlist_signups" ADD COLUMN "verified_ip" text;--> statement-breakpoint
ALTER TABLE "waitlist_signups" ADD COLUMN "verify_token_hash" text;--> statement-breakpoint
ALTER TABLE "waitlist_signups" ADD COLUMN "verify_expires_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "waitlist_signups" ADD COLUMN "verify_sent_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "waitlist_signups" ADD COLUMN "verify_emails_sent" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "waitlist_signups_verify_token_hash_idx" ON "waitlist_signups" USING btree ("verify_token_hash");