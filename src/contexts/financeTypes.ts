import type {
  Budget,
  Category,
  Goal,
  Transaction,
  TransactionTemplate,
} from "../services/types";

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

export interface NewTransactionTemplateInput {
  name: string;
  categoryId: string;
  type: "income" | "expense";
  amount: number;
  note: string;
  tags: string;
  pinSlot?: TransactionTemplate["pinSlot"];
}

export interface FinanceDataContextValue {
  categories: Category[];
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
  transactionTemplates: TransactionTemplate[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  addTransaction: (input: NewTransactionInput) => void;
  addBudget: (input: NewBudgetInput) => void;
  addGoal: (input: NewGoalInput) => void;
  addTransactionTemplate: (input: NewTransactionTemplateInput) => void;
  updateTransactionTemplate: (
    id: string,
    input: Partial<NewTransactionTemplateInput>,
  ) => void;
  removeTransactionTemplate: (id: string) => void;
  setTemplatePinSlot: (
    id: string,
    slot: TransactionTemplate["pinSlot"],
  ) => void;
  applyTemplate: (template: TransactionTemplate) => void;
}
