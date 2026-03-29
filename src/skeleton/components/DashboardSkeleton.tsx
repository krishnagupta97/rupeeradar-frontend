import { Pulse } from "./Pulse";

export function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex items-start gap-3">
        <Pulse className="size-11 shrink-0 rounded-2xl" />
        <div className="min-w-0 flex-1 space-y-2 pt-1">
          <Pulse className="h-7 w-40" />
          <Pulse className="h-4 w-72 max-w-full" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Pulse className="h-28 w-full" />
        <Pulse className="h-28 w-full" />
        <Pulse className="h-28 w-full" />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Pulse className="h-[340px] w-full lg:col-span-3" />
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Pulse className="h-[220px] w-full" />
          <Pulse className="min-h-[200px] flex-1 w-full" />
        </div>
      </div>

      <Pulse className="h-64 w-full" />
    </div>
  );
}
