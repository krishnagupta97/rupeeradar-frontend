import { Plus, Wallet } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { Button } from "../../components/Button";
import { useApp } from "../../contexts/useApp";
import { useFinanceData } from "../../contexts/useFinanceData";
import type { Budget, Transaction } from "../../services/types";
import { Skeleton } from "../../skeleton";
import type { BudgetRowView } from "./types";
import { AddBudgetModal } from "./components/AddBudgetModal";
import { BudgetCard } from "./components/BudgetCard";

function spendInMonthForCategory(
  transactions: Transaction[],
  categoryId: string,
  year: number,
  monthIndex0: number,
): number {
  const prefix = `${year}-${String(monthIndex0 + 1).padStart(2, "0")}`;
  return transactions
    .filter(
      (tx) =>
        tx.categoryId === categoryId &&
        tx.type === "expense" &&
        tx.date.startsWith(prefix),
    )
    .reduce((s, tx) => s + tx.amount, 0);
}

export default function BudgetsPage() {
  const { user } = useApp();
  const currency = user?.currency ?? "INR";
  const {
    budgets,
    categories,
    transactions,
    loading,
    error,
    addBudget,
  } = useFinanceData();
  const [modalOpen, setModalOpen] = useState(false);
  const [budgetModalKey, setBudgetModalKey] = useState(0);

  const { year, month } = useMemo(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  }, []);

  const rows: BudgetRowView[] = useMemo(() => {
    const catMap = new Map(categories.map((c) => [c._id, c]));
    return budgets.map((budget: Budget) => {
      const spent = spendInMonthForCategory(
        transactions,
        budget.categoryId,
        year,
        month,
      );
      const usagePercent =
        budget.limitAmount > 0
          ? Math.round((spent / budget.limitAmount) * 100)
          : 0;
      return {
        budget,
        category: catMap.get(budget.categoryId),
        spent,
        usagePercent,
        over: spent > budget.limitAmount,
      };
    });
  }, [budgets, categories, transactions, year, month]);

  if (error && !loading && budgets.length === 0) {
    return <div className="md-error-banner p-4 text-sm">{error}</div>;
  }

  if (loading) {
    return <Skeleton type="budgets" />;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-[var(--md-primary-container)] text-[var(--md-on-primary-container)] shadow-[var(--md-elev-1)]">
            <Wallet className="size-6" weight="duotone" aria-hidden />
          </div>
          <div>
            <h1 className="md-page-title text-2xl">Budgets</h1>
            <p className="md-page-sub mt-1 text-sm">
              Monthly limits and spend for this calendar month.
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="primary"
          className="self-start"
          onClick={() => {
            setBudgetModalKey((k) => k + 1);
            setModalOpen(true);
          }}
        >
          <Plus className="size-5" weight="bold" />
          Add budget
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((row) => (
          <BudgetCard key={row.budget._id} row={row} currency={currency} />
        ))}
      </div>

      {modalOpen ? (
        <AddBudgetModal
          key={budgetModalKey}
          open
          onClose={() => setModalOpen(false)}
          categories={categories}
          existingBudgets={budgets}
          onAdd={addBudget}
        />
      ) : null}
    </div>
  );
}
