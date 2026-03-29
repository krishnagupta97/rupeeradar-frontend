import { ChartLineUp } from "@phosphor-icons/react";
import { useMemo } from "react";
import { useApp } from "../../contexts/useApp";
import { useFinanceData } from "../../contexts/useFinanceData";
import { Skeleton } from "../../skeleton";
import type { CategorySlice } from "./types";
import { CategoryBreakdown } from "./components/CategoryBreakdown";

export default function ReportsPage() {
  const { user } = useApp();
  const currency = user?.currency ?? "INR";
  const { transactions, categories, loading, error } = useFinanceData();

  const currentPrefix = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  }, []);

  const { slices, totalExpense } = useMemo(() => {
    const catMap = new Map(categories.map((c) => [c._id, c]));
    const byCat = new Map<string, number>();
    for (const tx of transactions) {
      if (tx.type !== "expense" || !tx.date.startsWith(currentPrefix)) continue;
      byCat.set(tx.categoryId, (byCat.get(tx.categoryId) ?? 0) + tx.amount);
    }
    const total = [...byCat.values()].reduce((a, b) => a + b, 0);
    const list: CategorySlice[] = [...byCat.entries()]
      .map(([categoryId, amount]) => {
        const c = catMap.get(categoryId);
        return {
          categoryId,
          label: c?.name ?? "Unknown",
          icon: c?.icon ?? "•",
          color: c?.color ?? "#71717a",
          amount,
          percent: total > 0 ? Math.round((amount / total) * 100) : 0,
        };
      })
      .sort((a, b) => b.amount - a.amount);
    return { slices: list, totalExpense: total };
  }, [transactions, categories, currentPrefix]);

  if (error && !loading && transactions.length === 0) {
    return <div className="md-error-banner p-4 text-sm">{error}</div>;
  }

  if (loading) {
    return <Skeleton type="reports" />;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header className="flex items-start gap-3">
        <div className="flex size-11 items-center justify-center rounded-2xl bg-[var(--md-primary-container)] text-[var(--md-on-primary-container)] shadow-[var(--md-elev-1)]">
          <ChartLineUp className="size-6" weight="duotone" aria-hidden />
        </div>
        <div>
          <h1 className="md-page-title text-2xl">Reports</h1>
          <p className="md-page-sub mt-1 text-sm">
            Expense mix for the current month.
          </p>
        </div>
      </header>

      <section className="md-card p-6">
        <h2 className="text-base font-medium text-[var(--md-on-surface)]">
          Spending by category
        </h2>
        <p className="mt-1 text-sm text-[var(--md-on-surface-variant)]">
          Share of expenses this month
        </p>
        <div className="mt-5">
          <CategoryBreakdown
            slices={slices}
            total={totalExpense}
            currency={currency}
          />
        </div>
      </section>
    </div>
  );
}
