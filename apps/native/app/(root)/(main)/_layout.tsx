import { Stack } from "expo-router";
import { SyncStatusBar } from "@/components/sync-status";
import { NetworkProvider } from "@/contexts/network-context";
import { useNavigationOptions } from "@/hooks/useNavigationOptions";

export default function MainLayout() {
  const { standard } = useNavigationOptions();
  return (
    <NetworkProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: "Home",
            headerTitle: "",
            headerBackTitle: "Home",
            ...standard,
          }}
        />
        <Stack.Screen
          name="profile"
          options={{
            title: "Profile",
            headerLargeTitle: true,
            ...standard,
          }}
        />
        <Stack.Screen
          name="settings"
          options={{
            title: "Settings",
            headerLargeTitle: true,
            ...standard,
          }}
        />
        <Stack.Screen
          name="log-workout"
          options={{
            title: "Log Workout",
            headerLargeTitle: true,
            ...standard,
          }}
        />
        <Stack.Screen
          name="log-meal"
          options={{
            title: "Log Meal",
            headerLargeTitle: true,
            ...standard,
          }}
        />
        <Stack.Screen
          name="log-health-metrics"
          options={{
            title: "Log Health Metrics",
            headerLargeTitle: true,
            ...standard,
          }}
        />
      </Stack>
      <SyncStatusBar />
    </NetworkProvider>
  );
}
