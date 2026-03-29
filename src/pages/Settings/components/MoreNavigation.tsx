import {
  CaretRight,
  ChartLineUp,
  ClipboardText,
  Target,
} from "@phosphor-icons/react";
import { NavLink } from "react-router-dom";

const links = [
  {
    to: "/goals",
    label: "Goals",
    description: "Targets & savings",
    Icon: Target,
  },
  {
    to: "/reports",
    label: "Reports",
    description: "Trends & insights",
    Icon: ChartLineUp,
  },
  {
    to: "/templates",
    label: "Templates",
    description: "Quick repeat transactions",
    Icon: ClipboardText,
  },
] as const;

/** Shown only on small screens: extra routes that are not in the bottom bar. */
export function MoreNavigation() {
  return (
    <section className="md-card p-4 md:hidden">
      <h2 className="text-base font-medium text-[var(--md-on-surface)]">
        More
      </h2>
      <p className="mt-0.5 text-sm text-[var(--md-on-surface-variant)]">
        Goals, reports, and templates (full nav on larger screens).
      </p>
      <ul className="mt-4 space-y-2">
        {links.map(({ to, label, description, Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                [
                  "flex cursor-pointer items-center gap-3 rounded-xl border border-[color-mix(in_srgb,var(--md-outline-variant)_50%,transparent)] bg-[var(--md-surface-container-high)] px-4 py-3 shadow-[var(--md-elev-1)] transition-colors",
                  isActive
                    ? "border-[color-mix(in_srgb,var(--md-primary)_45%,transparent)] ring-1 ring-[color-mix(in_srgb,var(--md-primary)_35%,transparent)]"
                    : "hover:bg-[color-mix(in_srgb,var(--md-primary)_8%,transparent)]",
                ].join(" ")
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={[
                      "flex size-10 shrink-0 items-center justify-center rounded-xl",
                      isActive
                        ? "bg-[var(--md-primary-container)] text-[var(--md-on-primary-container)]"
                        : "bg-[var(--md-surface-container)] text-[var(--md-on-surface-variant)]",
                    ].join(" ")}
                  >
                    <Icon
                      className="size-5"
                      weight={isActive ? "fill" : "duotone"}
                      aria-hidden
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-[var(--md-on-surface)]">
                      {label}
                    </p>
                    <p className="text-xs text-[var(--md-on-surface-variant)]">
                      {description}
                    </p>
                  </div>
                  <CaretRight
                    className="size-5 shrink-0 text-[var(--md-on-surface-variant)]"
                    weight="bold"
                    aria-hidden
                  />
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </section>
  );
}
