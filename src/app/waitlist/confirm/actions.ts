"use server";

import { and, eq, gt } from "drizzle-orm";
import { headers } from "next/headers";
import { getDb } from "@/db";
import { waitlistSignups } from "@/db/schema";
import { hashConfirmToken } from "@/lib/waitlist-email";

export type ConfirmState = { status: "idle" | "confirmed" | "invalid" | "error" };

// Runs when the visitor presses Confirm (not when the link is opened), so link scanners in
// mail apps can't confirm an address on their own.
export async function confirmWaitlist(_prev: ConfirmState, formData: FormData): Promise<ConfirmState> {
  const token = formData.get("token");
  if (typeof token !== "string" || token.length < 20 || token.length > 100) return { status: "invalid" };

  const db = getDb();
  if (!db) {
    console.error("[waitlist] DATABASE_URL is not set; can't confirm");
    return { status: "error" };
  }

  const h = await headers();
  const ip = (h.get("x-forwarded-for")?.split(",")[0] ?? h.get("x-real-ip") ?? "").trim().slice(0, 64) || null;

  try {
    const confirmed = await db
      .update(waitlistSignups)
      .set({ verifiedAt: new Date(), verifiedIp: ip, verifyTokenHash: null, verifyExpiresAt: null })
      .where(and(eq(waitlistSignups.verifyTokenHash, hashConfirmToken(token)), gt(waitlistSignups.verifyExpiresAt, new Date())))
      .returning({ id: waitlistSignups.id });
    return { status: confirmed.length > 0 ? "confirmed" : "invalid" };
  } catch (err) {
    console.error("[waitlist] confirming failed", err);
    return { status: "error" };
  }
}
