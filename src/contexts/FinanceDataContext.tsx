import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { MOCK_USER_ID } from "../static";
import { endpoints } from "../services/endpoints";
import { get } from "../services/networkHandler";
import type { Budget, Category, Goal, Transaction } from "../services/types";
import { useApp } from "./useApp";
import { FinanceDataContext } from "./financeContext";
import type {
  FinanceDataContextValue,
  NewBudgetInput,
  NewGoalInput,
  NewTransactionInput,
} from "./financeTypes";

function newId(prefix: string): string {
  return `${prefix}_${globalThis.crypto?.randomUUID?.() ?? String(Date.now())}`;
}

function parseTags(raw: string): string[] {
  return raw
    .split(/[,#]/g)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function FinanceDataProvider({ children }: { children: ReactNode }) {
  const { user } = useApp();
  const userId = user?._id ?? MOCK_USER_ID;

  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (options?: { silent?: boolean }) => {
    const silent = options?.silent ?? false;
    setError(null);
    if (!silent) setLoading(true);
    try {
      const [c, t, b, g] = await Promise.all([
        get<Category[]>(endpoints.CATEGORIES),
        get<Transaction[]>(endpoints.TRANSACTIONS),
        get<Budget[]>(endpoints.BUDGETS),
        get<Goal[]>(endpoints.GOALS),
      ]);
      setCategories(c);
      setTransactions(t);
      setBudgets(b);
      setGoals(g);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load finance data");
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const refresh = useCallback(() => load({ silent: true }), [load]);

  const addTransaction = useCallback(
    (input: NewTransactionInput) => {
      const row: Transaction = {
        _id: newId("tx"),
        userId,
        categoryId: input.categoryId,
        recurringId: null,
        type: input.type,
        amount: input.amount,
        date: input.date,
        note: input.note.trim(),
        tags: parseTags(input.tags),
        createdAt: new Date().toISOString(),
      };
      setTransactions((prev) => [row, ...prev]);
    },
    [userId],
  );

  const addBudget = useCallback(
    (input: NewBudgetInput) => {
      const row: Budget = {
        _id: newId("bud"),
        userId,
        categoryId: input.categoryId,
        limitAmount: input.limitAmount,
        period: input.period,
        alertAt: input.alertAt,
      };
      setBudgets((prev) => [...prev, row]);
    },
    [userId],
  );

  const addGoal = useCallback(
    (input: NewGoalInput) => {
      const row: Goal = {
        _id: newId("goal"),
        userId,
        name: input.name.trim(),
        targetAmount: input.targetAmount,
        savedAmount: 0,
        deadline: input.deadline,
        status: "active",
      };
      setGoals((prev) => [...prev, row]);
    },
    [userId],
  );

  const value = useMemo<FinanceDataContextValue>(
    () => ({
      categories,
      transactions,
      budgets,
      goals,
      loading,
      error,
      refresh,
      addTransaction,
      addBudget,
      addGoal,
    }),
    [
      categories,
      transactions,
      budgets,
      goals,
      loading,
      error,
      refresh,
      addTransaction,
      addBudget,
      addGoal,
    ],
  );

  return (
    <FinanceDataContext.Provider value={value}>
      {children}
    </FinanceDataContext.Provider>
  );
}
