import {
  Loader2,
} from "lucide-react";

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({
  message = "Loading...",
}: LoadingStateProps) {
  return (
    <div className="flex min-h-48 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--card)]" aria-live="polite" aria-busy="true">
      <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
        <Loader2 className="h-4 w-4 animate-spin" />

        {message}
      </div>
    </div>
  );
}
