import { formatInr, formatShortDate } from "../../../services/format";
import type { Category, Transaction } from "../../../services/types";

export interface TransactionTableProps {
  rows: Transaction[];
  categoriesById: Map<string, Category>;
  currency: string;
}

export function TransactionTable({
  rows,
  categoriesById,
  currency,
}: TransactionTableProps) {
  if (rows.length === 0) {
    return (
      <p className="md-card p-8 text-center text-sm text-[var(--md-on-surface-variant)]">
        No transactions match your filters.
      </p>
    );
  }

  return (
    <div className="md-table-shell">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-[color-mix(in_srgb,var(--md-outline-variant)_55%,transparent)] bg-[var(--md-surface-container-high)] text-xs font-semibold uppercase tracking-wide text-[var(--md-on-surface-variant)]">
            <tr>
              <th className="px-4 py-3 font-semibold">Date</th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 font-semibold">Type</th>
              <th className="px-4 py-3 font-semibold">Note</th>
              <th className="px-4 py-3 text-right font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[color-mix(in_srgb,var(--md-outline-variant)_45%,transparent)]">
            {rows.map((tx) => {
              const cat = categoriesById.get(tx.categoryId);
              return (
                <tr
                  key={tx._id}
                  className="transition-colors hover:bg-[color-mix(in_srgb,var(--md-primary)_6%,transparent)]"
                >
                  <td className="whitespace-nowrap px-4 py-3 text-[var(--md-on-surface-variant)]">
                    {formatShortDate(tx.date)}
                  </td>
                  <td className="px-4 py-3 text-[var(--md-on-surface)]">
                    {cat ? (
                      <span>
                        <span className="mr-1">{cat.icon}</span>
                        {cat.name}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        tx.type === "income"
                          ? "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium text-[var(--md-success)]"
                          : "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium text-[var(--md-error)]"
                      }
                      style={{
                        backgroundColor:
                          tx.type === "income"
                            ? "var(--md-success-container)"
                            : "var(--md-error-container)",
                      }}
                    >
                      {tx.type}
                    </span>
                  </td>
                  <td className="max-w-[220px] truncate px-4 py-3 text-[var(--md-on-surface-variant)]">
                    {tx.note || "—"}
                    {tx.tags.length > 0 ? (
                      <span className="ml-2 opacity-70">
                        [{tx.tags.join(", ")}]
                      </span>
                    ) : null}
                  </td>
                  <td
                    className={
                      tx.type === "income"
                        ? "px-4 py-3 text-right text-sm font-semibold tabular-nums text-[var(--md-success)]"
                        : "px-4 py-3 text-right text-sm font-semibold tabular-nums text-[var(--md-error)]"
                    }
                  >
                    {tx.type === "income" ? "+" : "−"}
                    {formatInr(tx.amount, currency)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
