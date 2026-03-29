import { ClockCounterClockwise } from "@phosphor-icons/react";
import { formatInr, formatShortDate } from "../../../services/format";
import type { Category, Transaction } from "../../../services/types";

export interface RecentTransactionsProps {
  transactions: Transaction[];
  categoriesById: Map<string, Category>;
  currency: string;
}

export function RecentTransactions({
  transactions,
  categoriesById,
  currency,
}: RecentTransactionsProps) {
  const sorted = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  const top = sorted.slice(0, 6);

  return (
    <div className="md-card p-5">
      <div className="flex items-center gap-2">
        <ClockCounterClockwise
          className="size-5 text-[var(--md-primary)]"
          weight="duotone"
          aria-hidden
        />
        <div>
          <h2 className="text-base font-medium text-[var(--md-on-surface)]">
            Recent activity
          </h2>
          <p className="text-sm text-[var(--md-on-surface-variant)]">
            Latest ledger entries
          </p>
        </div>
      </div>
      <ul className="mt-4 divide-y divide-[color-mix(in_srgb,var(--md-outline-variant)_55%,transparent)]">
        {top.map((tx) => {
          const cat = categoriesById.get(tx.categoryId);
          return (
            <li
              key={tx._id}
              className="flex items-center justify-between gap-3 py-3 first:pt-0"
            >
              <div className="min-w-0">
                <p className="truncate text-sm text-[var(--md-on-surface)]">
                  {cat ? `${cat.icon} ${cat.name}` : "Uncategorised"}
                </p>
                <p className="truncate text-xs text-[var(--md-on-surface-variant)]">
                  {formatShortDate(tx.date)}
                  {tx.note ? ` · ${tx.note}` : ""}
                </p>
              </div>
              <span
                className={
                  tx.type === "income"
                    ? "shrink-0 text-sm font-medium tabular-nums text-[var(--md-success)]"
                    : "shrink-0 text-sm font-medium tabular-nums text-[var(--md-error)]"
                }
              >
                {tx.type === "income" ? "+" : "−"}
                {formatInr(tx.amount, currency)}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
