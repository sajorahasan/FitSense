import {
  generateOfflineId,
  isOfflineId,
  NetworkManager,
  type OfflineHealthMetric,
  type OfflineMeal,
  type OfflineWorkout,
  SyncQueue,
  type SyncStatus,
} from "./storage";

export class SyncManager {
  private static instance: SyncManager;
  private syncQueue: SyncQueue;
  private networkManager: NetworkManager;
  private syncInProgress = false;
  private lastSyncTime = 0;
  private lastError?: string;

  static getInstance(): SyncManager {
    if (!SyncManager.instance) {
      SyncManager.instance = new SyncManager();
    }
    return SyncManager.instance;
  }

  constructor() {
    this.syncQueue = SyncQueue.getInstance();
    this.networkManager = NetworkManager.getInstance();
  }

  // Sync status getter
  getSyncStatus(): SyncStatus {
    return {
      isOnline: this.networkManager.getOnlineStatus(),
      lastSyncTime: this.lastSyncTime,
      pendingChanges: this.syncQueue.getPendingCount(),
      syncInProgress: this.syncInProgress,
      lastError: this.lastError,
    };
  }

  // Main sync method
  async syncAll(): Promise<void> {
    if (this.syncInProgress || !this.networkManager.getOnlineStatus()) {
      return;
    }

    this.syncInProgress = true;
    this.lastError = undefined;

    try {
      const queue = this.syncQueue.getQueue();

      // Sync workouts
      for (const workout of queue.workouts) {
        await this.syncWorkout(workout);
      }

      // Sync meals
      for (const meal of queue.meals) {
        await this.syncMeal(meal);
      }

      // Sync health metrics
      for (const metric of queue.healthMetrics) {
        await this.syncHealthMetric(metric);
      }

      // Clear queue after successful sync
      this.syncQueue.clearQueue();
      this.lastSyncTime = Date.now();
    } catch (error) {
      this.lastError =
        error instanceof Error ? error.message : "Unknown sync error";
      console.error("Sync failed:", error);
      throw error;
    } finally {
      this.syncInProgress = false;
    }
  }

  // Workout sync
  private async syncWorkout(workout: OfflineWorkout): Promise<void> {
    try {
      if (workout.action === "create") {
        // Create workout on server
        const response = await fetch("/api/workouts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(workout.data),
        });

        if (!response.ok) {
          throw new Error(`Failed to create workout: ${response.statusText}`);
        }

        const result = await response.json();

        // Update local storage with server ID
        // This would need to be implemented based on your local storage structure
        console.log("Workout synced:", result);
      } else if (workout.action === "update") {
        // Update workout on server
        const response = await fetch(`/api/workouts/${workout.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(workout.data),
        });

        if (!response.ok) {
          throw new Error(`Failed to update workout: ${response.statusText}`);
        }
      } else if (workout.action === "delete") {
        // Delete workout on server
        const response = await fetch(`/api/workouts/${workout.id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error(`Failed to delete workout: ${response.statusText}`);
        }
      }
    } catch (error) {
      console.error(`Failed to sync workout ${workout.id}:`, error);
      throw error;
    }
  }

  // Meal sync
  private async syncMeal(meal: OfflineMeal): Promise<void> {
    try {
      if (meal.action === "create") {
        const response = await fetch("/api/meals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(meal.data),
        });

        if (!response.ok) {
          throw new Error(`Failed to create meal: ${response.statusText}`);
        }

        const result = await response.json();
        console.log("Meal synced:", result);
      } else if (meal.action === "update") {
        const response = await fetch(`/api/meals/${meal.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(meal.data),
        });

        if (!response.ok) {
          throw new Error(`Failed to update meal: ${response.statusText}`);
        }
      } else if (meal.action === "delete") {
        const response = await fetch(`/api/meals/${meal.id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error(`Failed to delete meal: ${response.statusText}`);
        }
      }
    } catch (error) {
      console.error(`Failed to sync meal ${meal.id}:`, error);
      throw error;
    }
  }

