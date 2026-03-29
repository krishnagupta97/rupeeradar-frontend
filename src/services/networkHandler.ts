import {
  mockBudgets,
  mockCategories,
  mockGoals,
  mockRecurringRules,
  mockTransactions,
  mockUser,
} from "../static";
import type { Endpoint } from "./endpoints";

const MOCK_LATENCY_MS = 120;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function clone<T>(value: T): T {
  return structuredClone(value);
}

function resolveMockGet(url: string): unknown {
  switch (url) {
    case "/api/users/me":
      return mockUser;
    case "/api/categories":
      return mockCategories;
    case "/api/transactions":
      return mockTransactions;
    case "/api/budgets":
      return mockBudgets;
    case "/api/recurring-rules":
      return mockRecurringRules;
    case "/api/goals":
      return mockGoals;
    default:
      return undefined;
  }
}

export async function get<T>(url: Endpoint | string): Promise<T> {
  await sleep(MOCK_LATENCY_MS);
  const data = resolveMockGet(url);
  if (data === undefined) {
    throw new Error(`GET ${url}: no mock data configured`);
  }
  return clone(data) as T;
}

export async function post<TBody, TRes>(
  url: string,
  body: TBody,
): Promise<TRes> {
  await sleep(MOCK_LATENCY_MS);
  void body;
  throw new Error(`POST ${url}: not implemented (mock API)`);
}

export async function put<TBody, TRes>(
  url: string,
  body: TBody,
): Promise<TRes> {
  await sleep(MOCK_LATENCY_MS);
  void body;
  throw new Error(`PUT ${url}: not implemented (mock API)`);
}

export async function patch<TBody, TRes>(
  url: string,
  body: TBody,
): Promise<TRes> {
  await sleep(MOCK_LATENCY_MS);
  void body;
  throw new Error(`PATCH ${url}: not implemented (mock API)`);
}

export async function del(url: string): Promise<void> {
  await sleep(MOCK_LATENCY_MS);
  throw new Error(`DELETE ${url}: not implemented (mock API)`);
}
