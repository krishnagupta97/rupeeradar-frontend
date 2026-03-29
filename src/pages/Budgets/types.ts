import type { Budget, Category } from "../../services/types";

export interface BudgetRowView {
  budget: Budget;
  category: Category | undefined;
  spent: number;
  usagePercent: number;
  over: boolean;
}
