import { Button } from "../../../components/Button";
import { Modal } from "../../../components/Modal";
import type { NewTransactionInput } from "../../../contexts/financeTypes";
import type { Category } from "../../../services/types";
import { AddTransactionForm } from "./AddTransactionForm";

export interface AddTransactionModalProps {
  open: boolean;
  onClose: () => void;
  categories: Category[];
  onAdd: (input: NewTransactionInput) => void;
}

export function AddTransactionModal({
  open,
  onClose,
  categories,
  onAdd,
}: AddTransactionModalProps) {
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
      <AddTransactionForm
        formId="add-transaction-form"
        categories={categories}
        onSubmit={(input) => {
          onAdd(input);
          onClose();
        }}
      />
    </Modal>
  );
}
