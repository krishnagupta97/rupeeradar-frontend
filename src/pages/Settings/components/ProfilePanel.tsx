import { EnvelopeSimple, Globe, UserCircle, CurrencyInr } from "@phosphor-icons/react";
import type { User } from "../../../services/types";

export interface ProfilePanelProps {
  user: User;
}

export function ProfilePanel({ user }: ProfilePanelProps) {
  const fields = [
    {
      label: "Name",
      value: user.name,
      Icon: UserCircle,
    },
    {
      label: "Email",
      value: user.email,
      Icon: EnvelopeSimple,
    },
    {
      label: "Currency",
      value: user.currency,
      Icon: CurrencyInr,
    },
    {
      label: "Timezone",
      value: user.timezone,
      Icon: Globe,
    },
  ] as const;

  return (
    <section className="md-card p-5">
      <h2 className="text-base font-medium text-[var(--md-on-surface)]">
        Profile
      </h2>
      <p className="mt-0.5 text-sm text-[var(--md-on-surface-variant)]">
        Details from your account (mock API).
      </p>
      <dl className="mt-5 grid gap-3 sm:grid-cols-2">
        {fields.map(({ label, value, Icon }) => (
          <div
            key={label}
            className="flex gap-3 rounded-xl border border-[color-mix(in_srgb,var(--md-outline-variant)_55%,transparent)] bg-[var(--md-surface-container-high)] p-4 shadow-[var(--md-elev-1)]"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--md-primary-container)] text-[var(--md-on-primary-container)]">
              <Icon className="size-5" weight="duotone" aria-hidden />
            </div>
            <div className="min-w-0">
              <dt className="text-xs font-medium uppercase tracking-wide text-[var(--md-on-surface-variant)]">
                {label}
              </dt>
              <dd className="mt-1 truncate text-sm font-medium text-[var(--md-on-surface)]">
                {value}
              </dd>
            </div>
          </div>
        ))}
      </dl>
    </section>
  );
}
