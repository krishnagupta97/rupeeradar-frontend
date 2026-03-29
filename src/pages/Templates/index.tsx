import { ClipboardText, PushPin, Trash } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { Button } from "../../components/Button";
import { MobileAddFab } from "../../components/MobileAddFab";
import { PageHeader } from "../../components/PageHeader";
import { useApp } from "../../contexts/useApp";
import { useFinanceData } from "../../contexts/useFinanceData";
import type { TransactionTemplate } from "../../services/types";
import { formatInr } from "../../services/format";
import { AddTemplateModal } from "./components/AddTemplateModal";

export default function TemplatesPage() {
  const { user } = useApp();
  const currency = user?.currency ?? "INR";
  const {
    categories,
    transactionTemplates,
    loading,
    error,
    addTransactionTemplate,
    removeTransactionTemplate,
    setTemplatePinSlot,
  } = useFinanceData();

  const [modalOpen, setModalOpen] = useState(false);
  const [tplModalKey, setTplModalKey] = useState(0);

  const categoriesById = useMemo(
    () => new Map(categories.map((c) => [c._id, c])),
    [categories],
  );

  const sorted = useMemo(
    () =>
      [...transactionTemplates].sort((a, b) => a.name.localeCompare(b.name)),
    [transactionTemplates],
  );

  if (error && !loading && transactionTemplates.length === 0) {
    return <div className="md-error-banner p-4 text-sm">{error}</div>;
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl p-4 text-sm text-[var(--md-on-surface-variant)]">
        Loading…
      </div>
    );
  }

  const pinLabel = (slot: 0 | 1 | 2) => `Pin slot ${slot + 1}`;

  const togglePin = (t: TransactionTemplate, slot: 0 | 1 | 2) => {
    if (t.pinSlot === slot) setTemplatePinSlot(t._id, null);
    else setTemplatePinSlot(t._id, slot);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        title="Templates"
        subtitle="Save amount, category, and note—pin up to three for one-tap adds from Transactions."
        icon={
          <ClipboardText
            className="size-5 md:size-6"
            weight="duotone"
            aria-hidden
          />
        }
        actions={
          <Button
            type="button"
            variant="primary"
            className="hidden md:inline-flex"
            onClick={() => {
              setTplModalKey((k) => k + 1);
              setModalOpen(true);
            }}
          >
            New template
          </Button>
        }
      />

      <MobileAddFab
        label="New template"
        onClick={() => {
          setTplModalKey((k) => k + 1);
          setModalOpen(true);
        }}
      />

      {sorted.length === 0 ? (
        <p className="md-card p-8 text-center text-sm text-[var(--md-on-surface-variant)]">
          No templates yet. Create one for routines like commute or lunch.
        </p>
      ) : (
        <ul className="space-y-3">
          {sorted.map((t) => {
            const cat = categoriesById.get(t.categoryId);
            return (
              <li
                key={t._id}
                className="md-card flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 gap-3">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--md-primary-container)] text-xl text-[var(--md-on-primary-container)]">
                    {cat?.icon ?? "•"}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-[var(--md-on-surface)]">
                      {t.name}
                    </p>
                    <p className="mt-0.5 text-sm text-[var(--md-on-surface-variant)]">
                      {cat?.name ?? "Unknown"} · {t.type} ·{" "}
                      {formatInr(t.amount, currency)}
                    </p>
                    {t.note ? (
                      <p className="mt-1 line-clamp-2 text-xs text-[var(--md-on-surface-variant)]">
                        {t.note}
                      </p>
                    ) : null}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
                  {([0, 1, 2] as const).map((slot) => (
                    <Button
                      key={slot}
                      type="button"
                      variant="chip"
                      chipActive={t.pinSlot === slot}
                      className="gap-1.5 text-xs"
                      onClick={() => togglePin(t, slot)}
                      aria-label={pinLabel(slot)}
                      aria-pressed={t.pinSlot === slot}
                    >
                      <PushPin
                        className="size-3.5"
                        weight={t.pinSlot === slot ? "fill" : "duotone"}
                        aria-hidden
                      />
                      {slot + 1}
                    </Button>
                  ))}
                  <Button
                    type="button"
                    variant="text"
                    className="text-[var(--md-on-surface-variant)]"
                    onClick={() => removeTransactionTemplate(t._id)}
                    aria-label={`Delete ${t.name}`}
                  >
                    <Trash className="size-5" weight="duotone" />
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {modalOpen ? (
        <AddTemplateModal
          key={tplModalKey}
          open
          onClose={() => setModalOpen(false)}
          categories={categories}
          onAdd={addTransactionTemplate}
        />
      ) : null}
    </div>
  );
}
