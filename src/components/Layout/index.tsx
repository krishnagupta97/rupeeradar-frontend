import {
  ChartPie,
  ChartLineUp,
  ClipboardText,
  GearSix,
  ListBullets,
  Target,
  Wallet,
} from "@phosphor-icons/react";
import { NavLink, Outlet } from "react-router-dom";
import { MobileBottomNav } from "../MobileBottomNav";
import { useApp } from "../../contexts/useApp";
import type { LayoutProps } from "./types";

const nav = [
  {
    to: "/",
    label: "Dashboard",
    hint: "Overview & charts",
    Icon: ChartPie,
  },
  {
    to: "/transactions",
    label: "Transactions",
    hint: "Add, filter, search",
    Icon: ListBullets,
  },
  {
    to: "/budgets",
    label: "Budgets",
    hint: "Limits & progress",
    Icon: Wallet,
  },
  {
    to: "/templates",
    label: "Templates",
    hint: "Quick repeat entries",
    Icon: ClipboardText,
  },
  {
    to: "/reports",
    label: "Reports",
    hint: "Trends & insights",
    Icon: ChartLineUp,
  },
  {
    to: "/goals",
    label: "Goals",
    hint: "Targets & savings",
    Icon: Target,
  },
  {
    to: "/settings",
    label: "Settings",
    hint: "Prefs",
    Icon: GearSix,
  },
] as const;

function LayoutContent({ children }: LayoutProps) {
  const { user } = useApp();

  return (
    <div className="md-app flex h-dvh min-h-0 flex-col overflow-hidden">
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <aside className="md-sidebar hidden w-[17rem] shrink-0 flex-col border-r px-4 py-6 md:flex">
          <div className="mb-8 px-2">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--md-primary)]">
              RupeeRadar
            </p>
            <p className="mt-1 text-xl font-medium tracking-tight text-[var(--md-on-surface)]">
              Finance
            </p>
          </div>
          <nav className="flex flex-1 flex-col gap-1">
            {nav.map((item) => {
              const Icon = item.Icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    [
                      "flex items-start gap-3 rounded-2xl px-3 py-2.5 text-sm transition-all duration-200",
                      isActive ? "md-nav-active" : "md-nav-idle",
                    ].join(" ")
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className="mt-0.5 size-5 shrink-0"
                        weight={isActive ? "fill" : "duotone"}
                        aria-hidden
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block font-medium leading-tight">
                          {item.label}
                        </span>
                        <span className="mt-0.5 block text-[11px] opacity-80">
                          {item.hint}
                        </span>
                      </span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
          {user ? (
            <div className="mt-6 rounded-2xl border border-[color-mix(in_srgb,var(--md-outline-variant)_60%,transparent)] bg-[var(--md-surface-container)] p-3 shadow-[var(--md-elev-1)]">
              <p className="text-xs text-[var(--md-on-surface-variant)]">
                Signed in as
              </p>
              <p className="truncate text-sm font-medium text-[var(--md-on-surface)]">
                {user.name}
              </p>
            </div>
          ) : null}
        </aside>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col pb-[calc(5.75rem+env(safe-area-inset-bottom))] md:pb-0">
          <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-[var(--md-surface)] px-4 pb-4 pt-0 md:p-8">
            {children}
          </main>
        </div>
      </div>
      <MobileBottomNav />
    </div>
  );
}

export function Layout() {
  return (
    <LayoutContent>
      <Outlet />
    </LayoutContent>
  );
}
