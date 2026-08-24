"use client";

import {
  useState,
} from "react";

import {
  Input,
} from "@/components/ui/input";

import type {
  OrganisationSettings as OrganisationSettingsType,
} from "@/types/settings";

interface OrganisationSettingsProps {
  initialSettings: OrganisationSettingsType;
}

export function OrganisationSettings({
  initialSettings,
}: OrganisationSettingsProps) {
  const [organisationName, setOrganisationName] =
    useState(
      initialSettings.organisationName
    );

  return (
    <div>
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 sm:max-w-xl">
          <p className="text-sm font-medium text-zinc-300">
            Organisation name
          </p>

          <p className="mt-1 text-xs leading-5 text-zinc-600">
            The name displayed throughout your RevRecover
            workspace.
          </p>
        </div>

        <Input
          value={organisationName}
          onChange={(event) =>
            setOrganisationName(event.target.value)
          }
          className="h-9 w-full border-zinc-800 bg-zinc-900 text-sm text-zinc-300 sm:w-72"
        />
      </div>

      <div className="flex flex-col gap-2 p-5">
        <p className="text-sm font-medium text-zinc-300">
          Account information
        </p>

        <p className="text-xs leading-5 text-zinc-600">
          Information associated with this RevRecover
          organisation.
        </p>
      </div>

      <div className="grid gap-4 border-t border-zinc-800 p-5 sm:grid-cols-2">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-wider text-zinc-700">
            Organisation ID
          </p>

          <p className="mt-1 truncate font-mono text-xs text-zinc-400">
            {initialSettings.organisationId}
          </p>
        </div>

        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-wider text-zinc-700">
            Plan
          </p>

          <p className="mt-1 text-xs text-zinc-400">
            {initialSettings.plan}
          </p>
        </div>
      </div>
    </div>
  );
}
