"use client";

// The Approvals screen as the web app draws it (user-frontend-web src/app/(app)/approvals/ and
// src/components/approvals/): a tab per status plus Skip rules, the list on the left and the open
// approval on the right (one column when narrow), with Approve and Deny while it waits.

import { useState } from "react";
import { DecidedLine, DetailsFold, SkipPicker, whyOf, type Decide } from "./chat-screen";
import { EMPTY, STATUS_LABEL, TABS, type ApprovalStatus, type DemoApproval, type SkipRule } from "./data";
import { APP_LABEL, AppMark, buttonClass, cn, Empty, FilterPills, IconTile, PageHeader } from "./ui";

export type ApprovalItem = { approval: DemoApproval; status: ApprovalStatus; when: string; settled: string };

type View = (typeof TABS)[number]["value"] | "rules";

const OUTCOME: Partial<Record<ApprovalStatus, string>> = {
  approved: "Tex was told to go ahead.",
  rejected: "Tex didn’t do this.",
};

function Detail({ item, onDecide, onShowRules }: { item: ApprovalItem; onDecide: Decide; onShowRules: () => void }) {
  const { approval, status } = item;
  const pending = status === "pending";
  const why = whyOf(approval);
  const meta = [approval.reason.label, APP_LABEL[approval.app], approval.action].join(" · ");
  return (
    <article aria-label={approval.summary} className="flex w-full max-w-[640px] flex-col gap-4 rounded-2xl border border-fg/10 bg-accent-soft p-4 @min-[640px]:p-5">
      <div className="flex items-start gap-3">
        <span className="shrink-0 rounded-lg bg-surface p-0.5">
          <AppMark name={approval.app} size={32} />
        </span>
        <div className="flex min-w-0 flex-col gap-1">
          <span className="text-[12px] font-semibold text-accent">{STATUS_LABEL[status]}</span>
          <h3 className="line-clamp-2 text-[15px] leading-[1.35] font-semibold tracking-[-0.01em]">{approval.summary}</h3>
          {pending && why && <p className="text-[13.5px] leading-normal text-fg-2">{why}</p>}
          <p className="truncate text-[12px] text-muted">{meta}</p>
        </div>
      </div>

      <DetailsFold approval={approval} open className="-mt-1" />

      {pending ? (
        <>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => onDecide(approval.id, "approve")} className={buttonClass("primary")}>
              Approve
            </button>
            <button type="button" onClick={() => onDecide(approval.id, "reject")} className={buttonClass("secondary")}>
              Deny
            </button>
          </div>
          <p className="-mt-2 text-center text-[12px] text-muted">The same buttons are in your chat.</p>
          <SkipPicker approval={approval} onConfirm={(scope) => onDecide(approval.id, "approve", scope)} className="-mt-1" />
        </>
      ) : (
        <div className="flex flex-col gap-1.5">
          <DecidedLine status={status} summary={approval.summary} />
          {status === "auto_approved" ? (
            <p className="text-[12.5px] text-fg-2">
              <span className="text-muted">Your rule: </span>
              Only to aarav@northwind.studio
              <span aria-hidden className="text-muted"> · </span>
              <button type="button" onClick={onShowRules} className="cursor-pointer font-medium text-accent hover:underline">
                See your skip rules
              </button>
            </p>
          ) : (
            <p className="text-[12.5px] text-muted">{OUTCOME[status]}</p>
          )}
        </div>
      )}

      <p className="text-center text-[12px] text-muted tabular-nums">{status === "auto_approved" ? item.settled : `Asked ${approval.asked} · ${item.settled}`}</p>
    </article>
  );
}

