import { CaretRight, Plus } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/Button";
import type { Category, TransactionTemplate } from "../../../services/types";
import { formatInr } from "../../../services/format";

export interface TransactionAddMenuProps {
  categories: Category[];
  pinnedTemplates: TransactionTemplate[];
  currency: string;
  onNewTransaction: () => void;
  onApplyTemplate: (t: TransactionTemplate) => void;
}

export function TransactionAddMenu({
  categories,
  pinnedTemplates,
  currency,
  onNewTransaction,
  onApplyTemplate,
}: TransactionAddMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  return (
    <div className="relative hidden md:block" ref={rootRef}>
      <Button
        type="button"
        variant="primary"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <Plus className="size-5" weight="bold" />
        Add transaction
      </Button>
      {open ? (
        <div
          className="absolute right-0 z-50 mt-2 w-[min(100%,20rem)] overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--md-outline-variant)_50%,transparent)] bg-[var(--md-surface-container-high)] py-2 shadow-[var(--md-elev-2)]"
          role="menu"
        >
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-medium text-[var(--md-on-surface)] hover:bg-[color-mix(in_srgb,var(--md-primary)_10%,transparent)]"
            onClick={() => {
              setOpen(false);
              onNewTransaction();
            }}
          >
            <Plus className="size-5 text-[var(--md-primary)]" weight="bold" />
            New transaction…
          </button>
          {pinnedTemplates.length > 0 ? (
            <>
              <div className="mx-3 my-1 border-t border-[color-mix(in_srgb,var(--md-outline-variant)_45%,transparent)]" />
              <p className="px-4 pb-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--md-on-surface-variant)]">
                Pinned templates
              </p>
              <ul>
                {pinnedTemplates.map((t) => {
                  const cat = categories.find((c) => c._id === t.categoryId);
                  return (
                    <li key={t._id}>
                      <button
                        type="button"
                        role="menuitem"
                        className="flex w-full items-start gap-3 px-4 py-2.5 text-left hover:bg-[color-mix(in_srgb,var(--md-on-surface)_6%,transparent)]"
                        onClick={() => {
                          setOpen(false);
                          onApplyTemplate(t);
                        }}
                      >
                        <span className="text-lg leading-none">
                          {cat?.icon ?? "•"}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-medium text-[var(--md-on-surface)]">
                            {t.name}
                          </span>
                          <span className="text-xs text-[var(--md-on-surface-variant)]">
                            {cat?.name ?? "—"} · {formatInr(t.amount, currency)}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </>
          ) : null}
          <div className="mx-3 my-1 border-t border-[color-mix(in_srgb,var(--md-outline-variant)_45%,transparent)]" />
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center justify-between gap-2 px-4 py-2.5 text-sm text-[var(--md-primary)] hover:bg-[color-mix(in_srgb,var(--md-primary)_8%,transparent)]"
            onClick={() => {
              setOpen(false);
              navigate("/templates");
            }}
          >
            Manage templates
            <CaretRight className="size-4 shrink-0" weight="bold" aria-hidden />
          </button>
        </div>
      ) : null}
    </div>
  );
}
