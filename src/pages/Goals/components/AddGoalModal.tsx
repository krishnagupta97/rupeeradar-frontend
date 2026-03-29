import { useState, type FormEvent } from "react";
import { Button } from "../../../components/Button";
import { Modal } from "../../../components/Modal";
import type { NewGoalInput } from "../../../contexts/financeTypes";

export interface AddGoalModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (input: NewGoalInput) => void;
}

function defaultDeadline(): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1);
  return d.toISOString().slice(0, 10);
}

export function AddGoalModal({ open, onClose, onAdd }: AddGoalModalProps) {
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [deadline, setDeadline] = useState(defaultDeadline);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const n = Number(targetAmount);
    if (!name.trim() || !Number.isFinite(n) || n <= 0) return;
    onAdd({ name: name.trim(), targetAmount: n, deadline });
    onClose();
  };

  return (
    <Modal
      open={open}
      title="Add goal"
      onClose={onClose}
      footer={
        <div className="flex flex-wrap justify-end gap-2">
          <Button type="button" variant="text" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" form="add-goal-form">
            Save
          </Button>
        </div>
      }
    >
      <form id="add-goal-form" className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="goal-name"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--md-on-surface-variant)]"
          >
            Name
          </label>
          <input
            id="goal-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="md-input"
            placeholder="e.g. Emergency fund"
            required
          />
        </div>
        <div>
          <label
            htmlFor="goal-target"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--md-on-surface-variant)]"
          >
            Target amount
          </label>
          <input
            id="goal-target"
            type="number"
            min={1}
            step={1}
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            className="md-input"
            required
          />
        </div>
        <div>
          <label
            htmlFor="goal-deadline"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--md-on-surface-variant)]"
          >
            Deadline
          </label>
          <input
            id="goal-deadline"
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="md-input"
            required
          />
        </div>
      </form>
    </Modal>
  );
}
