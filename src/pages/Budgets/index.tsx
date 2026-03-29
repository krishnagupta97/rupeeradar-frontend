import { Plus, Wallet } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { Button } from "../../components/Button";
import { MobileAddFab } from "../../components/MobileAddFab";
import { PageHeader } from "../../components/PageHeader";
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
      <PageHeader
        title="Budgets"
        subtitle="Monthly limits and spend for this calendar month."
        icon={
          <Wallet className="size-5 md:size-6" weight="duotone" aria-hidden />
        }
        actions={
          <Button
            type="button"
            variant="primary"
            onClick={() => {
              setBudgetModalKey((k) => k + 1);
              setModalOpen(true);
            }}
          >
            <Plus className="size-5" weight="bold" />
            Add budget
          </Button>
        }
      />

      <MobileAddFab
        label="Add budget"
        onClick={() => {
          setBudgetModalKey((k) => k + 1);
          setModalOpen(true);
        }}
      />

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
