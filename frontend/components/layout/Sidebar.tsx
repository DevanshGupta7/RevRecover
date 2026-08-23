"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight, Zap } from "lucide-react";

import { NAVIGATION } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  onNavigate?: () => void;
  mobile?: boolean;
}

export function Sidebar({
  collapsed,
  onToggle,
  onNavigate,
  mobile = false,
}: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-zinc-800 bg-zinc-950",
        mobile
          ? "w-full"
          : cn(
              "hidden shrink-0 transition-[width] duration-200 xl:flex",
              collapsed ? "w-[72px]" : "w-64"
            )
      )}
      aria-label="Main navigation"
    >
      {/* Brand */}
      <div
        className={cn(
          "flex h-16 shrink-0 items-center border-b border-zinc-800",
          collapsed && !mobile ? "justify-center px-2" : "px-4"
        )}
      >
        <Link
          href="/dashboard"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
          aria-label="RevRecover Dashboard"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900">
            <Zap className="h-4 w-4 text-zinc-100" />
          </div>

          {(!collapsed || mobile) && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight text-zinc-100">
                REVRECOVER
              </span>

              <span className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">
                Revenue Intelligence
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="min-h-0 flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto px-3 py-4">
          <div className="space-y-6">
            {NAVIGATION.map((section) => (
              <div key={section.label}>
                {(!collapsed || mobile) && (
                  <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
                    {section.label}
                  </p>
                )}

                <div className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);

                    const link = (
                      <Link
                        href={item.href}
                        onClick={onNavigate}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "group flex h-10 items-center rounded-md text-sm transition-colors",
                          collapsed && !mobile
                            ? "justify-center px-2"
                            : "gap-3 px-3",
                          active
                            ? "bg-zinc-800 text-zinc-100"
                            : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-4 w-4 shrink-0",
                            active
                              ? "text-zinc-100"
                              : "text-zinc-500 group-hover:text-zinc-300"
                          )}
                          aria-hidden="true"
                        />

                        {(!collapsed || mobile) && (
                          <span className="truncate">{item.label}</span>
                        )}
                      </Link>
                    );

                    if (collapsed && !mobile) {
                      return (
                        <Tooltip key={item.href}>
                          <TooltipTrigger asChild>{link}</TooltipTrigger>

                          <TooltipContent side="right">
                            {item.label}
                          </TooltipContent>
                        </Tooltip>
                      );
                    }

                    return <div key={item.href}>{link}</div>;
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </nav>

      {/* Collapse button */}
      {!mobile && (
        <div className="hidden shrink-0 border-t border-zinc-800 p-3 xl:block">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="w-full text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      )}
    </aside>
  );
}
