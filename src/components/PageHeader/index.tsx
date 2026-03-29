import type { PageHeaderProps } from "./types";

/**
 * Page title region: on small screens it sticks to the top of the scroll area with
 * a frosted bar and accent rail; on `md+` it’s a normal static header (sidebar shows context).
 */
export function PageHeader({
  title,
  subtitle,
  icon,
  actions,
}: PageHeaderProps) {
  return (
    <header
      className={[
        "relative z-30 -mx-4 mb-6",
        "border-b border-[color-mix(in_srgb,var(--md-outline-variant)_40%,transparent)]",
        "bg-[color-mix(in_srgb,var(--md-surface)_88%,transparent)] backdrop-blur-2xl",
        "shadow-[0_14px_48px_-28px_rgba(0,0,0,0.35)]",
        "dark:shadow-[0_18px_56px_-24px_rgba(0,0,0,0.65)]",
        "px-4 pb-4 pt-[max(0.65rem,env(safe-area-inset-top))]",
        "sticky top-[0] isolate",
        "md:static md:z-auto md:mx-0 md:mb-8 md:border-0 md:bg-transparent md:px-0 md:pb-0 md:pt-0 md:shadow-none md:backdrop-blur-none",
      ].join(" ")}
    >
      {/* Soft wash — mobile only feel */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[color-mix(in_srgb,var(--md-primary)_10%,transparent)] via-transparent to-transparent md:hidden"
        aria-hidden
      />
      <div className="relative flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="flex min-w-0 gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--md-primary-container)] text-[var(--md-on-primary-container)] shadow-[var(--md-elev-1)] md:size-11">
            {icon}
          </div>
          <div className="min-w-0 flex-1 border-l-2 border-[color-mix(in_srgb,var(--md-primary)_55%,transparent)] pl-3 md:border-0 md:pl-0">
            <h1 className="md-page-title text-xl leading-tight tracking-tight md:text-2xl">
              {title}
            </h1>
            {subtitle ? (
              <div className="md-page-sub mt-1.5 text-sm leading-snug md:mt-1">
                {subtitle}
              </div>
            ) : null}
          </div>
        </div>
        {actions ? (
          <div className="hidden w-full shrink-0 flex-col gap-2 md:flex md:w-auto md:flex-row md:items-center">
            {actions}
          </div>
        ) : null}
      </div>
    </header>
  );
}
