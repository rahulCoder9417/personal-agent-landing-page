// The web app's frame: on a wide screen a sidebar on warm paper (Tex's state, the places to go,
// credits and the account), on a phone a top bar and tabs along the bottom. As in user-frontend-web
// src/components/shell/. Only Chat, Approvals, Automations and Activity open something here.

import type { ReactNode } from "react";
import { AgentFigure } from "../agent";
import type { Screen } from "./data";
import {
  ActivityIcon,
  ApprovalsIcon,
  AppsIcon,
  AutomationsIcon,
  ChatIcon,
  ChevronsLeftIcon,
  cn,
  HelpIcon,
  MoreIcon,
  PricingIcon,
  SettingsIcon,
} from "./ui";

export function Brand() {
  return (
    <span className="flex items-center gap-2">
      <AgentFigure who="tex" glyph size={24} label="" />
      <span className="font-mono text-[16px] font-semibold tracking-[-0.03em]">textcrew</span>
      <span aria-hidden className="brand-caret -ml-1 h-[15px] w-[7px] bg-accent" />
    </span>
  );
}

type Item = { screen?: Screen; label: string; icon: ReactNode; badge?: number };

function NavItem({ item, active, onOpen }: { item: Item; active: boolean; onOpen: (screen: Screen) => void }) {
  const look = cn(
    "group flex h-[34px] w-full items-center gap-2.5 overflow-hidden rounded-[9px] px-2.5 text-[13.5px] transition-colors",
    active ? "bg-surface font-semibold text-fg shadow-[var(--shadow-raised)]" : "font-medium text-nav",
    item.screen && !active && "cursor-pointer hover:bg-fg/[0.05] hover:text-fg",
  );
  const body = (
    <>
      <span className={cn("shrink-0", active ? "text-accent" : "text-muted", item.screen && "group-hover:text-fg")}>{item.icon}</span>
      <span className="flex-1 text-left whitespace-nowrap">{item.label}</span>
      {!!item.badge && (
        <span className="grid h-[18px] min-w-[18px] place-items-center rounded-full bg-accent px-1 text-[11px] font-semibold text-white tabular-nums">{item.badge}</span>
      )}
    </>
  );
  // The set-up pages aren't part of this demo: drawn as in the app, but they don't open anything.
  if (!item.screen) return <span className={look}>{body}</span>;
  const screen = item.screen;
  return (
    <button type="button" aria-current={active ? "page" : undefined} onClick={() => onOpen(screen)} className={look}>
      {body}
    </button>
  );
}

