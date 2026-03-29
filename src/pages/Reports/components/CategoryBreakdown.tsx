import { formatInr } from "../../../services/format";
import type { CategorySlice } from "../types";

export interface CategoryBreakdownProps {
  slices: CategorySlice[];
  total: number;
  currency: string;
}

export function CategoryBreakdown({
  slices,
  total,
  currency,
}: CategoryBreakdownProps) {
  if (slices.length === 0) {
    return (
      <p className="text-sm text-[var(--md-on-surface-variant)]">
        No expense data for this month.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {slices.map((s) => (
        <div key={s.categoryId}>
          <div className="flex items-center justify-between gap-2 text-sm">
            <span className="text-[var(--md-on-surface)]">
              <span className="mr-1">{s.icon}</span>
              {s.label}
            </span>
            <span className="tabular-nums text-[var(--md-on-surface-variant)]">
              {formatInr(s.amount, currency)}{" "}
              <span className="opacity-70">({s.percent}%)</span>
            </span>
          </div>
          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-[var(--md-surface-container-high)] shadow-inner">
            <div
              className="h-full rounded-full shadow-[var(--md-elev-1)]"
              style={{
                width: `${total > 0 ? (s.amount / total) * 100 : 0}%`,
                backgroundColor: s.color,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
