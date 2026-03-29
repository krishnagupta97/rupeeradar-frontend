import {
  ChartPie,
  GearSix,
  ListBullets,
  Wallet,
} from "@phosphor-icons/react";
import { NavLink, useLocation } from "react-router-dom";

const items = [
  { to: "/", label: "Dashboard", Icon: ChartPie, end: true },
  { to: "/transactions", label: "Transactions", Icon: ListBullets },
  { to: "/budgets", label: "Budgets", Icon: Wallet },
  { to: "/settings", label: "Settings", Icon: GearSix },
] as const;

type NavItem = (typeof items)[number];

/** Goals, reports & templates live under Settings on small screens. */
function isSettingsGroup(pathname: string): boolean {
  return (
    pathname === "/settings" ||
    pathname === "/goals" ||
    pathname === "/reports" ||
    pathname === "/templates"
  );
}

function tabActive(pathname: string, item: NavItem): boolean {
  if (item.to === "/settings") {
    return isSettingsGroup(pathname);
  }
  if ("end" in item && item.end) {
    return pathname === "/" || pathname === "";
  }
  return pathname === item.to || pathname.startsWith(`${item.to}/`);
}

export function MobileBottomNav() {
  const { pathname } = useLocation();

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 md:hidden"
      style={{
        paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))",
      }}
    >
      <nav
        className="pointer-events-auto mx-auto max-w-md px-3"
        aria-label="Main navigation"
      >
        <div
          className="flex items-stretch gap-0.5 rounded-2xl border border-[color-mix(in_srgb,var(--md-outline-variant)_40%,transparent)] bg-[color-mix(in_srgb,var(--md-surface-container-high)_88%,transparent)] p-1.5 shadow-[0_-8px_32px_rgba(0,0,0,0.12)] backdrop-blur-xl dark:shadow-[0_-8px_36px_rgba(0,0,0,0.45)]"
        >
          <ul className="flex min-h-[3.25rem] flex-1 items-stretch">
            {items.map((item) => {
              const Icon = item.Icon;
              const active = tabActive(pathname, item);
              return (
                <li key={item.to} className="min-w-0 flex-1">
                  <NavLink
                    to={item.to}
                    end={"end" in item ? item.end : false}
                    className={[
                      "flex h-full min-h-[3.25rem] flex-col items-center justify-center gap-1 rounded-xl px-1 py-1.5 transition-[background-color,color,transform] duration-200 active:scale-[0.97]",
                      active
                        ? "bg-[var(--md-primary-container)] text-[var(--md-on-primary-container)] shadow-[var(--md-elev-1)]"
                        : "text-[var(--md-on-surface-variant)] hover:bg-[color-mix(in_srgb,var(--md-on-surface)_6%,transparent)] hover:text-[var(--md-on-surface)]",
                    ].join(" ")}
                  >
                    <Icon
                      className="size-[1.35rem] shrink-0"
                      weight={active ? "fill" : "duotone"}
                      aria-hidden
                    />
                    <span className="max-w-full truncate text-center text-[10px] font-semibold leading-tight tracking-tight">
                      {item.label}
                    </span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </div>
  );
}
