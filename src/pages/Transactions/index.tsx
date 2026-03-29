import { ListBullets } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { PageHeader } from "../../components/PageHeader";
import { useApp } from "../../contexts/useApp";
import { useFinanceData } from "../../contexts/useFinanceData";
import type { Category, Transaction } from "../../services/types";
import { Skeleton } from "../../skeleton";
import type { TransactionFilterType } from "./types";
import { AddTransactionModal } from "./components/AddTransactionModal";
import { TransactionAddMenu } from "./components/TransactionAddMenu";
import { TransactionFilters } from "./components/TransactionFilters";
import { TransactionSpeedDial } from "./components/TransactionSpeedDial";
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
    transactionTemplates,
    loading,
    error,
    addTransaction,
    applyTemplate,
  } = useFinanceData();
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<TransactionFilterType>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [txModalKey, setTxModalKey] = useState(0);
  const categoriesById = useMemo(
    () => new Map(categories.map((c) => [c._id, c])),
    [categories],
  );

  const pinnedTemplates = useMemo(() => {
    return transactionTemplates
      .filter((t) => t.pinSlot !== null)
      .sort((a, b) => (a.pinSlot ?? 0) - (b.pinSlot ?? 0));
  }, [transactionTemplates]);

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
      <PageHeader
        title="Transactions"
        subtitle="Filter and search; add rows locally until your API is wired."
        icon={
          <ListBullets
            className="size-5 md:size-6"
            weight="duotone"
            aria-hidden
          />
        }
        actions={
          <TransactionAddMenu
            categories={categories}
            pinnedTemplates={pinnedTemplates}
            currency={currency}
            onNewTransaction={() => {
              setTxModalKey((k) => k + 1);
              setModalOpen(true);
            }}
            onApplyTemplate={applyTemplate}
          />
        }
      />

      <TransactionSpeedDial
        categories={categories}
        pinnedTemplates={pinnedTemplates}
        currency={currency}
        onAddNew={() => {
          setTxModalKey((k) => k + 1);
          setModalOpen(true);
        }}
        onApplyTemplate={applyTemplate}
      />

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
