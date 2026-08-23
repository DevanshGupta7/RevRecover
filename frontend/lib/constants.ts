import type { LucideIcon } from "lucide-react";
import {
  Activity,
  BarChart3,
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  Settings,
  Sparkles,
  Users,
} from "lucide-react";

export const APP_NAME = "RevRecover";

export const APP_DESCRIPTION =
  "Recover revenue that would otherwise be lost";

export interface NavigationItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface NavigationSection {
  label: string;
  items: NavigationItem[];
}

export const NAVIGATION: NavigationSection[] = [
  {
    label: "Overview",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "Revenue Recovery",
    items: [
      {
        label: "Failed Payments",
        href: "/payments",
        icon: CreditCard,
      },
      {
        label: "Recovery Cases",
        href: "/recovery",
        icon: Activity,
      },
      {
        label: "Customers",
        href: "/customers",
        icon: Users,
      },
    ],
  },
  {
    label: "Intelligence",
    items: [
      {
        label: "Recovery Strategies",
        href: "/strategies",
        icon: Sparkles,
      },
      {
        label: "Analytics",
        href: "/analytics",
        icon: BarChart3,
      },
    ],
  },
  {
    label: "System",
    items: [
      {
        label: "Audit Logs",
        href: "/audit",
        icon: ClipboardList,
      },
      {
        label: "Settings",
        href: "/settings",
        icon: Settings,
      },
    ],
  },
];
