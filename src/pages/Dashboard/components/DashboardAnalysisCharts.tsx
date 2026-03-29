import type { ApexOptions } from "apexcharts";
import { useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import { useApp } from "../../../contexts/useApp";
import { readCssVar } from "../../../services/cssVars";
import { formatInr } from "../../../services/format";
import type { Category, Transaction } from "../../../services/types";
import type { MonthPoint } from "../types";

export interface DashboardAnalysisChartsProps {
  monthPoints: MonthPoint[];
  transactions: Transaction[];
  categories: Category[];
  currentMonthPrefix: string;
  currency: string;
  className?: string;
}

function expenseSlicesForMonth(
  transactions: Transaction[],
  categories: Category[],
  monthPrefix: string,
) {
  const catMap = new Map(categories.map((c) => [c._id, c]));
  const byCat = new Map<string, number>();
  for (const tx of transactions) {
    if (tx.type !== "expense" || !tx.date.startsWith(monthPrefix)) continue;
    byCat.set(tx.categoryId, (byCat.get(tx.categoryId) ?? 0) + tx.amount);
  }
  const entries = [...byCat.entries()]
    .map(([id, amount]) => ({
      id,
      amount,
      label: catMap.get(id)?.name ?? "Other",
      color: catMap.get(id)?.color ?? "#79747e",
    }))
    .filter((e) => e.amount > 0)
    .sort((a, b) => b.amount - a.amount);
  return entries;
}

export function DashboardAnalysisCharts({
  monthPoints,
  transactions,
  categories,
  currentMonthPrefix,
  currency,
  className = "",
}: DashboardAnalysisChartsProps) {
  const { colorScheme } = useApp();
  const mode = colorScheme === "dark" ? "dark" : "light";

  const foreColor = useMemo(() => {
    void colorScheme;
    return readCssVar("--md-on-surface-variant", "#49454f");
  }, [colorScheme]);

  const incomeSeries = monthPoints.map((p) => p.income);
  const expenseSeries = monthPoints.map((p) => p.expense);
  const categoriesAxis = monthPoints.map((p) => p.label);

  const barOptions = useMemo<ApexOptions>(
    () => ({
      chart: {
        type: "bar",
        toolbar: { show: false },
        fontFamily: '"DM Sans", system-ui, sans-serif',
        foreColor,
        background: "transparent",
      },
      theme: { mode },
      plotOptions: {
        bar: {
          borderRadius: 6,
          columnWidth: "58%",
          dataLabels: { position: "top" },
        },
      },
      dataLabels: { enabled: false },
      stroke: { show: true, width: 2, colors: ["transparent"] },
      xaxis: {
        categories: categoriesAxis,
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: { style: { colors: foreColor } },
      },
      yaxis: {
        labels: {
          style: { colors: foreColor },
          formatter: (val: number) =>
            formatInr(Math.round(val), currency).replace(/\s/g, " "),
        },
      },
      grid: {
        borderColor: "color-mix(in srgb, var(--md-outline-variant) 40%, transparent)",
        strokeDashArray: 4,
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        fontWeight: 500,
        labels: { colors: foreColor },
      },
      colors: ["#16a34a", "#dc2626"],
      tooltip: {
        theme: mode,
        y: {
          formatter: (val: number) => formatInr(val, currency),
        },
      },
    }),
    [categoriesAxis, currency, foreColor, mode],
  );

  const barSeries = useMemo(
    () => [
      { name: "Income", data: incomeSeries },
      { name: "Expense", data: expenseSeries },
    ],
    [incomeSeries, expenseSeries],
  );

  const slices = useMemo(
    () =>
      expenseSlicesForMonth(transactions, categories, currentMonthPrefix),
    [transactions, categories, currentMonthPrefix],
  );

  const pieLabels = slices.map((s) => s.label);
  const pieValues = slices.map((s) => s.amount);
  const pieColors = slices.map((s) => s.color);

  const pieOptions = useMemo<ApexOptions>(
    () => ({
      chart: {
        type: "donut",
        fontFamily: '"DM Sans", system-ui, sans-serif',
        foreColor,
        background: "transparent",
      },
      theme: { mode },
      labels: pieLabels,
      colors: pieColors.length ? pieColors : ["#79747e"],
      legend: {
        position: "bottom",
        fontWeight: 500,
        labels: { colors: foreColor },
      },
      plotOptions: {
        pie: {
          donut: {
            size: "68%",
            labels: {
              show: true,
              total: {
                show: true,
                label: "Expenses",
                fontWeight: 600,
                formatter: () =>
                  formatInr(
                    pieValues.reduce((a, b) => a + b, 0),
                    currency,
                  ),
              },
            },
          },
        },
      },
      dataLabels: { enabled: false },
      stroke: { width: 0 },
      tooltip: {
        theme: mode,
        y: {
          formatter: (val: number) => formatInr(val, currency),
        },
      },
    }),
    [currency, foreColor, mode, pieColors, pieLabels, pieValues],
  );

  return (
    <div
      className={`grid h-full min-h-0 w-full gap-6 lg:grid-cols-2 lg:items-stretch ${className}`}
    >
      <div className="md-card flex h-full min-h-0 flex-col p-4 sm:p-5">
        <h2 className="text-base font-medium text-[var(--md-on-surface)]">
          Cash flow by month
        </h2>
        <p className="mt-0.5 text-sm text-[var(--md-on-surface-variant)]">
          Income vs expense (last {monthPoints.length || 0} months)
        </p>
        <div className="mt-2 flex min-h-[260px] flex-1 flex-col">
          {monthPoints.length > 0 ? (
            <ReactApexChart
              type="bar"
              height={300}
              options={barOptions}
              series={barSeries}
            />
          ) : (
            <p className="md-muted py-16 text-center text-sm">
              Not enough history for a chart yet.
            </p>
          )}
        </div>
      </div>

      <div className="md-card flex h-full min-h-0 flex-col p-4 sm:p-5">
        <h2 className="text-base font-medium text-[var(--md-on-surface)]">
          This month&apos;s expenses
        </h2>
        <p className="mt-0.5 text-sm text-[var(--md-on-surface-variant)]">
          Share by category (donut)
        </p>
        <div className="mt-2 flex min-h-[260px] flex-1 flex-col">
          {slices.length > 0 ? (
            <ReactApexChart
              type="donut"
              height={280}
              options={pieOptions}
              series={pieValues}
            />
          ) : (
            <p className="md-muted py-16 text-center text-sm">
              No expenses recorded for this month.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
