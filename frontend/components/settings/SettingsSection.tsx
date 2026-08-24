import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

interface SettingsSectionProps {
  title: string;
  description: string;
  icon: LucideIcon;
  children: ReactNode;
}

export function SettingsSection({
  title,
  description,
  icon: Icon,
  children,
}: SettingsSectionProps) {
  return (
    <section className="min-w-0 rounded-xl border border-zinc-800 bg-zinc-950">
      <div className="flex items-start gap-3 border-b border-zinc-800 p-5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900">
          <Icon className="h-4 w-4 text-zinc-400" />
        </div>

        <div className="min-w-0">
          <h2 className="text-sm font-medium text-zinc-100">
            {title}
          </h2>

          <p className="mt-1 text-xs leading-5 text-zinc-600">
            {description}
          </p>
        </div>
      </div>

      <div className="min-w-0 divide-y divide-zinc-800">
        {children}
      </div>
    </section>
  );
}
