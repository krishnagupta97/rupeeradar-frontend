import { useMemo, useState, type FormEvent } from "react";
import { Button } from "../../../components/Button";
import { Modal } from "../../../components/Modal";
import type { NewBudgetInput } from "../../../contexts/financeTypes";
import type { Budget, Category } from "../../../services/types";

export interface AddBudgetModalProps {
  open: boolean;
  onClose: () => void;
  categories: Category[];
  existingBudgets: Budget[];
  onAdd: (input: NewBudgetInput) => void;
}

export function AddBudgetModal({
  open,
  onClose,
  categories,
  existingBudgets,
  onAdd,
}: AddBudgetModalProps) {
  const expenseCats = useMemo(
    () => categories.filter((c) => c.type === "expense"),
    [categories],
  );

  const preferredId =
    expenseCats.find(
      (c) => !existingBudgets.some((b) => b.categoryId === c._id),
    )?._id ?? expenseCats[0]?._id ?? "";

  const [categoryId, setCategoryId] = useState(preferredId);
  const [limitAmount, setLimitAmount] = useState("");
  const [period, setPeriod] = useState<Budget["period"]>("monthly");
  const [alertAt, setAlertAt] = useState("80");

  const effectiveCategoryId = expenseCats.some((c) => c._id === categoryId)
    ? categoryId
    : preferredId;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const n = Number(limitAmount);
    const alertN = Number(alertAt);
    if (!effectiveCategoryId || !Number.isFinite(n) || n <= 0) return;
    if (!Number.isFinite(alertN) || alertN < 0 || alertN > 100) return;
    onAdd({
      categoryId: effectiveCategoryId,
      limitAmount: n,
      period,
      alertAt: alertN,
    });
    onClose();
  };

  return (
    <Modal
      open={open}
      title="Add budget"
      onClose={onClose}
      footer={
        <div className="flex flex-wrap justify-end gap-2">
          <Button type="button" variant="text" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" form="add-budget-form">
            Save
          </Button>
        </div>
      }
    >
      <form id="add-budget-form" className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="bud-cat"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--md-on-surface-variant)]"
          >
            Category (expense)
          </label>
          <select
            id="bud-cat"
            value={effectiveCategoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="md-input"
            required
          >
            {expenseCats.map((c) => (
              <option key={c._id} value={c._id}>
                {c.icon} {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="bud-limit"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--md-on-surface-variant)]"
          >
            Monthly limit
          </label>
          <input
            id="bud-limit"
            type="number"
            min={1}
            step={1}
            value={limitAmount}
            onChange={(e) => setLimitAmount(e.target.value)}
            className="md-input"
            required
          />
        </div>

        <div>
          <label
            htmlFor="bud-period"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--md-on-surface-variant)]"
          >
            Period
          </label>
          <select
            id="bud-period"
            value={period}
            onChange={(e) =>
              setPeriod(e.target.value as Budget["period"])
            }
            className="md-input"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="bud-alert"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--md-on-surface-variant)]"
          >
            Alert at (% of limit)
          </label>
          <input
            id="bud-alert"
            type="number"
            min={0}
            max={100}
            value={alertAt}
            onChange={(e) => setAlertAt(e.target.value)}
            className="md-input"
            required
          />
        </div>
      </form>
    </Modal>
  );
}
