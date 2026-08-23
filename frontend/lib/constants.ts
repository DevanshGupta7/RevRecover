export const APP_NAME = "RevRecover";

export const APP_DESCRIPTION =
  "Recover revenue that would otherwise be lost";

export const NAVIGATION = {
  overview: [
    {
      label: "Dashboard",
      href: "/dashboard",
    },
  ],

  revenueRecovery: [
    {
      label: "Failed Payments",
      href: "/payments",
    },
    {
      label: "Recovery Cases",
      href: "/recovery",
    },
    {
      label: "Customers",
      href: "/customers",
    },
  ],

  intelligence: [
    {
      label: "Recovery Strategies",
      href: "/strategies",
    },
    {
      label: "Analytics",
      href: "/analytics",
    },
  ],

  system: [
    {
      label: "Audit Logs",
      href: "/audit",
    },
    {
      label: "Settings",
      href: "/settings",
    },
  ],
} as const;
