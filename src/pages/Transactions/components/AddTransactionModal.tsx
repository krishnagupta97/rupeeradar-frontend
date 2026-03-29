import { useMemo, useState, type FormEvent } from "react";
import { Button } from "../../../components/Button";
import { Modal } from "../../../components/Modal";
import type { NewTransactionInput } from "../../../contexts/financeTypes";
import type { Category } from "../../../services/types";

export interface AddTransactionModalProps {
  open: boolean;
  onClose: () => void;
  categories: Category[];
  onAdd: (input: NewTransactionInput) => void;
}

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export function AddTransactionModal({
  open,
  onClose,
  categories,
  onAdd,
}: AddTransactionModalProps) {
  const [type, setType] = useState<"income" | "expense">("expense");
  const [categoryId, setCategoryId] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(todayIsoDate);
  const [note, setNote] = useState("");
  const [tags, setTags] = useState("");

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
    onAdd({
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
    onClose();
  };

  return (
    <Modal
      open={open}
      title="Add transaction"
      onClose={onClose}
      footer={
        <div className="flex flex-wrap justify-end gap-2">
          <Button type="button" variant="text" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            form="add-transaction-form"
          >
            Save
          </Button>
        </div>
      }
    >
      <form id="add-transaction-form" className="space-y-4" onSubmit={handleSubmit}>
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
            htmlFor="tx-cat"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--md-on-surface-variant)]"
          >
            Category
          </label>
          <select
            id="tx-cat"
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
            htmlFor="tx-amt"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--md-on-surface-variant)]"
          >
            Amount
          </label>
          <input
            id="tx-amt"
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
            htmlFor="tx-date"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--md-on-surface-variant)]"
          >
            Date
          </label>
          <input
            id="tx-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="md-input"
            required
          />
        </div>

        <div>
          <label
            htmlFor="tx-note"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--md-on-surface-variant)]"
          >
            Note
          </label>
          <input
            id="tx-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="md-input"
            placeholder="Optional"
          />
        </div>

        <div>
          <label
            htmlFor="tx-tags"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--md-on-surface-variant)]"
          >
            Tags
          </label>
          <input
            id="tx-tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="md-input"
            placeholder="Comma-separated"
          />
        </div>
      </form>
    </Modal>
  );
}
