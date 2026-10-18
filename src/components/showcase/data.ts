// What the showcase's pretend account holds: one chat, its approvals, automations and activity.
// Words follow the web app's own (approval reasons, tab names, activity labels, automation lines).

import type { AgentId } from "@/lib/content";
import type { AppName } from "./ui";

export type Screen = "chat" | "approvals" | "automations" | "activity";

export type ApprovalStatus = "pending" | "approved" | "rejected" | "auto_approved";

export type Reason = { label: string; tone: "info" | "danger" | "neutral" };

export type DemoApproval = {
  id: string;
  app: AppName;
  summary: string;
  action: string;
  reason: Reason;
  /** The exact details, as the "Show the details" fold lists them. */
  fields: [string, string][];
  preview?: string;
  /** "Don't ask again" is offered (never for deleting, paying or merging). */
  skip?: { actionName: string; recipient: string };
  /** For a pending one, the time left; otherwise the day it was settled. */
  when: string;
  /** The foot of its card on the Approvals screen: when Tex asked, and when it expires or was settled. */
  asked: string;
  settled: string;
  start: ApprovalStatus;
};

export const SENDS: Reason = { label: "Sends to someone else", tone: "info" };
const DELETES: Reason = { label: "Deletes things", tone: "danger" };
const ASKS: Reason = { label: "Needs your OK", tone: "neutral" };

export const EMAIL_ID = "email";

export const APPROVALS: DemoApproval[] = [
  {
    id: EMAIL_ID,
    app: "gmail",
    summary: "Send this email to Maya",
    action: "GMAIL_SEND_EMAIL",
    reason: SENDS,
    fields: [
      ["To", "maya@acme.com"],
      ["Subject", "PR #128 is ready"],
    ],
    preview: "Hi Maya, PR #128 looks good and is ready to merge. Thanks!",
    skip: { actionName: "Send email", recipient: "maya@acme.com" },
    when: "23h 59m left",
    asked: "Today, 10:43 AM",
    settled: "Expires Tomorrow, 10:43 AM",
    start: "pending",
  },
  {
    id: "meeting",
    app: "googlecalendar",
    summary: "Move the design review to Thursday 3pm",
    action: "GOOGLECALENDAR_UPDATE_EVENT",
    reason: ASKS,
    fields: [
      ["Event", "Design review"],
      ["Starts", "Thu, 3:00 PM"],
    ],
    when: "22h 31m left",
    asked: "Today, 9:15 AM",
    settled: "Expires Tomorrow, 9:15 AM",
    start: "pending",
  },
  {
    id: "drafts",
    app: "gmail",
    summary: "Delete 12 old drafts",
    action: "GMAIL_DELETE_DRAFT",
    reason: DELETES,
    fields: [["Drafts", "12, older than 90 days"]],
    when: "20h 6m left",
    asked: "Today, 6:50 AM",
    settled: "Expires Tomorrow, 6:50 AM",
    start: "pending",
  },
  {
    id: "digest",
    app: "gmail",
    summary: "Email me my inbox digest",
    action: "GMAIL_SEND_EMAIL",
    reason: SENDS,
    fields: [
      ["To", "aarav@northwind.studio"],
      ["Subject", "Your inbox today"],
    ],
    when: "Today",
    asked: "Today, 9:02 AM",
    settled: "Ran Today, 9:02 AM, without asking",
    start: "auto_approved",
  },
  {
    id: "dana",
    app: "gmail",
    summary: "Reply to Dana about Friday",
    action: "GMAIL_REPLY_TO_THREAD",
    reason: SENDS,
    fields: [["To", "dana@northwind.studio"]],
    preview: "Friday at 11 works for me. See you then!",
    when: "Yesterday",
    asked: "Yesterday, 4:10 PM",
    settled: "Approved Yesterday, 4:12 PM",
    start: "approved",
  },
];

export const TABS: { value: ApprovalStatus | "expired" | "replaced"; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Denied" },
  { value: "expired", label: "Expired" },
  { value: "replaced", label: "Replaced" },
  { value: "auto_approved", label: "Auto-approved" },
];

export const STATUS_LABEL: Record<ApprovalStatus, string> = {
  pending: "Needs your OK",
  approved: "Approved",
  rejected: "Denied",
  auto_approved: "Auto-approved",
};

