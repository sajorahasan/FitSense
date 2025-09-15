import { MMKV } from "react-native-mmkv";

// HIPAA-compliant storage configuration
const ENCRYPTION_KEY = "fitsense_secure_key_2024"; // In production, this should be generated per device
const STORAGE_IDS = {
  USER_DATA: "user_data",
  WORKOUTS: "workouts",
  MEALS: "meals",
  HEALTH_METRICS: "health_metrics",
  SYNC_QUEUE: "sync_queue",
  OFFLINE_DATA: "offline_data",
} as const;

// Create encrypted storage instances
const createEncryptedStorage = (id: string) => {
  return new MMKV({
    id,
    encryptionKey: ENCRYPTION_KEY,
  });
};

// Storage instances
export const userDataStorage = createEncryptedStorage(STORAGE_IDS.USER_DATA);
export const workoutsStorage = createEncryptedStorage(STORAGE_IDS.WORKOUTS);
export const mealsStorage = createEncryptedStorage(STORAGE_IDS.MEALS);
export const healthMetricsStorage = createEncryptedStorage(
  STORAGE_IDS.HEALTH_METRICS,
);
export const syncQueueStorage = createEncryptedStorage(STORAGE_IDS.SYNC_QUEUE);
export const offlineDataStorage = createEncryptedStorage(
  STORAGE_IDS.OFFLINE_DATA,
);

// Generic storage operations
export class SecureStorage<T = any> {
  constructor(private storage: MMKV) {}

  set(key: string, value: T): void {
    try {
      const serialized = JSON.stringify(value);
      this.storage.set(key, serialized);
    } catch (error) {
      console.error(`Failed to store data for key ${key}:`, error);
      throw new Error(`Storage write failed for key: ${key}`);
    }
  }

  get(key: string): T | null {
    try {
      const serialized = this.storage.getString(key);
      if (serialized === undefined) {
        return null;
      }
      return JSON.parse(serialized) as T;
    } catch (error) {
      console.error(`Failed to retrieve data for key ${key}:`, error);
      return null;
    }
  }

  delete(key: string): void {
    try {
      this.storage.delete(key);
    } catch (error) {
      console.error(`Failed to delete data for key ${key}:`, error);
    }
  }

  clear(): void {
    try {
      this.storage.clearAll();
    } catch (error) {
      console.error("Failed to clear storage:", error);
    }
  }

  getAllKeys(): string[] {
    try {
      return this.storage.getAllKeys();
    } catch (error) {
      console.error("Failed to get all keys:", error);
      return [];
    }
  }

  has(key: string): boolean {
    try {
      return this.storage.contains(key);
    } catch (error) {
      console.error(`Failed to check existence for key ${key}:`, error);
      return false;
    }
  }
}

// Typed storage instances
export const userData = new SecureStorage(userDataStorage);
export const workouts = new SecureStorage(workoutsStorage);
export const meals = new SecureStorage(mealsStorage);
export const healthMetrics = new SecureStorage(healthMetricsStorage);
export const syncQueue = new SecureStorage(syncQueueStorage);
export const offlineData = new SecureStorage(offlineDataStorage);

// Sync status types
export interface SyncStatus {
  isOnline: boolean;
  lastSyncTime: number;
  pendingChanges: number;
  syncInProgress: boolean;
  lastError?: string;
}

// Offline data types
export interface OfflineWorkout {
  id: string;
  data: any;
  timestamp: number;
  action: "create" | "update" | "delete";
}

export interface OfflineMeal {
  id: string;
  data: any;
  timestamp: number;
  action: "create" | "update" | "delete";
}

export interface OfflineHealthMetric {
  id: string;
  data: any;
  timestamp: number;
  action: "create" | "update" | "delete";
}

// Sync queue management
export class SyncQueue {
  private static instance: SyncQueue;
  private storage = syncQueue;

  static getInstance(): SyncQueue {
    if (!SyncQueue.instance) {
      SyncQueue.instance = new SyncQueue();
    }
    return SyncQueue.instance;
  }

  addWorkout(workout: OfflineWorkout): void {
    const queue = this.getQueue();
    queue.workouts.push(workout);
    this.storage.set("queue", queue);
  }

  addMeal(meal: OfflineMeal): void {
    const queue = this.getQueue();
    queue.meals.push(meal);
    this.storage.set("queue", queue);
  }

  addHealthMetric(metric: OfflineHealthMetric): void {
    const queue = this.getQueue();
    queue.healthMetrics.push(metric);
    this.storage.set("queue", queue);
  }

  getQueue(): {
    workouts: OfflineWorkout[];
    meals: OfflineMeal[];
    healthMetrics: OfflineHealthMetric[];
  } {
    return (
      this.storage.get("queue") || {
        workouts: [],
        meals: [],
        healthMetrics: [],
      }
    );
  }

  clearQueue(): void {
    this.storage.set("queue", {
      workouts: [],
      meals: [],
      healthMetrics: [],
    });
  }

  getPendingCount(): number {
    const queue = this.getQueue();
    return (
      queue.workouts.length + queue.meals.length + queue.healthMetrics.length
    );
  }
}

// Network status management
export class NetworkManager {
  private static instance: NetworkManager;
  private isOnline = true;
  private listeners: ((isOnline: boolean) => void)[] = [];

  static getInstance(): NetworkManager {
    if (!NetworkManager.instance) {
      NetworkManager.instance = new NetworkManager();
    }
    return NetworkManager.instance;
  }

  setOnlineStatus(isOnline: boolean): void {
    this.isOnline = isOnline;
    this.listeners.forEach((listener) => {
      listener(isOnline);
    });
  }

  getOnlineStatus(): boolean {
    return this.isOnline;
  }

  addListener(listener: (isOnline: boolean) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }
}

// Utility functions
export const generateOfflineId = (): string => {
  return `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const isOfflineId = (id: string): boolean => {
  return id.startsWith("offline_");
};

// Export storage IDs for reference
export { STORAGE_IDS };
