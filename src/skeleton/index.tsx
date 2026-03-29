import { BudgetsSkeleton } from "./components/BudgetsSkeleton";
import { DashboardSkeleton } from "./components/DashboardSkeleton";
import { GoalsSkeleton } from "./components/GoalsSkeleton";
import { ReportsSkeleton } from "./components/ReportsSkeleton";
import { SettingsSkeleton } from "./components/SettingsSkeleton";
import { TransactionsSkeleton } from "./components/TransactionsSkeleton";
import type { SkeletonPageType } from "./types";

export type { SkeletonPageType } from "./types";

export function Skeleton({ type }: { type: SkeletonPageType }) {
  switch (type) {
    case "dashboard":
      return <DashboardSkeleton />;
    case "transactions":
      return <TransactionsSkeleton />;
    case "budgets":
      return <BudgetsSkeleton />;
    case "reports":
      return <ReportsSkeleton />;
    case "settings":
      return <SettingsSkeleton />;
    case "goals":
      return <GoalsSkeleton />;
    default: {
      const _exhaustive: never = type;
      return _exhaustive;
    }
  }
}
