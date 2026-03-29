import type { Budget, Category, Goal, Transaction } from "../services/types";

export interface NewTransactionInput {
  categoryId: string;
  type: "income" | "expense";
  amount: number;
  date: string;
  note: string;
  tags: string;
}

export interface NewBudgetInput {
  categoryId: string;
  limitAmount: number;
  period: Budget["period"];
  alertAt: number;
}

export interface NewGoalInput {
  name: string;
  targetAmount: number;
  deadline: string;
}

export interface FinanceDataContextValue {
  categories: Category[];
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  addTransaction: (input: NewTransactionInput) => void;
  addBudget: (input: NewBudgetInput) => void;
  addGoal: (input: NewGoalInput) => void;
}
