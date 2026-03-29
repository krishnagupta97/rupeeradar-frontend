import { useMemo, useState, type FormEvent } from "react";
import { Button } from "../../../components/Button";
import type { NewTransactionInput } from "../../../contexts/financeTypes";
import type { Category } from "../../../services/types";
import { todayIsoDate } from "../dateUtils";

export interface AddTransactionFormProps {
  formId: string;
  categories: Category[];
  onSubmit: (input: NewTransactionInput) => void;
  /** When set, seeds fields (e.g. opening from a template as starting point). */
  initial?: Partial<{
    type: "income" | "expense";
    categoryId: string;
    amount: string;
    date: string;
    note: string;
    tags: string;
  }>;
}

export function AddTransactionForm({
  formId,
  categories,
  onSubmit,
  initial,
}: AddTransactionFormProps) {
  const [type, setType] = useState<"income" | "expense">(
    initial?.type ?? "expense",
  );
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? "");
  const [amount, setAmount] = useState(initial?.amount ?? "");
  const [date, setDate] = useState(initial?.date ?? todayIsoDate());
  const [note, setNote] = useState(initial?.note ?? "");
  const [tags, setTags] = useState(initial?.tags ?? "");

  const forType = useMemo(
    () => categories.filter((c) => c.type === type),
    [categories, type],
  );

  const effectiveCategoryId = forType.some((c) => c._id === categoryId)
    ? categoryId
    : (forType[0]?._id ?? "");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const n = Number(amount);
    if (!effectiveCategoryId || !Number.isFinite(n) || n <= 0) return;
    onSubmit({
      categoryId: effectiveCategoryId,
      type,
      amount: n,
      date,
      note,
      tags,
    });
    setAmount("");
    setNote("");
    setTags("");
  };

  return (
    <form id={formId} className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--md-on-surface-variant)]">
          Type
        </label>
        <div className="flex gap-2">
          {(["expense", "income"] as const).map((t) => (
            <Button
              key={t}
              type="button"
              variant="chip"
              chipActive={type === t}
              className="flex-1 capitalize"
              onClick={() => setType(t)}
            >
              {t}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <label
          htmlFor={`${formId}-cat`}
          className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--md-on-surface-variant)]"
        >
          Category
        </label>
        <select
          id={`${formId}-cat`}
          value={effectiveCategoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="md-input"
          required
        >
          {forType.map((c) => (
            <option key={c._id} value={c._id}>
              {c.icon} {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor={`${formId}-amt`}
          className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--md-on-surface-variant)]"
        >
          Amount
        </label>
        <input
          id={`${formId}-amt`}
          type="number"
          min={1}
          step={1}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="md-input"
          required
        />
      </div>

      <div>
        <label
          htmlFor={`${formId}-date`}
          className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--md-on-surface-variant)]"
        >
          Date
        </label>
        <input
          id={`${formId}-date`}
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="md-input"
          required
        />
      </div>

      <div>
        <label
          htmlFor={`${formId}-note`}
          className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--md-on-surface-variant)]"
        >
          Note
        </label>
        <input
          id={`${formId}-note`}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="md-input"
          placeholder="Optional"
        />
      </div>

      <div>
        <label
          htmlFor={`${formId}-tags`}
          className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--md-on-surface-variant)]"
        >
          Tags
        </label>
        <input
          id={`${formId}-tags`}
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="md-input"
          placeholder="Comma-separated"
        />
      </div>
    </form>
  );
}
