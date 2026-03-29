import { Link } from "react-router-dom";
import type { ButtonLinkProps, ButtonProps } from "./types";

const base =
  "cursor-pointer inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "rounded-full border-0 bg-[var(--md-primary)] px-5 py-2.5 text-sm text-[var(--md-on-primary)] shadow-[var(--md-elev-1)] hover:opacity-90",
  text: "rounded-full border-0 bg-transparent px-5 py-2.5 text-sm text-[var(--md-primary)] hover:bg-[color-mix(in_srgb,var(--md-primary)_12%,transparent)]",
  chip:
    "rounded-full border-0 px-4 py-2 text-sm capitalize transition-all duration-200",
  segment: "rounded-full border-0 px-4 py-2 text-sm transition-all duration-200",
  overlay:
    "absolute inset-0 box-border cursor-pointer border-0 bg-[color-mix(in_srgb,var(--md-on-surface)_45%,transparent)] p-0 backdrop-blur-[2px]",
  icon: "cursor-pointer rounded-full border-0 bg-transparent p-2 text-[var(--md-on-surface-variant)] transition-colors hover:bg-[var(--md-surface-container)]",
};

function chipState(active: boolean): string {
  return active ? "md-chip-active" : "md-chip-idle";
}

function segmentState(
  active: boolean,
  tone: NonNullable<ButtonProps["segmentTone"]>,
): string {
  if (active) {
    if (tone === "light") {
      return "bg-[var(--md-surface)] text-[var(--md-primary)] shadow-[var(--md-elev-1)]";
    }
    return "bg-[var(--md-surface-container)] text-[var(--md-primary)] shadow-[var(--md-elev-1)]";
  }
  return "text-[var(--md-on-surface-variant)] hover:text-[var(--md-on-surface)]";
}

function composeButtonClass(
  variant: NonNullable<ButtonProps["variant"]>,
  options: {
    chipActive?: boolean;
    segmentActive?: boolean;
    segmentTone?: ButtonProps["segmentTone"];
    className?: string;
  } = {},
): string {
  const { chipActive, segmentActive, segmentTone = "light", className } = options;

  if (variant === "overlay") {
    return [variants.overlay, className].filter(Boolean).join(" ");
  }
  if (variant === "icon") {
    return [variants.icon, className].filter(Boolean).join(" ");
  }

  let extra = "";
  if (variant === "chip") {
    extra = chipState(Boolean(chipActive));
  }
  if (variant === "segment") {
    extra = segmentState(Boolean(segmentActive), segmentTone);
  }

  return [base, variants[variant], extra, className].filter(Boolean).join(" ");
}

export function Button({
  variant = "primary",
  chipActive,
  segmentActive,
  segmentTone = "light",
  className,
  type = "button",
  ...rest
}: ButtonProps) {
  const cls = composeButtonClass(variant, {
    chipActive,
    segmentActive,
    segmentTone,
    className,
  });
  return <button type={type} className={cls} {...rest} />;
}

export function ButtonLink({
  variant = "text",
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  const cls = composeButtonClass(variant, { className });
  return (
    <Link className={cls} {...rest}>
      {children}
    </Link>
  );
}
