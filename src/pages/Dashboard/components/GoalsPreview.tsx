import { CaretRight, Target } from "@phosphor-icons/react";
import { ButtonLink } from "../../../components/Button";
import { formatInr } from "../../../services/format";
import type { Goal } from "../../../services/types";

export interface GoalsPreviewProps {
  goals: Goal[];
  currency: string;
  /** When true, show a link to the full Goals page (e.g. on dashboard). */
  showManageLink?: boolean;
  className?: string;
}

export function GoalsPreview({
  goals,
  currency,
  showManageLink = false,
  className = "",
}: GoalsPreviewProps) {
  const active = goals.filter((g) => g.status === "active");

  return (
    <div
      className={`md-card flex h-full min-h-0 w-full flex-col p-5 ${className}`}
    >
      <div className="flex shrink-0 items-center gap-2">
        <Target
          className="size-5 text-[var(--md-primary)]"
          weight="duotone"
          aria-hidden
        />
        <div>
          <h2 className="text-base font-medium text-[var(--md-on-surface)]">
            Goals
          </h2>
          <p className="text-sm text-[var(--md-on-surface-variant)]">
            Progress toward targets
          </p>
        </div>
      </div>
      <ul className="mt-4 min-h-0 flex-1 space-y-4 overflow-y-auto">
        {active.map((g) => {
          const pct = Math.min(
            100,
            Math.round((g.savedAmount / g.targetAmount) * 100),
          );
          return (
            <li key={g._id}>
              <div className="flex items-center justify-between gap-2 text-sm">
                <span className="font-medium text-[var(--md-on-surface)]">
                  {g.name}
                </span>
                <span className="tabular-nums text-[var(--md-on-surface-variant)]">
                  {formatInr(g.savedAmount, currency)} /{" "}
                  {formatInr(g.targetAmount, currency)}
                </span>
              </div>
              <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-[var(--md-surface-container-high)] shadow-inner">
                <div
                  className="h-full rounded-full bg-[var(--md-primary)] shadow-[var(--md-elev-1)] transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="mt-1 text-[11px] text-[var(--md-on-surface-variant)]">
                {pct}% saved
              </p>
            </li>
          );
        })}
      </ul>
      {showManageLink ? (
        <ButtonLink
          to="/goals"
          variant="text"
          className="mt-auto shrink-0 justify-start gap-1 self-start px-0 py-2 pt-4 hover:bg-transparent hover:underline"
        >
          Manage goals
          <CaretRight className="size-4" weight="bold" aria-hidden />
        </ButtonLink>
      ) : null}
    </div>
  );
}
