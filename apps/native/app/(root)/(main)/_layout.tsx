import { Stack } from "expo-router";
import { SyncStatusBar } from "@/components/sync-status";
import { NetworkProvider } from "@/contexts/network-context";

export default function MainLayout() {
  return (
    <NetworkProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ headerShown: false }} />
        <Stack.Screen name="notification-preferences" />
        <Stack.Screen name="theme-preferences" />
      </Stack>
      <SyncStatusBar />
    </NetworkProvider>
  );
}
