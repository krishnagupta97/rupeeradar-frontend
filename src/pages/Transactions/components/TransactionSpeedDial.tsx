import { Plus, X } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { Button } from "../../../components/Button";
import type { Category, TransactionTemplate } from "../../../services/types";
import { formatInr } from "../../../services/format";

const POS = [
  "fixed z-[35] md:hidden flex flex-col items-end gap-2",
  "right-[max(1rem,env(safe-area-inset-right))]",
  "bottom-[calc(5rem+env(safe-area-inset-bottom)+0.35rem)]",
].join(" ");

export interface TransactionSpeedDialProps {
  categories: Category[];
  /** Up to three, ordered by pin slot. */
  pinnedTemplates: TransactionTemplate[];
  currency: string;
  onAddNew: () => void;
  onApplyTemplate: (t: TransactionTemplate) => void;
}

export function TransactionSpeedDial({
  categories,
  pinnedTemplates,
  currency,
  onAddNew,
  onApplyTemplate,
}: TransactionSpeedDialProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {open ? (
        <div className="fixed inset-0 z-[34] md:hidden">
          <Button
            type="button"
            variant="overlay"
            aria-label="Close quick add"
            className="size-full"
            onClick={() => setOpen(false)}
          />
        </div>
      ) : null}

      <div className={POS}>
        {open ? (
          <>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onAddNew();
              }}
              className={[
                "flex max-w-[min(17rem,calc(100vw-2.5rem))] items-center gap-2 rounded-2xl border border-[color-mix(in_srgb,var(--md-outline-variant)_45%,transparent)]",
                "bg-[var(--md-surface-container-high)] px-4 py-3 text-left shadow-[var(--md-elev-2)]",
                "transition-transform duration-200 active:scale-[0.98]",
              ].join(" ")}
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[var(--md-primary-container)] text-[var(--md-on-primary-container)]">
                <Plus className="size-5" weight="bold" aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-[var(--md-on-surface)]">
                  Add new
                </span>
                <span className="mt-0.5 block text-xs text-[var(--md-on-surface-variant)]">
                  Full transaction form
                </span>
              </span>
            </button>

            {pinnedTemplates.map((t) => {
              const cat = categories.find((c) => c._id === t.categoryId);
              return (
                <button
                  key={t._id}
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    onApplyTemplate(t);
                  }}
                  className={[
                    "flex max-w-[min(17rem,calc(100vw-2.5rem))] items-center gap-2 rounded-2xl border border-[color-mix(in_srgb,var(--md-outline-variant)_45%,transparent)]",
                    "bg-[var(--md-surface-container-high)] px-4 py-3 text-left shadow-[var(--md-elev-2)]",
                    "transition-transform duration-200 active:scale-[0.98]",
                  ].join(" ")}
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[var(--md-primary-container)] text-lg text-[var(--md-on-primary-container)]">
                    {cat?.icon ?? "•"}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-[var(--md-on-surface)]">
                      {t.name}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-[var(--md-on-surface-variant)]">
                      {cat?.name ?? "—"} · {formatInr(t.amount, currency)}
                    </span>
                  </span>
                </button>
              );
            })}
          </>
        ) : null}

        <button
          type="button"
          aria-label={open ? "Close" : "Add transaction"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className={[
            "inline-flex size-14 cursor-pointer items-center justify-center rounded-full",
            "border-0 bg-[var(--md-primary)] text-[var(--md-on-primary)] shadow-[var(--md-elev-2)]",
            "transition-[opacity,transform] duration-200 hover:opacity-90 active:scale-[0.96]",
          ].join(" ")}
        >
          {open ? (
            <X className="size-7" weight="bold" aria-hidden />
          ) : (
            <Plus className="size-7" weight="bold" aria-hidden />
          )}
        </button>
      </div>
    </>
  );
}
