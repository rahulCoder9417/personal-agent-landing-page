// Waitlist confirm links (double opt-in). The waitlist is closed and no more emails are sent,
// but links in emails already sent still work, so the confirm page still needs this hash.

import { createHash } from "node:crypto";

// Only this hash is stored, so a database leak can't be used to confirm anyone.
export function hashConfirmToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}
