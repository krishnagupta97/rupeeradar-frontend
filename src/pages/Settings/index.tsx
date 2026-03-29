import { GearSix } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { useApp } from "../../contexts/useApp";
import { endpoints } from "../../services/endpoints";
import { get } from "../../services/networkHandler";
import type { User } from "../../services/types";
import { Skeleton } from "../../skeleton";
import { AppearanceSettings } from "./components/AppearanceSettings";
import { ProfilePanel } from "./components/ProfilePanel";

export default function SettingsPage() {
  const { user: ctxUser } = useApp();
  const [remoteUser, setRemoteUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const u = await get<User>(endpoints.USER_ME);
        if (!cancelled) setRemoteUser(u);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load profile");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const user = remoteUser ?? ctxUser;

  if (loading && !user) {
    return <Skeleton type="settings" />;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header className="flex items-start gap-3">
        <div className="flex size-11 items-center justify-center rounded-2xl bg-[var(--md-primary-container)] text-[var(--md-on-primary-container)] shadow-[var(--md-elev-1)]">
          <GearSix className="size-6" weight="duotone" aria-hidden />
        </div>
        <div>
          <h1 className="md-page-title text-2xl">Settings</h1>
          <p className="md-page-sub mt-1 text-sm">
            Profile via{" "}
            <code className="rounded-md bg-[var(--md-surface-container-high)] px-1.5 py-0.5 text-xs text-[var(--md-on-surface-variant)]">
              get(endpoints.USER_ME)
            </code>
            .
          </p>
        </div>
      </header>

      <AppearanceSettings />

      {error ? (
        <div className="md-error-banner p-4 text-sm">{error}</div>
      ) : null}

      {user ? <ProfilePanel user={user} /> : null}

      <section className="md-card p-4 text-sm text-[var(--md-on-surface-variant)]">
        <p>
          Login is omitted for now. When you wire a real API, swap{" "}
          <code className="rounded bg-[var(--md-surface-container-high)] px-1 py-0.5 text-[var(--md-on-surface)]">
            networkHandler
          </code>{" "}
          to call your backend and keep the same endpoint keys.
        </p>
      </section>
    </div>
  );
}
