"use client";

import {
  useState,
} from "react";

import {
  Input,
} from "@/components/ui/input";

import type {
  RecoverySettings as RecoverySettingsType,
} from "@/types/settings";

interface RecoverySettingsProps {
  initialSettings: RecoverySettingsType;
}

function SettingRow({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
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

      <div className="shrink-0">
        {children}
      </div>
    </div>
  );
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
        className={`absolute top-1 h-4 w-4 rounded-full transition-transform ${
          checked
            ? "translate-x-5 bg-emerald-400"
            : "translate-x-1 bg-zinc-600"
        }`}
      />
    </button>
  );
}

export function RecoverySettings({
  initialSettings,
}: RecoverySettingsProps) {
  const [settings, setSettings] =
    useState<RecoverySettingsType>(
      initialSettings
    );

  function updateSetting<
    K extends keyof RecoverySettingsType
  >(
    key: K,
    value: RecoverySettingsType[K]
  ) {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));
  }

  return (
    <div>
      <SettingRow
        title="Automatic recovery"
        description="Automatically execute eligible recovery actions selected by the RevRecover decision engine."
      >
        <Toggle
          checked={settings.automaticRecovery}
          onChange={(value) =>
            updateSetting(
              "automaticRecovery",
              value
            )
          }
          label="Automatic recovery"
        />
      </SettingRow>

      <SettingRow
        title="Maximum retry attempts"
        description="Maximum number of payment recovery attempts allowed for a single recovery case."
      >
        <Input
          type="number"
          min={1}
          max={5}
          value={settings.maximumRetryAttempts}
          onChange={(event) =>
            updateSetting(
              "maximumRetryAttempts",
              Math.max(
                1,
                Math.min(
                  5,
                  Number(event.target.value)
                )
              )
            )
          }
          className="h-9 w-24 border-zinc-800 bg-zinc-900 text-center text-sm text-zinc-300"
        />
      </SettingRow>

      <SettingRow
        title="Recovery window"
        description="Maximum amount of time RevRecover can continue attempting recovery after a payment failure."
      >
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min={1}
            max={720}
            value={settings.recoveryWindowHours}
            onChange={(event) =>
              updateSetting(
                "recoveryWindowHours",
                Math.max(
                  1,
                  Math.min(
                    720,
                    Number(event.target.value)
                  )
                )
              )
            }
            className="h-9 w-24 border-zinc-800 bg-zinc-900 text-center text-sm text-zinc-300"
          />

          <span className="text-xs text-zinc-600">
            hours
          </span>
        </div>
      </SettingRow>

      <SettingRow
        title="Minimum recovery amount"
        description="Payments below this amount will not automatically enter the recovery workflow."
      >
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-600">
            ₹
          </span>

          <Input
            type="number"
            min={0}
            value={settings.minimumRecoveryAmount}
            onChange={(event) =>
              updateSetting(
                "minimumRecoveryAmount",
                Math.max(
                  0,
                  Number(event.target.value)
                )
              )
            }
            className="h-9 w-28 border-zinc-800 bg-zinc-900 text-center text-sm text-zinc-300"
          />
        </div>
      </SettingRow>

      <SettingRow
        title="Email customer contact"
        description="Allow RevRecover to send recovery-related emails to customers."
      >
        <Toggle
          checked={settings.emailCustomerContact}
          onChange={(value) =>
            updateSetting(
              "emailCustomerContact",
              value
            )
          }
          label="Email customer contact"
        />
      </SettingRow>

      <SettingRow
        title="SMS customer contact"
        description="Allow RevRecover to send recovery-related SMS messages to customers."
      >
        <Toggle
          checked={settings.smsCustomerContact}
          onChange={(value) =>
            updateSetting(
              "smsCustomerContact",
              value
            )
          }
          label="SMS customer contact"
        />
      </SettingRow>
    </div>
  );
}
