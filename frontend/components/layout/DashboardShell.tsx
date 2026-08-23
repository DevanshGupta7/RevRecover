"use client";

import { useEffect, useState } from "react";

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

export function DashboardShell({
  children,
}: DashboardShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed((current) => !current);
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
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100">
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
          className="w-[280px] border-zinc-800 bg-zinc-950 p-0 text-zinc-100"
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

        <main className="min-w-0 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