export const EMPTY: Record<string, { title: string; body: string }> = {
  pending: { title: "All caught up", body: "Nothing is waiting on you. Tex will ask here and in your chat when something needs an OK." },
  approved: { title: "Nothing approved yet", body: "Actions you approve are kept here with what happened next." },
  rejected: { title: "Nothing rejected", body: "Actions you reject are kept here so you can see what Tex didn’t do." },
  expired: { title: "Nothing expired", body: "An approval expires if you don’t answer in time. Tex does nothing when that happens." },
  replaced: {
    title: "Nothing replaced",
    body: "When an app can’t take a request as you approved it, Tex asks again with corrected details. The earlier request is kept here. Nothing was done with it.",
  },
  auto_approved: {
    title: "Nothing ran without asking",
    body: "When you pick “Don’t ask again for this…” on an approval card, what your rule covers runs at once. Each one is kept here.",
  },
  rules: {
    title: "No skip rules",
    body: "When Tex asks about something you always say yes to, tap “Don’t ask again for this…” on its card. Deleting, paying and merging always ask.",
  },
};

export type SkipRule = { id: string; actionName: string; scope: string; made: string };

export const FIRST_RULE: SkipRule = { id: "me", actionName: "Send email", scope: "Only to aarav@northwind.studio", made: "Made 12 Oct" };

// ---------------------------------------------------------------- the chat's steps

export type Step = { text?: string; crew?: { who: AgentId; name: string; text: string } };

export const STEPS: Step[] = [
  { text: "Read pull request #128 in acme/web" },
  { crew: { who: "patch", name: "Patch", text: "Reviewed 4 files: no issues found" } },
  { text: "Drafted the email to Maya" },
];

// ---------------------------------------------------------------- automations

export type DemoAutomation = {
  id: string;
  marks: ("schedule" | "once" | "tex" | "patch" | AppName)[];
  title: string;
  repo?: string;
  line: string;
  last: { tone: "ok" | "muted"; text: string };
  next: string;
  kind: "schedule" | "event";
};

export const AUTOMATIONS: DemoAutomation[] = [
  {
    id: "inbox",
    marks: ["schedule", "gmail", "tex"],
    title: "Summarise my inbox",
    line: "Every weekday at 9:00 AM · Summarise my unread email",
    last: { tone: "ok", text: "1h ago" },
    next: "Tomorrow, 9:00 AM",
    kind: "schedule",
  },
  {
    id: "review",
    marks: ["github", "patch"],
    title: "Review pull requests",
    repo: "acme/web",
    line: "When a pull request opens · Patch comments on it",
    last: { tone: "ok", text: "1h ago" },
    next: "On the next pull request",
    kind: "event",
  },
  {
    id: "boss",
    marks: ["gmail", "tex"],
    title: "Boss emails",
    line: "When a new email arrives in Gmail · Tell me who wrote and what they want",
    last: { tone: "ok", text: "Yesterday" },
    next: "Each time it happens",
    kind: "event",
  },
  {
    id: "invoice",
    marks: ["once", "tex"],
    title: "Chase the Acme invoice",
    line: "Once, on Friday at 10:00 AM · Remind me to chase invoice INV-2291",
    last: { tone: "muted", text: "Not yet" },
    next: "Friday, 10:00 AM",
    kind: "schedule",
  },
];

// ---------------------------------------------------------------- activity

export type Actor = "agent" | "user" | "system" | AgentId;

export type Entry = { id: string; time: string; actor: Actor; who: string; label: string; summary: string; credits: number; filter: "tex" | "crew" | "you" | "automations" | "approvals" };

/** What happened today before the visitor arrived, newest first. */
export const BASE_ACTIVITY: Entry[] = [
  { id: "a1", time: "10:43 AM", actor: "agent", who: "Tex", label: "approval requested", summary: "Asked to send an email to Maya", credits: 0, filter: "approvals" },
  { id: "a2", time: "10:43 AM", actor: "patch", who: "Patch", label: "progress", summary: "Reviewed 4 files in PR #128: no issues found", credits: 0, filter: "crew" },
  { id: "a3", time: "10:42 AM", actor: "agent", who: "Tex", label: "run app action", summary: "Read pull request #128 in acme/web", credits: 0, filter: "tex" },
  { id: "a4", time: "9:31 AM", actor: "patch", who: "Patch", label: "run app action", summary: "Posted a review on acme/web#127", credits: 1, filter: "crew" },
  { id: "a5", time: "9:02 AM", actor: "agent", who: "Tex", label: "run app action", summary: "Email me my inbox digest", credits: 1, filter: "tex" },
  { id: "a6", time: "9:00 AM", actor: "system", who: "Automation", label: "automation run", summary: "Ran “Summarise my inbox”", credits: 0, filter: "automations" },
];

export const BALANCE = 1482;
