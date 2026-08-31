"use client";

import { Suspense, useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { useAuth } from "@/contexts/auth-context";
import { ApiError } from "@/lib/api-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function getSafeRedirectTarget(value: string | null) {
  const fallback = "/dashboard";

  if (!value) {
    return fallback;
  }

  try {
    const decoded = decodeURIComponent(value);

    if (!decoded.startsWith("/")) {
      return fallback;
    }

    if (decoded.startsWith("//")) {
      return fallback;
    }

    return decoded;
  } catch {
    return fallback;
  }
}

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const redirectTarget = useMemo(
    () => getSafeRedirectTarget(searchParams.get("next")),
    [searchParams]
  );

  const successMessage =
    searchParams.get("registered") === "1"
      ? "Account created successfully. Please sign in."
      : null;

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace(redirectTarget);
    }
  }, [authLoading, isAuthenticated, redirectTarget, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setIsSubmitting(true);
      await login({
        email: email.trim(),
        password,
      });

      router.replace(redirectTarget);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401) {
          setError("Invalid email or password.");
        } else if (err.status === 0) {
          setError("Unable to connect to RevRecover. Please try again.");
        } else {
          setError(err.message);
        }
      } else {
        setError("Unable to sign in. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (authLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-zinc-100">
        <p className="text-sm text-zinc-300">Loading...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-zinc-100">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6 shadow-2xl shadow-black/30">
        <div className="mb-8 text-center">
          <Link href="/" className="text-2xl font-bold tracking-tight text-zinc-100">
            RevRecover
          </Link>

          <h1 className="mt-6 text-3xl font-semibold text-zinc-100">Welcome back</h1>
          <p className="mt-2 text-sm text-zinc-400">Sign in to your RevRecover account</p>
        </div>

        {successMessage && (
          <div className="mb-4 rounded-md border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm text-emerald-300">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-zinc-200">
              Email
            </label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              disabled={isSubmitting}
              className="h-11 border-zinc-700 bg-zinc-900 text-zinc-100 placeholder:text-zinc-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-zinc-200">
              Password
            </label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              disabled={isSubmitting}
              className="h-11 border-zinc-700 bg-zinc-900 text-zinc-100 placeholder:text-zinc-500"
            />
          </div>

          <Button type="submit" disabled={isSubmitting} className="h-11 w-full bg-zinc-100 text-zinc-950 hover:bg-zinc-200">
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-400">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-medium text-zinc-100 underline underline-offset-4">
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-zinc-100">
          <p className="text-sm text-zinc-300">Loading...</p>
        </main>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
