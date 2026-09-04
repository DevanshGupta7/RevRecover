import {
  AlertCircle,
} from "lucide-react";

interface ErrorStateProps {
  title?: string;

  message?: string;

  onRetry?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load this data.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex min-h-48 items-center justify-center rounded-xl border border-red-400/20 bg-[#211918] p-6" role="alert">
      <div className="max-w-md text-center">
        <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10">
          <AlertCircle className="h-4 w-4 text-red-400" />
        </div>

        <h3 className="mt-3 text-sm font-medium text-zinc-200">
          {title}
        </h3>

        <p className="mt-1 text-xs leading-5 text-zinc-400">
          {message}
        </p>

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-4 rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
}
