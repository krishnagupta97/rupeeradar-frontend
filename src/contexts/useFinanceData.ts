import { useContext } from "react";
import { FinanceDataContext } from "./financeContext";
import type { FinanceDataContextValue } from "./financeTypes";

export function useFinanceData(): FinanceDataContextValue {
  const ctx = useContext(FinanceDataContext);
  if (!ctx) {
    throw new Error("useFinanceData must be used within FinanceDataProvider");
  }
  return ctx;
}
