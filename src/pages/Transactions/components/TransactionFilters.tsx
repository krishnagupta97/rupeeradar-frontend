import { MagnifyingGlass } from "@phosphor-icons/react";
import { Button } from "../../../components/Button";
import type { TransactionFilterType } from "../types";

export interface TransactionFiltersProps {
  query: string;
  onQueryChange: (q: string) => void;
  typeFilter: TransactionFilterType;
  onTypeChange: (t: TransactionFilterType) => void;
}

export function TransactionFilters({
  query,
  onQueryChange,
  typeFilter,
  onTypeChange,
}: TransactionFiltersProps) {
  const types: TransactionFilterType[] = ["all", "income", "expense"];

  return (
    <div className="md-card flex flex-col gap-4 p-4 sm:flex-row sm:items-end sm:justify-between">
      <label className="block min-w-0 flex-1 text-sm text-[var(--md-on-surface-variant)]">
        <span className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--md-on-surface-variant)]">
          <MagnifyingGlass className="size-3.5" weight="duotone" aria-hidden />
          Search
        </span>
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Note, tag, or category…"
          className="md-input"
        />
      </label>
      <div>
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--md-on-surface-variant)]">
          Type
        </span>
        <div className="flex flex-wrap gap-2">
          {types.map((t) => (
            <Button
              key={t}
              type="button"
              variant="chip"
              chipActive={typeFilter === t}
              onClick={() => onTypeChange(t)}
            >
              {t}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
