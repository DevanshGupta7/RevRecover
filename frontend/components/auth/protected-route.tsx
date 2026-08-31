"use client";

import { Suspense, useEffect, type ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useAuth } from "@/contexts/auth-context";

interface ProtectedRouteProps {
  children: ReactNode;
}

function buildLoginRedirect(pathname: string, search: string) {
  const nextTarget = `${pathname}${search}`;

  if (!pathname || pathname === "/login" || pathname === "/register") {
    return "/login?next=%2Fdashboard";
  }

  return `/login?next=${encodeURIComponent(nextTarget)}`;
}

function ProtectedRouteContent({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const target = buildLoginRedirect(pathname, `?${searchParams.toString()}`);
      router.replace(target);
    }
  }, [isLoading, isAuthenticated, pathname, searchParams, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-100">
        <p className="text-sm text-zinc-300">Checking session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-100">
          <p className="text-sm text-zinc-300">Checking session...</p>
        </div>
      }
    >
      <ProtectedRouteContent>{children}</ProtectedRouteContent>
    </Suspense>
  );
}
