import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { LinkProps } from "react-router-dom";

export type ButtonVariant =
  | "primary"
  | "text"
  | "chip"
  | "segment"
  | "overlay"
  | "icon";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  /** Used with `variant="chip"`. */
  chipActive?: boolean;
  /** Used with `variant="segment"` (theme toggles). */
  segmentActive?: boolean;
  /** Selected surface for segment: Light uses `default`, Dark uses `container`. */
  segmentTone?: "light" | "dark";
  children?: ReactNode;
}

export type ButtonLinkProps = Omit<LinkProps, "className"> & {
  variant?: "primary" | "text";
  className?: string;
  children?: ReactNode;
};
