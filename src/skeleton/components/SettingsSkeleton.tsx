import { Pulse } from "./Pulse";

export function SettingsSkeleton() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-start gap-3">
        <Pulse className="size-11 shrink-0 rounded-2xl" />
        <div className="space-y-2 pt-1">
          <Pulse className="h-7 w-28" />
          <Pulse className="h-4 w-72 max-w-full" />
        </div>
      </div>

      <Pulse className="h-28 w-full" />

      <div className="md-card p-5">
        <Pulse className="h-5 w-24" />
        <Pulse className="mt-2 h-4 w-56" />
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Pulse key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>

      <Pulse className="h-20 w-full" />
    </div>
  );
}
