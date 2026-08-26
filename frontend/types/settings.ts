export interface RecoverySettings {
  automaticRecovery: boolean;
  maximumRetryAttempts: number;
  recoveryWindowHours: number;
  minimumRecoveryAmount: number;
  emailCustomerContact: boolean;
  smsCustomerContact: boolean;
}

export interface NotificationSettings {
  recoverySucceeded: boolean;
  recoveryFailed: boolean;
  highValueRecoveryAlerts: boolean;
}

export interface OrganisationSettings {
  organisationName: string;
  organisationId: string;
  plan: string;
}

export interface SettingsData {
  recovery: RecoverySettings;
  notifications: NotificationSettings;
  organisation: OrganisationSettings;
}