  // Health metric sync
  private async syncHealthMetric(metric: OfflineHealthMetric): Promise<void> {
    try {
      if (metric.action === "create") {
        const response = await fetch("/api/health-metrics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(metric.data),
        });

        if (!response.ok) {
          throw new Error(
            `Failed to create health metric: ${response.statusText}`,
          );
        }

        const result = await response.json();
        console.log("Health metric synced:", result);
      } else if (metric.action === "update") {
        const response = await fetch(`/api/health-metrics/${metric.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(metric.data),
        });

        if (!response.ok) {
          throw new Error(
            `Failed to update health metric: ${response.statusText}`,
          );
        }
      } else if (metric.action === "delete") {
        const response = await fetch(`/api/health-metrics/${metric.id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error(
            `Failed to delete health metric: ${response.statusText}`,
          );
        }
      }
    } catch (error) {
      console.error(`Failed to sync health metric ${metric.id}:`, error);
      throw error;
    }
  }

  // Add items to sync queue
  addWorkoutToQueue(
    data: any,
    action: "create" | "update" | "delete" = "create",
  ): string {
    const id = isOfflineId(data.id) ? data.id : generateOfflineId();
    const workout: OfflineWorkout = {
      id,
      data,
      timestamp: Date.now(),
      action,
    };

    this.syncQueue.addWorkout(workout);
    return id;
  }

  addMealToQueue(
    data: any,
    action: "create" | "update" | "delete" = "create",
  ): string {
    const id = isOfflineId(data.id) ? data.id : generateOfflineId();
    const meal: OfflineMeal = {
      id,
      data,
      timestamp: Date.now(),
      action,
    };

    this.syncQueue.addMeal(meal);
    return id;
  }

  addHealthMetricToQueue(
    data: any,
    action: "create" | "update" | "delete" = "create",
  ): string {
    const id = isOfflineId(data.id) ? data.id : generateOfflineId();
    const metric: OfflineHealthMetric = {
      id,
      data,
      timestamp: Date.now(),
      action,
    };

    this.syncQueue.addHealthMetric(metric);
    return id;
  }

  // Network status management
  setOnlineStatus(isOnline: boolean): void {
    this.networkManager.setOnlineStatus(isOnline);

    // Auto-sync when coming back online
    if (isOnline && this.syncQueue.getPendingCount() > 0) {
      this.syncAll().catch((error) => {
        console.error("Auto-sync failed:", error);
      });
    }
  }

  // Conflict resolution
  resolveConflict(
    localData: any,
    serverData: any,
    strategy: "local" | "server" | "merge" = "merge",
  ): any {
    switch (strategy) {
      case "local":
        return localData;
      case "server":
        return serverData;
      case "merge":
        // Simple merge strategy - server wins for conflicts
        return {
          ...localData,
          ...serverData,
          updatedAt: Date.now(),
        };
      default:
        return serverData;
    }
  }
}

// React hook for sync status
export const useSyncStatus = () => {
  const syncManager = SyncManager.getInstance();
  const [syncStatus, setSyncStatus] = React.useState<SyncStatus>(
    syncManager.getSyncStatus(),
  );

  React.useEffect(() => {
    const networkManager = NetworkManager.getInstance();

    const unsubscribe = networkManager.addListener((_isOnline) => {
      setSyncStatus(syncManager.getSyncStatus());
    });

    // Update sync status periodically
    const interval = setInterval(() => {
      setSyncStatus(syncManager.getSyncStatus());
    }, 5000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [syncManager.getSyncStatus]);

  return syncStatus;
};

// React hook for sync operations
export const useSync = () => {
  const syncManager = SyncManager.getInstance();
  const [isLoading, setIsLoading] = React.useState(false);

  const sync = async () => {
    setIsLoading(true);
    try {
      await syncManager.syncAll();
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sync,
    isLoading,
    syncStatus: syncManager.getSyncStatus(),
  };
};

// Import React for hooks
import React from "react";
