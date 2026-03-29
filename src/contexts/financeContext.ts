import { createContext } from "react";
import type { FinanceDataContextValue } from "./financeTypes";

export const FinanceDataContext =
  createContext<FinanceDataContextValue | null>(null);
