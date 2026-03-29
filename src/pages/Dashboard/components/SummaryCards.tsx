import { formatInr } from "../../../services/format";

export interface SummaryCardsProps {
  income: number;
  expense: number;
  net: number;
  currency: string;
}

export function SummaryCards({
  income,
  expense,
  net,
  currency,
}: SummaryCardsProps) {
  const items = [
    {
      label: "Income (this month)",
      value: income,
      accent: "text-[var(--md-success)]",
    },
    {
      label: "Expenses (this month)",
      value: expense,
      accent: "text-[var(--md-error)]",
    },
    {
      label: "Net",
      value: net,
      accent:
        net >= 0
          ? "text-[var(--md-primary)]"
          : "text-[var(--md-warning)]",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {items.map((item) => (
        <div key={item.label} className="md-card p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--md-on-surface-variant)]">
            {item.label}
          </p>
          <p
            className={`mt-3 text-2xl font-medium tabular-nums tracking-tight ${item.accent}`}
          >
            {formatInr(item.value, currency)}
          </p>
        </div>
      ))}
    </div>
  );
}
