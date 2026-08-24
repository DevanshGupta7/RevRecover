import {
  Bell,
  Building2,
  Settings as SettingsIcon,
  ShieldCheck,
} from "lucide-react";

import { SettingsSection } from "@/components/settings/SettingsSection";
import { RecoverySettings } from "@/components/settings/RecoverySettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { OrganisationSettings } from "@/components/settings/OrganisationSettings";

import { getSettings } from "@/services/settings.service";

export default function SettingsPage() {
  const settings = getSettings();

  return (
    <div className="min-h-full min-w-0 overflow-x-hidden">
      <div className="mx-auto w-full max-w-[1100px] min-w-0 p-5 md:p-8">
        {/* Header */}
        <section className="mb-8">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900">
              <SettingsIcon className="h-4 w-4 text-zinc-300" />
            </div>

            <div className="min-w-0">
              <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
                Settings
              </h1>

              <p className="mt-1 max-w-2xl text-sm text-zinc-500">
                Configure how RevRecover evaluates and
                executes recovery.
              </p>
            </div>
          </div>
        </section>

        {/* Recovery configuration */}
        <div className="space-y-6">
          <SettingsSection
            title="Recovery Configuration"
            description="Control how RevRecover identifies and executes recovery opportunities."
            icon={ShieldCheck}
          >
            <RecoverySettings
              initialSettings={settings.recovery}
            />
          </SettingsSection>

          {/* Notifications */}
          <SettingsSection
            title="Notifications"
            description="Choose which recovery events should generate notifications."
            icon={Bell}
          >
            <NotificationSettings
              initialSettings={
                settings.notifications
              }
            />
          </SettingsSection>

          {/* Organisation */}
          <SettingsSection
            title="Organisation"
            description="Manage the organisation information associated with your RevRecover workspace."
            icon={Building2}
          >
            <OrganisationSettings
              initialSettings={
                settings.organisation
              }
            />
          </SettingsSection>
        </div>

        {/* Footer note */}
        <div className="mt-6 rounded-lg border border-zinc-800/70 bg-zinc-950/50 p-4">
          <p className="text-xs leading-5 text-zinc-600">
            Settings are currently stored locally in the
            frontend. They will be persisted through the
            RevRecover API when backend integration is enabled.
          </p>
        </div>
      </div>
    </div>
  );
}
