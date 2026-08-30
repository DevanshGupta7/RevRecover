"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-zinc-100">
        <p className="text-sm text-zinc-300">Loading...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-zinc-100">
      <div className="w-full max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-950/80 p-8 text-center shadow-2xl shadow-black/30">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-400">
          Revenue intelligence
        </p>

        <h1 className="mt-5 text-4xl font-bold tracking-tight text-zinc-50 sm:text-5xl">
          Recover revenue before it slips away.
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-base text-zinc-400">
          RevRecover helps teams detect failed payments, automate recovery workflows, and focus on the opportunities that matter most.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild className="h-11 min-w-32 bg-zinc-100 text-zinc-950 hover:bg-zinc-200">
            <Link href="/login">Sign In</Link>
          </Button>

          <Button asChild variant="outline" className="h-11 min-w-32 border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800">
            <Link href="/register">Get Started</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
