import {
  ChartPie,
  ChartLineUp,
  GearSix,
  ListBullets,
  Target,
  Wallet,
} from "@phosphor-icons/react";
import { NavLink, Outlet } from "react-router-dom";
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
    <div className="md-app min-h-screen">
      <div className="flex min-h-screen">
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

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-[color-mix(in_srgb,var(--md-outline-variant)_55%,transparent)] bg-[var(--md-surface-container)] px-4 py-3 shadow-[var(--md-elev-1)] md:hidden">
            <span className="text-sm font-semibold text-[var(--md-primary)]">
              RupeeRadar
            </span>
          </header>
          <div className="border-b border-[color-mix(in_srgb,var(--md-outline-variant)_55%,transparent)] bg-[var(--md-surface-container)] px-3 py-2 md:hidden">
            <nav className="flex gap-2 overflow-x-auto pb-1">
              {nav.map((item) => {
                const Icon = item.Icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === "/"}
                    className={({ isActive }) =>
                      [
                        "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all",
                        isActive ? "md-chip-active" : "md-chip-idle",
                      ].join(" ")
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon
                          className="size-3.5"
                          weight={isActive ? "fill" : "regular"}
                          aria-hidden
                        />
                        {item.label}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>
          <main className="flex-1 overflow-auto bg-[var(--md-surface)] p-4 md:p-8">
            {children}
          </main>
        </div>
      </div>
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
