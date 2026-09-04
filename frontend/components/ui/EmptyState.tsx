import {
  Inbox,
} from "lucide-react";

interface EmptyStateProps {
  title?: string;

  message?: string;
}

export function EmptyState({
  title = "No data found",
  message = "There is nothing to display here yet.",
}: EmptyStateProps) {
  return (
    <div className="flex min-h-48 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
      <div className="max-w-md text-center">
        <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900">
          <Inbox className="h-4 w-4 text-zinc-500" />
        </div>

        <h3 className="mt-3 text-sm font-medium text-zinc-300">
          {title}
        </h3>

        <p className="mt-1 text-xs leading-5 text-[var(--muted-foreground)]">
          {message}
        </p>
      </div>
    </div>
  );
}
