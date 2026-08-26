"use client";

import {
  useState,
} from "react";

import type {
  NotificationSettings as NotificationSettingsType,
} from "@/types/settings";

interface NotificationSettingsProps {
  initialSettings: NotificationSettingsType;
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full border transition-colors ${
        checked
          ? "border-emerald-500/40 bg-emerald-500/20"
          : "border-zinc-700 bg-zinc-900"
      }`}
    >
      <span
        className={`absolute left-1 top-1 h-4 w-4 rounded-full transition-transform duration-200 ${
          checked
            ? "translate-x-5 bg-emerald-400"
            : "translate-x-0 bg-zinc-600"
        }`}
      />
    </button>
  );
}

function NotificationRow({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 sm:max-w-xl">
        <p className="text-sm font-medium text-zinc-300">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-zinc-600">
          {description}
        </p>
      </div>

      <Toggle
        checked={checked}
        onChange={onChange}
        label={title}
      />
    </div>
  );
}

export function NotificationSettings({
  initialSettings,
}: NotificationSettingsProps) {
  const [settings, setSettings] =
    useState<NotificationSettingsType>(
      initialSettings
    );

  return (
    <div>
      <NotificationRow
        title="Recovery succeeded"
        description="Notify you when RevRecover successfully recovers revenue."
        checked={settings.recoverySucceeded}
        onChange={(value) =>
          setSettings((current) => ({
            ...current,
            recoverySucceeded: value,
          }))
        }
      />

      <NotificationRow
        title="Recovery failed"
        description="Notify you when a recovery workflow fails or reaches its retry limit."
        checked={settings.recoveryFailed}
        onChange={(value) =>
          setSettings((current) => ({
            ...current,
            recoveryFailed: value,
          }))
        }
      />

      <NotificationRow
        title="High-value recovery alerts"
        description="Notify you when a high-value payment requires attention or manual intervention."
        checked={
          settings.highValueRecoveryAlerts
        }
        onChange={(value) =>
          setSettings((current) => ({
            ...current,
            highValueRecoveryAlerts: value,
          }))
        }
      />
    </div>
  );
}
