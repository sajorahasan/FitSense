// Common utility types for FitSense

export type ID = string;
export type Timestamp = Date;
export type Email = string;

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  hasMore: boolean;
  nextCursor?: string;
}

// Form validation types
export interface ValidationError {
  field: string;
  message: string;
}

export interface FormState<T> {
  data: T;
  errors: ValidationError[];
  isValid: boolean;
  isSubmitting: boolean;
}

// Device and platform types
export type Platform = "ios" | "android" | "web";

export interface DeviceInfo {
  platform: Platform;
  version: string;
  model?: string;
  isEmulator: boolean;
}

// Sync status types
export type SyncStatus = "idle" | "syncing" | "success" | "error";

export interface SyncState {
  status: SyncStatus;
  lastSyncAt?: Date;
  error?: string;
  pendingChanges: number;
}

// Theme and UI types
export type ThemeMode = "light" | "dark" | "system";

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
  border: string;
  success: string;
  warning: string;
  error: string;
}

// Navigation types
export type ScreenName =
  | "Dashboard"
  | "LogWorkout"
  | "LogMeal"
  | "LogMetrics"
  | "Insights"
  | "Goals"
  | "Settings"
  | "Chat";

export interface NavigationParams {
  [key: string]: any;
}

// Notification types
export interface NotificationData {
  id: string;
  type: "reminder" | "achievement" | "insight" | "system";
  title: string;
  message: string;
  data?: Record<string, any>;
}

// Error types
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = "AppError";
  }
}

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
