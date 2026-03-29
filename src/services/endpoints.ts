export const endpoints = {
  USER_ME: "/api/users/me",
  CATEGORIES: "/api/categories",
  TRANSACTIONS: "/api/transactions",
  BUDGETS: "/api/budgets",
  RECURRING_RULES: "/api/recurring-rules",
  GOALS: "/api/goals",
  TRANSACTION_TEMPLATES: "/api/transaction-templates",
} as const;

export type Endpoint = (typeof endpoints)[keyof typeof endpoints];
