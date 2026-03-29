import { Pulse } from "./Pulse";

export function ReportsSkeleton() {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex items-start gap-3">
        <Pulse className="size-11 shrink-0 rounded-2xl" />
        <div className="space-y-2 pt-1">
          <Pulse className="h-7 w-32" />
          <Pulse className="h-4 w-64 max-w-full" />
        </div>
      </div>

      <div className="md-card p-6">
        <Pulse className="h-5 w-48" />
        <Pulse className="mt-2 h-4 w-56" />
        <div className="mt-6 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between gap-2">
                <Pulse className="h-4 w-32" />
                <Pulse className="h-4 w-24" />
              </div>
              <Pulse className="h-2.5 w-full rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
