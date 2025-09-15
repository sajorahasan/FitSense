import Ionicons from "@expo/vector-icons/build/Ionicons";
import { useTheme } from "heroui-native";
import type React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useSync, useSyncStatus } from "@/lib/sync-manager";

interface SyncStatusProps {
  showDetails?: boolean;
  onPress?: () => void;
}

export const SyncStatus: React.FC<SyncStatusProps> = ({
  showDetails = false,
  onPress,
}) => {
  const { colors } = useTheme();
  const syncStatus = useSyncStatus();
  const { sync, isLoading } = useSync();

  const getStatusColor = () => {
    if (syncStatus.syncInProgress || isLoading) {
      return colors.warning;
    }
    if (syncStatus.lastError) {
      return "#ef4444"; // Red color for errors
    }
    if (syncStatus.pendingChanges > 0) {
      return colors.warning;
    }
    return colors.success;
  };

  const getStatusIcon = () => {
    if (syncStatus.syncInProgress || isLoading) {
      return "sync";
    }
    if (syncStatus.lastError) {
      return "warning";
    }
    if (syncStatus.pendingChanges > 0) {
      return "cloud-upload";
    }
    return "checkmark-circle";
  };

  const getStatusText = () => {
    if (syncStatus.syncInProgress || isLoading) {
      return "Syncing...";
    }
    if (syncStatus.lastError) {
      return "Sync Error";
    }
    if (syncStatus.pendingChanges > 0) {
      return `${syncStatus.pendingChanges} pending`;
    }
    return "Synced";
  };

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (syncStatus.pendingChanges > 0 && syncStatus.isOnline) {
      sync();
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={!syncStatus.isOnline && syncStatus.pendingChanges === 0}
      className={`flex-row items-center gap-2 rounded-lg px-3 py-2 ${
        onPress ? "bg-background/50" : ""
      }`}
    >
      <Ionicons
        name={getStatusIcon() as any}
        size={16}
        color={getStatusColor()}
      />
      <Text className="text-sm" style={{ color: getStatusColor() }}>
        {getStatusText()}
      </Text>

      {showDetails && (
        <>
          <Text className="text-muted-foreground text-xs">•</Text>
          <Text className="text-muted-foreground text-xs">
            {syncStatus.isOnline ? "Online" : "Offline"}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

export const SyncStatusBar: React.FC = () => {
  const syncStatus = useSyncStatus();

  if (
    syncStatus.isOnline &&
    syncStatus.pendingChanges === 0 &&
    !syncStatus.lastError
  ) {
    return null; // Don't show when everything is synced
  }

  return (
    <View className="border-border bg-background/95 px-4 py-2">
      <SyncStatus showDetails />
    </View>
  );
};
