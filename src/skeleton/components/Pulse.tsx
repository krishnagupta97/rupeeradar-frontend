export interface PulseProps {
  className: string;
}

/** Material-style loading block; use Tailwind h-/w- via className. */
export function Pulse({ className }: PulseProps) {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-[var(--md-surface-container-high)] ${className}`}
      aria-hidden
    />
  );
}
