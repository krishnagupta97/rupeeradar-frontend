export type Id = string;

export interface User {
  _id: Id;
  name: string;
  email: string;
  currency: string;
  timezone: string;
  createdAt: string;
}

export interface Category {
  _id: Id;
  userId: Id;
  name: string;
  icon: string;
  color: string;
  type: "income" | "expense";
  isDefault: boolean;
}

export interface Transaction {
  _id: Id;
  userId: Id;
  categoryId: Id;
  recurringId: Id | null;
  type: "income" | "expense";
  amount: number;
  date: string;
  note: string;
  tags: string[];
  createdAt: string;
}

export interface Budget {
  _id: Id;
  userId: Id;
  categoryId: Id;
  limitAmount: number;
  period: "weekly" | "monthly" | "yearly";
  alertAt: number;
}

export interface RecurringRule {
  _id: Id;
  userId: Id;
  categoryId: Id;
  name: string;
  amount: number;
  type: "income" | "expense";
  frequency: "daily" | "weekly" | "monthly" | "yearly";
  nextDueDate: string;
  isActive: boolean;
}

export interface Goal {
  _id: Id;
  userId: Id;
  name: string;
  targetAmount: number;
  savedAmount: number;
  deadline: string;
  status: "active" | "paused" | "completed";
}

/** Saved shortcut for repeat transactions (e.g. daily commute). */
export interface TransactionTemplate {
  _id: Id;
  userId: Id;
  name: string;
  categoryId: Id;
  type: "income" | "expense";
  amount: number;
  note: string;
  /** Comma-separated style stored as single string until API exists. */
  tags: string;
  /** Quick-add dock position on mobile/desktop; at most one template per slot. */
  pinSlot: 0 | 1 | 2 | null;
}
