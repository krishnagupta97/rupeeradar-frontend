import { useMemo, useState, type FormEvent } from "react";
import { Button } from "../../../components/Button";
import { Modal } from "../../../components/Modal";
import type { NewTransactionTemplateInput } from "../../../contexts/financeTypes";
import type { Category } from "../../../services/types";

export interface AddTemplateModalProps {
  open: boolean;
  onClose: () => void;
  categories: Category[];
  onAdd: (input: NewTransactionTemplateInput) => void;
}

export function AddTemplateModal({
  open,
  onClose,
  categories,
  onAdd,
}: AddTemplateModalProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [categoryId, setCategoryId] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [tags, setTags] = useState("");

  const forType = useMemo(
    () => categories.filter((c) => c.type === type),
    [categories, type],
  );

  const effectiveCategoryId = forType.some((c) => c._id === categoryId)
    ? categoryId
    : (forType[0]?._id ?? "");

  const reset = () => {
    setName("");
    setType("expense");
    setCategoryId("");
    setAmount("");
    setNote("");
    setTags("");
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const n = Number(amount);
    if (!name.trim() || !effectiveCategoryId || !Number.isFinite(n) || n <= 0)
      return;
    onAdd({
      name: name.trim(),
      categoryId: effectiveCategoryId,
      type,
      amount: n,
      note,
      tags,
      pinSlot: null,
    });
    reset();
    onClose();
  };

  return (
    <Modal
      open={open}
      title="New template"
      onClose={onClose}
      footer={
        <div className="flex flex-wrap justify-end gap-2">
          <Button type="button" variant="text" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" form="add-template-form">
            Save
          </Button>
        </div>
      }
    >
      <form id="add-template-form" className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="tpl-name"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--md-on-surface-variant)]"
          >
            Name
          </label>
          <input
            id="tpl-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="md-input"
            placeholder="e.g. Daily commute"
            required
          />
        </div>

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
            htmlFor="tpl-cat"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--md-on-surface-variant)]"
          >
            Category
          </label>
          <select
            id="tpl-cat"
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
            htmlFor="tpl-amt"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--md-on-surface-variant)]"
          >
            Amount
          </label>
          <input
            id="tpl-amt"
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
            htmlFor="tpl-note"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--md-on-surface-variant)]"
          >
            Note
          </label>
          <input
            id="tpl-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="md-input"
            placeholder="Optional"
          />
        </div>

        <div>
          <label
            htmlFor="tpl-tags"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--md-on-surface-variant)]"
          >
            Tags
          </label>
          <input
            id="tpl-tags"
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
