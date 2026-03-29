import { ListBullets, Plus } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { Button } from "../../components/Button";
import { useApp } from "../../contexts/useApp";
import { useFinanceData } from "../../contexts/useFinanceData";
import type { Category, Transaction } from "../../services/types";
import { Skeleton } from "../../skeleton";
import type { TransactionFilterType } from "./types";
import { AddTransactionModal } from "./components/AddTransactionModal";
import { TransactionFilters } from "./components/TransactionFilters";
import { TransactionTable } from "./components/TransactionTable";

function matchesQuery(
  tx: Transaction,
  categoriesById: Map<string, Category>,
  q: string,
): boolean {
  if (!q.trim()) return true;
  const needle = q.trim().toLowerCase();
  const cat = categoriesById.get(tx.categoryId);
  const catName = cat?.name.toLowerCase() ?? "";
  if (tx.note.toLowerCase().includes(needle)) return true;
  if (catName.includes(needle)) return true;
  return tx.tags.some((t) => t.toLowerCase().includes(needle));
}

export default function TransactionsPage() {
  const { user } = useApp();
  const currency = user?.currency ?? "INR";
  const {
    transactions,
    categories,
    loading,
    error,
    addTransaction,
  } = useFinanceData();
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<TransactionFilterType>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [txModalKey, setTxModalKey] = useState(0);

  const categoriesById = useMemo(
    () => new Map(categories.map((c) => [c._id, c])),
    [categories],
  );

  const filtered = useMemo(() => {
    return transactions
      .filter((tx) => typeFilter === "all" || tx.type === typeFilter)
      .filter((tx) => matchesQuery(tx, categoriesById, query))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, typeFilter, query, categoriesById]);

  if (error && !loading && transactions.length === 0) {
    return <div className="md-error-banner p-4 text-sm">{error}</div>;
  }

  if (loading) {
    return <Skeleton type="transactions" />;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-[var(--md-primary-container)] text-[var(--md-on-primary-container)] shadow-[var(--md-elev-1)]">
            <ListBullets className="size-6" weight="duotone" aria-hidden />
          </div>
          <div>
            <h1 className="md-page-title text-2xl">Transactions</h1>
            <p className="md-page-sub mt-1 text-sm">
              Filter and search; add rows locally until your API is wired.
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="primary"
          className="self-start"
          onClick={() => {
            setTxModalKey((k) => k + 1);
            setModalOpen(true);
          }}
        >
          <Plus className="size-5" weight="bold" />
          Add transaction
        </Button>
      </div>

      <TransactionFilters
        query={query}
        onQueryChange={setQuery}
        typeFilter={typeFilter}
        onTypeChange={setTypeFilter}
      />

      <TransactionTable
        rows={filtered}
        categoriesById={categoriesById}
        currency={currency}
      />

      {modalOpen ? (
        <AddTransactionModal
          key={txModalKey}
          open
          onClose={() => setModalOpen(false)}
          categories={categories}
          onAdd={addTransaction}
        />
      ) : null}
    </div>
  );
}
