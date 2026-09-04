"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";

interface DashboardShellProps {
  children: React.ReactNode;
}

const SIDEBAR_STORAGE_KEY = "revrecover.sidebar-collapsed";
const subscribeToSidebarPreference = () => () => undefined;
const getSidebarPreference = () =>
  window.localStorage.getItem(SIDEBAR_STORAGE_KEY) === "true";
const getServerSidebarPreference = () => false;

export function DashboardShell({
  children,
}: DashboardShellProps) {
  const storedSidebarCollapsed = useSyncExternalStore(
    subscribeToSidebarPreference,
    getSidebarPreference,
    getServerSidebarPreference
  );
  const [sidebarCollapsed, setSidebarCollapsed] = useState(storedSidebarCollapsed);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed((current) => {
      const next = !current;
      window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(next));
      return next;
    });
  };

  useEffect(() => {
    const handleKeyboardShortcut = (event: KeyboardEvent) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "b"
      ) {
        event.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener("keydown", handleKeyboardShortcut);

    return () => {
      window.removeEventListener("keydown", handleKeyboardShortcut);
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Desktop Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
      />

      {/* Mobile Sidebar */}
      <Sheet
        open={mobileMenuOpen}
        onOpenChange={setMobileMenuOpen}
      >
        <SheetContent
          side="left"
          className="w-[280px] border-[var(--border)] bg-[var(--background)] p-0 text-[var(--foreground)]"
        >
          <SheetTitle className="sr-only">
            Navigation menu
          </SheetTitle>

          <SheetDescription className="sr-only">
            RevRecover application navigation
          </SheetDescription>

          <Sidebar
            collapsed={false}
            onToggle={() => undefined}
            onNavigate={() => setMobileMenuOpen(false)}
            mobile
          />
        </SheetContent>
      </Sheet>

      {/* Main application */}
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar
          onMobileMenuOpen={() => setMobileMenuOpen(true)}
          onSidebarToggle={toggleSidebar}
        />

        <main className="dashboard-background min-w-0 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
