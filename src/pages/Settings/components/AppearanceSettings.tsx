import { Moon, Sun } from "@phosphor-icons/react";
import { Button } from "../../../components/Button";
import { useApp } from "../../../contexts/useApp";
import type { ColorScheme } from "../../../contexts/types";

export function AppearanceSettings() {
  const { colorScheme, setColorScheme } = useApp();
  const isDark = colorScheme === "dark";

  const select = (scheme: ColorScheme) => {
    setColorScheme(scheme);
  };

  return (
    <section className="md-card p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-[var(--md-primary-container)] text-[var(--md-on-primary-container)] shadow-[var(--md-elev-1)]">
            {isDark ? (
              <Moon className="size-5" weight="duotone" aria-hidden />
            ) : (
              <Sun className="size-5" weight="duotone" aria-hidden />
            )}
          </div>
          <div>
            <h2 className="text-base font-medium text-[var(--md-on-surface)]">
              Appearance
            </h2>
            <p className="mt-0.5 text-sm text-[var(--md-on-surface-variant)]">
              Material-style light or dark surfaces across the app.
            </p>
          </div>
        </div>

        <div
          className="flex rounded-full bg-[var(--md-surface-container-high)] p-1 shadow-inner"
          role="group"
          aria-label="Theme"
        >
          <Button
            type="button"
            variant="segment"
            segmentTone="light"
            segmentActive={!isDark}
            onClick={() => select("light")}
            className="gap-2"
          >
            <Sun className="size-4" weight={!isDark ? "fill" : "duotone"} />
            Light
          </Button>
          <Button
            type="button"
            variant="segment"
            segmentTone="dark"
            segmentActive={isDark}
            onClick={() => select("dark")}
            className="gap-2"
          >
            <Moon className="size-4" weight={isDark ? "fill" : "duotone"} />
            Dark
          </Button>
        </div>
      </div>
    </section>
  );
}
