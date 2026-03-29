import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { MOCK_USER_ID } from "../static";
import { endpoints } from "../services/endpoints";
import { get } from "../services/networkHandler";
import type {
  Budget,
  Category,
  Goal,
  Transaction,
  TransactionTemplate,
} from "../services/types";
import { useApp } from "./useApp";
import { FinanceDataContext } from "./financeContext";
import type {
  FinanceDataContextValue,
  NewBudgetInput,
  NewGoalInput,
  NewTransactionInput,
  NewTransactionTemplateInput,
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
  const [transactionTemplates, setTransactionTemplates] = useState<
    TransactionTemplate[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (options?: { silent?: boolean }) => {
    const silent = options?.silent ?? false;
    setError(null);
    if (!silent) setLoading(true);
    try {
      const [c, t, b, g, tpl] = await Promise.all([
        get<Category[]>(endpoints.CATEGORIES),
        get<Transaction[]>(endpoints.TRANSACTIONS),
        get<Budget[]>(endpoints.BUDGETS),
        get<Goal[]>(endpoints.GOALS),
        get<TransactionTemplate[]>(endpoints.TRANSACTION_TEMPLATES),
      ]);
      setCategories(c);
      setTransactions(t);
      setBudgets(b);
      setGoals(g);
      setTransactionTemplates(tpl);
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

  const addTransactionTemplate = useCallback(
    (input: NewTransactionTemplateInput) => {
      const row: TransactionTemplate = {
        _id: newId("tpl"),
        userId,
        name: input.name.trim(),
        categoryId: input.categoryId,
        type: input.type,
        amount: input.amount,
        note: input.note.trim(),
        tags: input.tags.trim(),
        pinSlot: input.pinSlot ?? null,
      };
      setTransactionTemplates((prev) => {
        if (row.pinSlot === null) return [...prev, row];
        return [
          ...prev.map((p) =>
            p.pinSlot === row.pinSlot ? { ...p, pinSlot: null } : p,
          ),
          row,
        ];
      });
    },
    [userId],
  );

  const updateTransactionTemplate = useCallback(
    (id: string, input: Partial<NewTransactionTemplateInput>) => {
      setTransactionTemplates((prev) =>
        prev.map((t) => {
          if (t._id !== id) return t;
          const next = { ...t };
          if (input.name !== undefined) next.name = input.name.trim();
          if (input.categoryId !== undefined) next.categoryId = input.categoryId;
          if (input.type !== undefined) next.type = input.type;
          if (input.amount !== undefined) next.amount = input.amount;
          if (input.note !== undefined) next.note = input.note.trim();
          if (input.tags !== undefined) next.tags = input.tags.trim();
          if (input.pinSlot !== undefined) next.pinSlot = input.pinSlot;
          return next;
        }),
      );
    },
    [],
  );

  const removeTransactionTemplate = useCallback((id: string) => {
    setTransactionTemplates((prev) => prev.filter((t) => t._id !== id));
  }, []);

  const setTemplatePinSlot = useCallback(
    (id: string, slot: TransactionTemplate["pinSlot"]) => {
      setTransactionTemplates((prev) => {
        const next = prev.map((t) => ({ ...t }));
        if (slot !== null) {
          for (const t of next) {
            if (t.pinSlot === slot && t._id !== id) t.pinSlot = null;
          }
        }
        const idx = next.findIndex((t) => t._id === id);
        if (idx >= 0) next[idx] = { ...next[idx], pinSlot: slot };
        return next;
      });
    },
    [],
  );

  const applyTemplate = useCallback(
    (template: TransactionTemplate) => {
      const date = new Date().toISOString().slice(0, 10);
      addTransaction({
        categoryId: template.categoryId,
        type: template.type,
        amount: template.amount,
        date,
        note: template.note,
        tags: template.tags,
      });
    },
    [addTransaction],
  );

  const value = useMemo<FinanceDataContextValue>(
    () => ({
      categories,
      transactions,
      budgets,
      goals,
      transactionTemplates,
      loading,
      error,
      refresh,
      addTransaction,
      addBudget,
      addGoal,
      addTransactionTemplate,
      updateTransactionTemplate,
      removeTransactionTemplate,
      setTemplatePinSlot,
      applyTemplate,
    }),
    [
      categories,
      transactions,
      budgets,
      goals,
      transactionTemplates,
      loading,
      error,
      refresh,
      addTransaction,
      addBudget,
      addGoal,
      addTransactionTemplate,
      updateTransactionTemplate,
      removeTransactionTemplate,
      setTemplatePinSlot,
      applyTemplate,
    ],
  );

  return (
    <FinanceDataContext.Provider value={value}>
      {children}
    </FinanceDataContext.Provider>
  );
}
