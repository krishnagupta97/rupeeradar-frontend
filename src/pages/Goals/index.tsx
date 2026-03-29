import { Plus, Target } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { Button } from "../../components/Button";
import { MobileAddFab } from "../../components/MobileAddFab";
import { PageHeader } from "../../components/PageHeader";
import { useApp } from "../../contexts/useApp";
import { useFinanceData } from "../../contexts/useFinanceData";
import { Skeleton } from "../../skeleton";
import type { GoalFilter } from "./types";
import { AddGoalModal } from "./components/AddGoalModal";
import { GoalCard } from "./components/GoalCard";

export default function GoalsPage() {
  const { user } = useApp();
  const currency = user?.currency ?? "INR";
  const { goals, loading, error, addGoal } = useFinanceData();
  const [filter, setFilter] = useState<GoalFilter>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [goalModalKey, setGoalModalKey] = useState(0);

  const filtered = useMemo(() => {
    if (filter === "all") return goals;
    return goals.filter((g) => g.status === filter);
  }, [goals, filter]);

  if (loading) {
    return <Skeleton type="goals" />;
  }

  if (error && goals.length === 0) {
    return <div className="md-error-banner p-4 text-sm">{error}</div>;
  }

  const filters: GoalFilter[] = ["all", "active", "paused", "completed"];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        title="Goals"
        subtitle="Track savings targets; new goals are stored in this session until you connect a real API."
        icon={
          <Target className="size-5 md:size-6" weight="duotone" aria-hidden />
        }
        actions={
          <Button
            type="button"
            variant="primary"
            onClick={() => {
              setGoalModalKey((k) => k + 1);
              setModalOpen(true);
            }}
          >
            <Plus className="size-5" weight="bold" />
            Add goal
          </Button>
        }
      />

      <MobileAddFab
        label="Add goal"
        onClick={() => {
          setGoalModalKey((k) => k + 1);
          setModalOpen(true);
        }}
      />

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <Button
            key={f}
            type="button"
            variant="chip"
            chipActive={filter === f}
            className="capitalize"
            onClick={() => setFilter(f)}
          >
            {f}
          </Button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="md-card p-8 text-center text-sm text-[var(--md-on-surface-variant)]">
          No goals in this view. Add one to get started.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((g) => (
            <GoalCard key={g._id} goal={g} currency={currency} />
          ))}
        </div>
      )}

      {modalOpen ? (
        <AddGoalModal
          key={goalModalKey}
          open
          onClose={() => setModalOpen(false)}
          onAdd={addGoal}
        />
      ) : null}
    </div>
  );
}