export function Sidebar({
  screen,
  onOpen,
  pending,
  balance,
}: {
  screen: Screen;
  onOpen: (screen: Screen) => void;
  pending: number;
  balance: number;
}) {
  const work: Item[] = [
    { screen: "chat", label: "Chat", icon: <ChatIcon size={18} /> },
    { screen: "approvals", label: "Approvals", icon: <ApprovalsIcon size={18} />, badge: pending },
    { screen: "automations", label: "Automations", icon: <AutomationsIcon size={18} /> },
    { screen: "activity", label: "Activity", icon: <ActivityIcon size={18} /> },
  ];
  const setup: Item[] = [
    { label: "Integrations", icon: <AppsIcon size={18} /> },
    { label: "Pricing", icon: <PricingIcon size={18} /> },
    { label: "Settings", icon: <SettingsIcon size={18} /> },
    { label: "Help", icon: <HelpIcon size={18} /> },
  ];
  const asking = pending > 0;
  return (
    <nav aria-label="Web app" className="relative hidden w-[228px] shrink-0 flex-col gap-4 px-2.5 pt-4 pb-3 md:flex">
      <div className="flex items-center justify-between px-1.5 pb-1">
        <Brand />
        <span aria-hidden className="grid size-[30px] place-items-center rounded-lg text-muted">
          <ChevronsLeftIcon size={17} />
        </span>
      </div>
      <div className="flex items-center gap-2.5 rounded-xl px-1.5 py-1.5">
        <span className="grid size-10 shrink-0 place-items-center rounded-[11px] bg-accent-soft">
          <AgentFigure who="tex" mood={asking ? "asking" : "ready"} glyph size={32} label="" />
        </span>
        <span className="flex min-w-0 flex-col">
          <span className="truncate text-[13.5px] font-semibold">{asking ? "Waiting for your OK" : "Tex is awake"}</span>
          <span className="truncate text-[12px] text-muted">Active just now</span>
        </span>
      </div>
      <div className="flex flex-col gap-0.5">
        {work.map((item) => (
          <NavItem key={item.label} item={item} active={item.screen === screen} onOpen={onOpen} />
        ))}
      </div>
      <div className="flex flex-col gap-0.5">
        <p className="px-2.5 pt-1 pb-1.5 text-[12px] font-medium text-muted">Set up</p>
        {setup.map((item) => (
          <NavItem key={item.label} item={item} active={false} onOpen={onOpen} />
        ))}
      </div>
      <div className="mt-auto flex flex-col gap-2.5">
        <div className="flex flex-col gap-1 rounded-xl bg-surface px-3 py-2.5 shadow-[var(--shadow-raised)]">
          <span className="flex items-center justify-between text-[12px] text-muted">
            Credits
            <span className="rounded bg-accent-soft px-1.5 py-px text-[11px] font-semibold text-accent-dark">Pro</span>
          </span>
          <span className="text-[22px] leading-none font-semibold tracking-[-0.03em] tabular-nums">{balance.toLocaleString("en-US")}</span>
          <span className="truncate text-[12px] text-muted">Next expiry 15 Jan</span>
        </div>
        <div className="flex items-center gap-2.5 px-1.5 py-1">
          <span aria-hidden className="grid size-7 shrink-0 place-items-center rounded-full bg-fg text-[11px] font-semibold text-white">AM</span>
          <span className="flex min-w-0 flex-col leading-tight">
            <span className="truncate text-[13px] font-medium">Aarav Mehta</span>
            <span className="truncate text-[12px] text-muted">aarav@northwind.studio</span>
          </span>
        </div>
      </div>
    </nav>
  );
}

/** Phone: the brand and the credit balance across the top. */
export function MobileTopBar({ balance }: { balance: number }) {
  return (
    <div className="flex h-12 shrink-0 items-center justify-between bg-chrome px-4 md:hidden">
      <Brand />
      <span className="flex h-8 items-center gap-1.5 rounded-full bg-surface px-3 text-[13px] font-semibold shadow-[var(--shadow-raised)] tabular-nums">
        {balance.toLocaleString("en-US")}
        <span className="font-normal text-muted">credits</span>
      </span>
    </div>
  );
}

/** Phone: the five tabs under the thumb. Activity lives behind More, as in the app. */
export function MobileTabBar({ screen, onOpen, pending }: { screen: Screen; onOpen: (screen: Screen) => void; pending: number }) {
  const tabs: (Item & { active: boolean })[] = [
    { screen: "chat", label: "Chat", icon: <ChatIcon size={22} />, active: screen === "chat" },
    { screen: "approvals", label: "Approvals", icon: <ApprovalsIcon size={22} />, badge: pending, active: screen === "approvals" },
    { screen: "automations", label: "Automations", icon: <AutomationsIcon size={22} />, active: screen === "automations" },
    { label: "Integrations", icon: <AppsIcon size={22} />, active: false },
    { screen: "activity", label: "More", icon: <MoreIcon size={22} />, active: screen === "activity" },
  ];
  return (
    <nav aria-label="Web app" className="flex shrink-0 border-t border-line bg-surface px-1 md:hidden">
      {tabs.map((tab) => {
        const look = cn("relative flex min-h-[56px] flex-1 flex-col items-center justify-center gap-0.5 text-[11px]", tab.active ? "font-semibold text-fg" : "font-medium text-muted");
        const body = (
          <>
            <span className={cn("relative", tab.active && "text-accent")}>
              {tab.icon}
              {!!tab.badge && (
                <span className="absolute -top-1 -right-2.5 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[10px] font-semibold text-white tabular-nums">
                  {tab.badge}
                </span>
              )}
            </span>
            {tab.label}
          </>
        );
        if (!tab.screen) return <span key={tab.label} className={look}>{body}</span>;
        const target = tab.screen;
        return (
          <button key={tab.label} type="button" aria-current={tab.active ? "page" : undefined} onClick={() => onOpen(target)} className={cn(look, "cursor-pointer")}>
            {body}
          </button>
        );
      })}
    </nav>
  );
}
