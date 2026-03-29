import { formatInr } from "../../../services/format";
import type { BudgetRowView } from "../types";

export interface BudgetCardProps {
  row: BudgetRowView;
  currency: string;
}

export function BudgetCard({ row, currency }: BudgetCardProps) {
  const { budget, category, spent, usagePercent, over } = row;
  const bar = Math.min(100, usagePercent);
  const label = category
    ? `${category.icon} ${category.name}`
    : "Unknown category";

  return (
    <article className="md-card p-5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-medium text-[var(--md-on-surface)]">{label}</h3>
          <p className="mt-0.5 text-xs capitalize text-[var(--md-on-surface-variant)]">
            {budget.period} · alert at {budget.alertAt}%
          </p>
        </div>
        <span
          className="shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold"
          style={{
            backgroundColor: over
              ? "var(--md-error-container)"
              : usagePercent >= budget.alertAt
                ? "var(--md-warning-container)"
                : "var(--md-success-container)",
            color: over
              ? "var(--md-error)"
              : usagePercent >= budget.alertAt
                ? "var(--md-warning)"
                : "var(--md-success)",
          }}
        >
          {over ? "Over limit" : usagePercent >= budget.alertAt ? "Watch" : "On track"}
        </span>
      </div>
      <div className="mt-4 flex items-end justify-between gap-2 text-sm">
        <div>
          <p className="text-xs font-medium text-[var(--md-on-surface-variant)]">
            Spent
          </p>
          <p className="mt-0.5 font-semibold tabular-nums text-[var(--md-on-surface)]">
            {formatInr(spent, currency)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs font-medium text-[var(--md-on-surface-variant)]">
            Limit
          </p>
          <p className="mt-0.5 font-semibold tabular-nums text-[var(--md-on-surface-variant)]">
            {formatInr(budget.limitAmount, currency)}
          </p>
        </div>
      </div>
      <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-[var(--md-surface-container-high)] shadow-inner">
        <div
          className="h-full rounded-full shadow-[var(--md-elev-1)] transition-all"
          style={{
            width: `${bar}%`,
            backgroundColor: over
              ? "var(--md-error)"
              : "var(--md-primary)",
          }}
        />
      </div>
      <p className="mt-2 text-xs text-[var(--md-on-surface-variant)]">
        {usagePercent}% of budget used
      </p>
    </article>
  );
}
