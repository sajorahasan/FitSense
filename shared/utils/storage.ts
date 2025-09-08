// Storage utility functions for FitSense

/**
 * Storage keys for consistent naming
 */
export const STORAGE_KEYS = {
  USER_PROFILE: "user_profile",
  SYNC_STATUS: "sync_status",
  OFFLINE_QUEUE: "offline_queue",
  APP_SETTINGS: "app_settings",
  THEME_MODE: "theme_mode",
  LAST_BACKUP: "last_backup",
} as const;

/**
 * Generic storage interface
 */
export interface StorageAdapter {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
}

/**
 * In-memory storage for testing
 */
export class MemoryStorage implements StorageAdapter {
  private data = new Map<string, any>();

  async get<T>(key: string): Promise<T | null> {
    return this.data.get(key) || null;
  }

  async set<T>(key: string, value: T): Promise<void> {
    this.data.set(key, value);
  }

  async remove(key: string): Promise<void> {
    this.data.delete(key);
  }

  async clear(): Promise<void> {
    this.data.clear();
  }
}

/**
 * Sync status management
 */
export interface SyncStatusData {
  lastSyncAt?: Date;
  status: "idle" | "syncing" | "success" | "error";
  error?: string;
  pendingChanges: number;
}

export class SyncStatusManager {
  constructor(private storage: StorageAdapter) {}

  async getStatus(): Promise<SyncStatusData> {
    const data = await this.storage.get<SyncStatusData>(
      STORAGE_KEYS.SYNC_STATUS,
    );
    return (
      data || {
        status: "idle",
        pendingChanges: 0,
      }
    );
  }

  async updateStatus(updates: Partial<SyncStatusData>): Promise<void> {
    const current = await this.getStatus();
    const updated = { ...current, ...updates };
    await this.storage.set(STORAGE_KEYS.SYNC_STATUS, updated);
  }

  async markSyncStart(): Promise<void> {
    await this.updateStatus({
      status: "syncing",
      lastSyncAt: new Date(),
    });
  }

  async markSyncSuccess(): Promise<void> {
    const current = await this.getStatus();
    await this.updateStatus({
      status: "success",
      pendingChanges: 0,
    });
  }

  async markSyncError(error: string): Promise<void> {
    await this.updateStatus({
      status: "error",
      error,
    });
  }

  async incrementPendingChanges(): Promise<void> {
    const current = await this.getStatus();
    await this.updateStatus({
      pendingChanges: current.pendingChanges + 1,
    });
  }

  async decrementPendingChanges(): Promise<void> {
    const current = await this.getStatus();
    await this.updateStatus({
      pendingChanges: Math.max(0, current.pendingChanges - 1),
    });
  }
}

/**
 * Offline queue management
 */
export interface QueuedOperation {
  id: string;
  type: "create" | "update" | "delete";
  entityType: string;
  entityId: string;
  data: any;
  timestamp: Date;
  retryCount: number;
}

export class OfflineQueueManager {
  constructor(private storage: StorageAdapter) {}

  async addOperation(
    operation: Omit<QueuedOperation, "id" | "timestamp" | "retryCount">,
  ): Promise<void> {
    const queue = await this.getQueue();
    const newOperation: QueuedOperation = {
      ...operation,
      id: `${operation.entityType}_${operation.entityId}_${Date.now()}`,
      timestamp: new Date(),
      retryCount: 0,
    };
    queue.push(newOperation);
    await this.storage.set(STORAGE_KEYS.OFFLINE_QUEUE, queue);
  }

  async getQueue(): Promise<QueuedOperation[]> {
    const queue = await this.storage.get<QueuedOperation[]>(
      STORAGE_KEYS.OFFLINE_QUEUE,
    );
    return queue || [];
  }

  async removeOperation(operationId: string): Promise<void> {
    const queue = await this.getQueue();
    const filtered = queue.filter((op) => op.id !== operationId);
    await this.storage.set(STORAGE_KEYS.OFFLINE_QUEUE, filtered);
  }

  async incrementRetryCount(operationId: string): Promise<void> {
    const queue = await this.getQueue();
    const operation = queue.find((op) => op.id === operationId);
    if (operation) {
      operation.retryCount += 1;
      await this.storage.set(STORAGE_KEYS.OFFLINE_QUEUE, queue);
    }
  }

  async clearQueue(): Promise<void> {
    await this.storage.set(STORAGE_KEYS.OFFLINE_QUEUE, []);
  }

  async getFailedOperations(): Promise<QueuedOperation[]> {
    const queue = await this.getQueue();
    return queue.filter((op) => op.retryCount >= 3);
  }
}

/**
 * App settings management
 */
export interface AppSettings {
  theme: "light" | "dark" | "system";
  notifications: {
    enabled: boolean;
    workoutReminders: boolean;
    mealReminders: boolean;
    goalUpdates: boolean;
  };
  privacy: {
    analytics: boolean;
    crashReporting: boolean;
    dataSharing: boolean;
  };
  units: {
    weight: "kg" | "lbs";
    distance: "km" | "miles";
    temperature: "celsius" | "fahrenheit";
  };
}

const DEFAULT_SETTINGS: AppSettings = {
  theme: "system",
  notifications: {
    enabled: true,
    workoutReminders: true,
    mealReminders: true,
    goalUpdates: true,
  },
  privacy: {
    analytics: true,
    crashReporting: true,
    dataSharing: false,
  },
  units: {
    weight: "kg",
    distance: "km",
    temperature: "celsius",
  },
};

export class SettingsManager {
  constructor(private storage: StorageAdapter) {}

  async getSettings(): Promise<AppSettings> {
    const settings = await this.storage.get<AppSettings>(
      STORAGE_KEYS.APP_SETTINGS,
    );
    return settings || DEFAULT_SETTINGS;
  }

  async updateSettings(updates: Partial<AppSettings>): Promise<void> {
    const current = await this.getSettings();
    const updated = this.deepMerge(current, updates);
    await this.storage.set(STORAGE_KEYS.APP_SETTINGS, updated);
  }

  private deepMerge<T>(target: T, source: Partial<T>): T {
    const result = { ...target };
    for (const key in source) {
      if (
        source[key] &&
        typeof source[key] === "object" &&
        !Array.isArray(source[key])
      ) {
        result[key] = this.deepMerge(result[key], source[key] as any);
      } else {
        result[key] = source[key] as any;
      }
    }
    return result;
  }
}
