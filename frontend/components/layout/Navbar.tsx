"use client";

import { usePathname } from "next/navigation";
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
  const pageTitle = getPageTitle(pathname);

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-zinc-800 bg-zinc-950/95 px-4 backdrop-blur md:px-6">
      {/* Left side */}
      <div className="flex min-w-0 items-center gap-3">
        {/* Mobile menu */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onMobileMenuOpen}
          className="text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100 md:hidden"
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
          className="hidden text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100 md:flex"
          aria-label="Toggle sidebar"
          title="Toggle sidebar"
        >
          <PanelLeft className="h-4 w-4" />
        </Button>

        <div className="h-5 w-px bg-zinc-800" />

        <div className="min-w-0">
          <h1 className="truncate text-sm font-medium text-zinc-100">
            {pageTitle}
          </h1>

          <p className="hidden text-xs text-zinc-500 sm:block">
            Revenue recovery intelligence
          </p>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-1">
        {/* Notifications */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="relative text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />

          <span
            className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-zinc-100"
            aria-hidden="true"
          />
        </Button>

        <div className="mx-2 hidden h-6 w-px bg-zinc-800 sm:block" />

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-9 gap-2 px-2 text-zinc-300 hover:bg-zinc-900 hover:text-zinc-100"
            >
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-zinc-800 text-xs text-zinc-200">
                  DG
                </AvatarFallback>
              </Avatar>

              <div className="hidden text-left sm:block">
                <p className="text-xs font-medium">Devansh Gupta</p>
                <p className="text-[10px] text-zinc-500">Administrator</p>
              </div>

              <ChevronDown className="hidden h-3.5 w-3.5 text-zinc-500 sm:block" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-52 border-zinc-800 bg-zinc-950 text-zinc-200"
          >
            <DropdownMenuLabel>Account</DropdownMenuLabel>

            <DropdownMenuSeparator className="bg-zinc-800" />

            <DropdownMenuItem className="cursor-pointer focus:bg-zinc-900">
              Profile
            </DropdownMenuItem>

            <DropdownMenuItem className="cursor-pointer focus:bg-zinc-900">
              Settings
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-zinc-800" />

            <DropdownMenuItem className="cursor-pointer text-zinc-400 focus:bg-zinc-900 focus:text-zinc-100">
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
