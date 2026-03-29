import { X } from "@phosphor-icons/react";
import { Button } from "../Button";
import type { ModalProps } from "./types";

export function Modal({ open, title, onClose, children, footer }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <Button
        type="button"
        variant="overlay"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div
        className="relative z-10 flex max-h-[min(90vh,640px)] w-full max-w-lg flex-col rounded-t-3xl border border-[color-mix(in_srgb,var(--md-outline-variant)_55%,transparent)] bg-[var(--md-surface-container-high)] shadow-[var(--md-elev-2)] sm:rounded-3xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex items-center justify-between gap-3 border-b border-[color-mix(in_srgb,var(--md-outline-variant)_50%,transparent)] px-5 py-4">
          <h2
            id="modal-title"
            className="text-lg font-medium text-[var(--md-on-surface)]"
          >
            {title}
          </h2>
          <Button
            type="button"
            variant="icon"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="size-5" weight="bold" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer ? (
          <div className="border-t border-[color-mix(in_srgb,var(--md-outline-variant)_50%,transparent)] px-5 py-4">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
