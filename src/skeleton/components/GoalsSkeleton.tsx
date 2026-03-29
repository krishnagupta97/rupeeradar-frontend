import { Pulse } from "./Pulse";

export function GoalsSkeleton() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <Pulse className="size-11 shrink-0 rounded-2xl" />
          <div className="space-y-2 pt-1">
            <Pulse className="h-7 w-28" />
            <Pulse className="h-4 w-96 max-w-full" />
          </div>
        </div>
        <Pulse className="h-10 w-36 shrink-0 rounded-full" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Pulse key={i} className="h-56 w-full" />
        ))}
      </div>
    </div>
  );
}
