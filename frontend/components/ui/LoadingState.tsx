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
    <div className="flex min-h-48 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950">
      <div className="flex items-center gap-2 text-sm text-zinc-600">
        <Loader2 className="h-4 w-4 animate-spin" />

        {message}
      </div>
    </div>
  );
}
