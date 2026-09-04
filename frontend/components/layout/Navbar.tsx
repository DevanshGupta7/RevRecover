"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  ChevronDown,
  Menu,
  PanelLeft,
} from "lucide-react";

import { APP_NAME } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/auth-context";

interface NavbarProps {
  onMobileMenuOpen: () => void;
  onSidebarToggle: () => void;
}

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/payments": "Failed Payments",
  "/recovery": "Recovery Cases",
  "/customers": "Customers",
  "/strategies": "Recovery Strategies",
  "/analytics": "Analytics",
  "/audit": "Audit Logs",
  "/settings": "Settings",
};

function getPageTitle(pathname: string) {
  if (PAGE_TITLES[pathname]) {
    return PAGE_TITLES[pathname];
  }

  if (pathname.startsWith("/payments/")) {
    return "Payment Details";
  }

  if (pathname.startsWith("/recovery/")) {
    return "Recovery Case";
  }

  if (pathname.startsWith("/customers/")) {
    return "Customer Details";
  }

  return APP_NAME;
}

export function Navbar({
  onMobileMenuOpen,
  onSidebarToggle,
}: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const pageTitle = getPageTitle(pathname);

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  const userInitials = user?.full_name
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "RR";

  return (
    <header className="sticky top-0 z-30 flex h-[76px] shrink-0 items-center justify-between border-b border-[var(--border)] bg-[#0d151d]/88 px-4 backdrop-blur-xl md:px-8">
      {/* Left side */}
      <div className="flex min-w-0 items-center gap-3">
        {/* Mobile menu */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onMobileMenuOpen}
          className="text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100 xl:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Desktop sidebar toggle */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onSidebarToggle}
          className="hidden text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100 xl:flex"
          aria-label="Toggle sidebar"
          title="Toggle sidebar"
        >
          <PanelLeft className="h-4 w-4" />
        </Button>

        <div className="h-5 w-px bg-[var(--border)]" />

        <div className="min-w-0">
          <h1 className="truncate text-sm font-semibold tracking-tight text-zinc-100">
            {pageTitle}
          </h1>

          <p className="hidden text-xs text-[#81918a] sm:block">
            Revenue recovery intelligence
          </p>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-1">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="relative text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
              aria-label="Notifications"
              title="Notifications"
            >
              <Bell className="h-4 w-4" />

              <span
                className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#f4b183]"
                aria-hidden="true"
              />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-64 border-[var(--border)] bg-[var(--popover)] text-zinc-200">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[var(--border)]" />
            <DropdownMenuItem className="cursor-default text-xs text-[var(--muted-foreground)] focus:bg-transparent">
              No new notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="mx-3 hidden h-7 w-px bg-[var(--border)] sm:block" />

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-10 gap-2 rounded-lg border border-transparent px-2.5 text-zinc-300 hover:border-[var(--border)] hover:bg-[#1d2935] hover:text-zinc-100"
            >
              <Avatar className="h-7 w-7">
                <AvatarFallback className="border border-[#526b7b] bg-[#253746] text-xs text-zinc-100">
                  {userInitials}
                </AvatarFallback>
              </Avatar>

              <div className="hidden text-left sm:block">
                <p className="text-xs font-medium">{user?.full_name ?? "RevRecover User"}</p>
                <p className="text-[10px] text-zinc-500">{user?.role ?? "User"}</p>
              </div>

              <ChevronDown className="hidden h-3.5 w-3.5 text-zinc-500 sm:block" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-64 border-[var(--border)] bg-[var(--popover)] p-1.5 text-zinc-200 shadow-2xl shadow-black/25"
          >
            <DropdownMenuLabel className="px-3 py-2.5">
              <span className="block text-xs font-medium text-zinc-100">
                {user?.full_name ?? "RevRecover User"}
              </span>
              <span className="mt-0.5 block text-[11px] font-normal text-[var(--muted-foreground)]">
                {user?.email ?? "Account"}
              </span>
            </DropdownMenuLabel>

            <DropdownMenuSeparator className="bg-zinc-800" />

            <DropdownMenuItem
              className="cursor-pointer rounded-md px-3 focus:bg-[#2a3942]"
              onSelect={() => router.push("/settings")}
            >
              Profile
            </DropdownMenuItem>

            <DropdownMenuItem
              className="cursor-pointer rounded-md px-3 focus:bg-[#2a3942]"
              onSelect={() => router.push("/settings")}
            >
              Settings
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-zinc-800" />

            <DropdownMenuItem
              className="cursor-pointer rounded-md text-zinc-400 focus:bg-[#2a3942] focus:text-zinc-100"
              onSelect={handleLogout}
            >
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
