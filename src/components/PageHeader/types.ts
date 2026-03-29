import type { ReactNode } from "react";

export interface PageHeaderProps {
  title: string;
  subtitle?: ReactNode;
  /** Icon(s) placed inside the tonal square (e.g. `<ChartPie className="size-5 md:size-6" weight="duotone" />`). */
  icon: ReactNode;
  /** Primary actions (e.g. Add button); shown from `md+` only — use `MobileAddFab` on small screens. */
  actions?: ReactNode;
}
