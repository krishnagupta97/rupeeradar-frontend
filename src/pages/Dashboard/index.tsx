import { ChartPie } from "@phosphor-icons/react";
import { useMemo } from "react";
import { useApp } from "../../contexts/useApp";
import { useFinanceData } from "../../contexts/useFinanceData";
import type { Transaction } from "../../services/types";
import { Skeleton } from "../../skeleton";
import type { MonthPoint } from "./types";
import { DashboardAnalysisCharts } from "./components/DashboardAnalysisCharts";
import { GoalsPreview } from "./components/GoalsPreview";
import { RecentTransactions } from "./components/RecentTransactions";
import { SummaryCards } from "./components/SummaryCards";

function monthKeyFromDate(iso: string): string {
  return iso.slice(0, 7);
}

function buildMonthPoints(transactions: Transaction[], count: number): MonthPoint[] {
  const byMonth = new Map<string, { expense: number; income: number }>();
  for (const tx of transactions) {
    const key = monthKeyFromDate(tx.date);
    const row = byMonth.get(key) ?? { expense: 0, income: 0 };
    if (tx.type === "expense") row.expense += tx.amount;
    else row.income += tx.amount;
    byMonth.set(key, row);
  }
  const keys = [...byMonth.keys()].sort();
  const slice = keys.slice(-count);
  return slice.map((key) => {
    const row = byMonth.get(key)!;
    const [y, m] = key.split("-").map(Number);
    const label = new Date(y, m - 1, 1).toLocaleDateString("en-IN", {
      month: "short",
    });
    return { key, label, expense: row.expense, income: row.income };
  });
}

export default function DashboardPage() {
  const { user } = useApp();
  const currency = user?.currency ?? "INR";
  const {
    transactions,
    categories,
    goals,
    loading,
    error,
  } = useFinanceData();

  const now = new Date();
  const currentPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const { incomeMonth, expenseMonth, categoriesById, monthPoints } = useMemo(() => {
    const map = new Map(categories.map((c) => [c._id, c]));
    let income = 0;
    let expense = 0;
    for (const tx of transactions) {
      if (!tx.date.startsWith(currentPrefix)) continue;
      if (tx.type === "income") income += tx.amount;
      else expense += tx.amount;
    }
    return {
      incomeMonth: income,
      expenseMonth: expense,
      categoriesById: map,
      monthPoints: buildMonthPoints(transactions, 6),
    };
  }, [transactions, categories, currentPrefix]);

  if (error && !loading && transactions.length === 0 && categories.length === 0) {
    return <div className="md-error-banner p-4 text-sm">{error}</div>;
  }

  if (loading) {
    return <Skeleton type="dashboard" />;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header className="flex items-start gap-3">
        <div className="flex size-11 items-center justify-center rounded-2xl bg-[var(--md-primary-container)] text-[var(--md-on-primary-container)] shadow-[var(--md-elev-1)]">
          <ChartPie className="size-6" weight="duotone" aria-hidden />
        </div>
        <div>
          <h1 className="md-page-title text-2xl">Dashboard</h1>
          <p className="md-page-sub mt-1 text-sm">
            Overview of this month and recent movement.
          </p>
        </div>
      </header>

      <SummaryCards
        income={incomeMonth}
        expense={expenseMonth}
        net={incomeMonth - expenseMonth}
        currency={currency}
      />

      <div className="grid gap-6 lg:grid-cols-5 lg:items-stretch">
        <div className="flex min-h-0 lg:col-span-3">
          <DashboardAnalysisCharts
            className="min-w-0 flex-1"
            monthPoints={monthPoints}
            transactions={transactions}
            categories={categories}
            currentMonthPrefix={currentPrefix}
            currency={currency}
          />
        </div>
        <div className="flex min-h-0 lg:col-span-2">
          <GoalsPreview
            className="min-w-0 flex-1"
            goals={goals}
            currency={currency}
            showManageLink
          />
        </div>
      </div>

      <RecentTransactions
        transactions={transactions}
        categoriesById={categoriesById}
        currency={currency}
      />
    </div>
  );
}
