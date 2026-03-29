import { Pulse } from "./Pulse";

export function TransactionsSkeleton() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <Pulse className="size-11 shrink-0 rounded-2xl" />
          <div className="space-y-2 pt-1">
            <Pulse className="h-7 w-48" />
            <Pulse className="h-4 w-full max-w-md" />
          </div>
        </div>
        <Pulse className="h-10 w-36 shrink-0 rounded-full" />
      </div>

      <Pulse className="h-24 w-full" />

      <div className="space-y-0 overflow-hidden rounded-xl border border-[color-mix(in_srgb,var(--md-outline-variant)_55%,transparent)]">
        <Pulse className="h-12 w-full rounded-none rounded-t-xl" />
        {Array.from({ length: 6 }).map((_, i) => (
          <Pulse
            key={i}
            className="h-14 w-full rounded-none border-t border-[color-mix(in_srgb,var(--md-outline-variant)_40%,transparent)]"
          />
        ))}
      </div>
    </div>
  );
}
