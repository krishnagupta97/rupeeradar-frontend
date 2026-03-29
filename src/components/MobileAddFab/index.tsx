import { Plus } from "@phosphor-icons/react";

export interface MobileAddFabProps {
  onClick: () => void;
  /** Accessible name, e.g. "Add transaction". */
  label: string;
}

/**
 * Circular primary + control fixed above the mobile bottom dock (`md:hidden`).
 * Bottom offset matches the layout’s bottom padding band for the nav.
 */
export function MobileAddFab({ onClick, label }: MobileAddFabProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={[
        "fixed z-[35] md:hidden",
        "inline-flex size-14 cursor-pointer items-center justify-center rounded-full",
        "border-0 bg-[var(--md-primary)] text-[var(--md-on-primary)] shadow-[var(--md-elev-2)]",
        "transition-[opacity,transform] duration-200 hover:opacity-90 active:scale-[0.96]",
        "right-[max(1rem,env(safe-area-inset-right))]",
        "bottom-[calc(5rem+env(safe-area-inset-bottom)+0.35rem)]",
      ].join(" ")}
    >
      <Plus className="size-7" weight="bold" aria-hidden />
    </button>
  );
}
