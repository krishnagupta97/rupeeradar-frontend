import { formatInr, formatShortDate } from "../../../services/format";
import type { Goal } from "../../../services/types";

export interface GoalCardProps {
  goal: Goal;
  currency: string;
}

export function GoalCard({ goal, currency }: GoalCardProps) {
  const pct = Math.min(
    100,
    Math.round((goal.savedAmount / goal.targetAmount) * 100),
  );

  return (
    <article className="md-card p-5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-medium text-[var(--md-on-surface)]">{goal.name}</h3>
          <p className="mt-0.5 text-xs text-[var(--md-on-surface-variant)]">
            Due {formatShortDate(goal.deadline)} ·{" "}
            <span className="capitalize">{goal.status}</span>
          </p>
        </div>
        <span
          className="shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold capitalize"
          style={{
            backgroundColor: "var(--md-primary-container)",
            color: "var(--md-on-primary-container)",
          }}
        >
          {goal.status}
        </span>
      </div>
      <div className="mt-4 flex justify-between gap-2 text-sm">
        <div>
          <p className="text-xs text-[var(--md-on-surface-variant)]">Saved</p>
          <p className="font-semibold tabular-nums text-[var(--md-on-surface)]">
            {formatInr(goal.savedAmount, currency)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-[var(--md-on-surface-variant)]">Target</p>
          <p className="font-semibold tabular-nums text-[var(--md-on-surface-variant)]">
            {formatInr(goal.targetAmount, currency)}
          </p>
        </div>
      </div>
      <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-[var(--md-surface-container-high)] shadow-inner">
        <div
          className="h-full rounded-full bg-[var(--md-primary)] shadow-[var(--md-elev-1)]"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-[var(--md-on-surface-variant)]">
        {pct}% of target
      </p>
    </article>
  );
}
