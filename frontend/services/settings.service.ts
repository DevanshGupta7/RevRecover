import type {
  SettingsData,
} from "@/types/settings";

const SETTINGS_DATA: SettingsData = {
  recovery: {
    automaticRecovery: true,
    maximumRetryAttempts: 2,
    recoveryWindowHours: 72,
    minimumRecoveryAmount: 500,
    emailCustomerContact: true,
    smsCustomerContact: true,
  },

  notifications: {
    recoverySucceeded: true,
    recoveryFailed: true,
    highValueRecoveryAlerts: true,
  },

  organisation: {
    organisationName: "Acme Technologies",
    organisationId: "org_acme_001",
    plan: "Buildathon",
  },
};

export function getSettings(): SettingsData {
  return SETTINGS_DATA;
}