export function ApprovalsScreen({
  items,
  rules,
  onDecide,
  onRemoveRule,
}: {
  items: ApprovalItem[];
  rules: SkipRule[];
  onDecide: Decide;
  onRemoveRule: (id: string) => void;
}) {
  const [view, setView] = useState<View>("pending");
  const [selected, setSelected] = useState<string | null>(null);

  const list = view === "rules" ? [] : items.filter((item) => item.status === view);
  const active = list.find((item) => item.approval.id === selected) ?? list[0] ?? null;
  const options = [
    ...TABS.map((t) => ({ value: t.value as View, label: t.label, count: items.filter((item) => item.status === t.value).length })),
    { value: "rules" as View, label: "Skip rules", count: rules.length },
  ];
  const pick = (next: View) => {
    setView(next);
    setSelected(null);
  };
  // Like the app: after a decision here, follow the approval to the tab it moved to.
  const decide: Decide = (id, decision, rule) => {
    onDecide(id, decision, rule);
    setView(decision === "approve" ? "approved" : "rejected");
    setSelected(id);
  };

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
      <PageHeader title="Approvals">
        <FilterPills label="Show" options={options} value={view} onChange={pick} />
      </PageHeader>

      {view === "rules" ? (
        <div className="scroll-pane min-h-0 flex-1 overflow-y-auto px-4 pt-2 pb-6 @min-[600px]:px-8">
          {rules.length === 0 ? (
            <Empty title={EMPTY.rules.title}>{EMPTY.rules.body}</Empty>
          ) : (
            <ul aria-label="Skip rules" className="flex max-w-[640px] flex-col gap-2">
              {rules.map((rule) => (
                <li key={rule.id} className="flex items-center gap-3 rounded-xl border border-fg/10 bg-surface p-3">
                  <IconTile size={36}>
                    <AppMark name="gmail" />
                  </IconTile>
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="truncate text-[14px] font-semibold">
                      {rule.actionName}
                      <span className="font-normal text-muted"> · Gmail</span>
                    </span>
                    <span className="text-[13px] text-fg-2 [overflow-wrap:anywhere]">{rule.scope}</span>
                    <span className="text-[12px] text-muted">{rule.made}</span>
                  </span>
                  <button type="button" onClick={() => onRemoveRule(rule.id)} className={buttonClass("secondary", "sm")}>
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : list.length === 0 ? (
        <div className="scroll-pane min-h-0 flex-1 overflow-y-auto px-4 @min-[600px]:px-8">
          <Empty title={EMPTY[view].title} mood={view === "pending" ? "done" : "ready"}>
            {EMPTY[view].body}
          </Empty>
        </div>
      ) : (
        // Wide: the list and the open approval side by side. Narrow: one column, the list first.
        <div className="scroll-pane flex min-h-0 flex-1 flex-col overflow-y-auto @min-[640px]:flex-row @min-[640px]:overflow-hidden">
          <section aria-label="Approvals" className="w-full shrink-0 px-4 pt-2 pb-3 @min-[640px]:w-[clamp(240px,38%,360px)] @min-[640px]:overflow-y-auto @min-[640px]:pr-4 @min-[640px]:pb-6 @min-[640px]:pl-8">
            <ul className="flex flex-col gap-2">
              {list.map(({ approval, when }) => {
                const on = approval.id === active?.approval.id;
                return (
                  <li key={approval.id}>
                    <button
                      type="button"
                      aria-pressed={on}
                      onClick={() => setSelected(approval.id)}
                      className={cn(
                        "flex w-full cursor-pointer items-center gap-3 rounded-xl border p-3 text-left transition-colors",
                        on ? "border-accent/25 bg-accent-soft" : "border-fg/10 bg-surface hover:bg-surface-2",
                      )}
                    >
                      <IconTile size={36} className={on ? "bg-surface" : undefined}>
                        <AppMark name={approval.app} />
                      </IconTile>
                      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <span className="truncate text-[14px] font-semibold">{approval.summary}</span>
                        <span className="truncate text-[12.5px] text-muted">
                          {approval.reason.label}
                          <span aria-hidden> · </span>
                          {when}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
          <section aria-label="Approval details" className="min-w-0 flex-1 px-4 pt-2 pb-6 @min-[640px]:overflow-y-auto @min-[640px]:pr-8 @min-[640px]:pl-3">
            {active && <Detail key={active.approval.id} item={active} onDecide={decide} onShowRules={() => pick("rules")} />}
          </section>
        </div>
      )}
    </div>
  );
}
