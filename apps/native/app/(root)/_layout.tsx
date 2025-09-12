import { useConvexAuth, useQuery } from "convex/react";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { Spinner, useTheme } from "heroui-native";
import { useEffect } from "react";
import { View } from "react-native";
import { useAppTheme } from "@/contexts/app-theme-context";
import { useNavigationOptions } from "@/hooks/useNavigationOptions";
import { api } from "~/backend/_generated/api";
import { delay } from "~/shared/utils/delay";

export const unstable_settings = {
  anchor: "(main)/index",
};

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({});
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { root } = useNavigationOptions();
  const { syncThemeFromUser } = useAppTheme();
  const { isDark } = useTheme();

  // Check if user has completed onboarding
  const user = useQuery(api.users.getCurrentUser);
  const hasCompletedOnboarding = user?.onboardingCompleted;

  // Sync theme from user profile
  useEffect(() => {
    if (user?.themeId) {
      syncThemeFromUser(user.themeId);
    }
  }, [user?.themeId, syncThemeFromUser]);

  if (fontError) {
    throw fontError;
  }

  useEffect(() => {
    if (isLoading || !fontsLoaded) {
      return;
    }
    delay(350).then(() => {
      SplashScreen.hideAsync();
    });
  }, [isLoading, fontsLoaded]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Spinner size="lg" />
      </View>
    );
  }

  /* --------------------------------- return --------------------------------- */
  return (
    <>
      <StatusBar
        key={`root-status-bar-${isDark ? "light" : "dark"}`}
        style={isDark ? "light" : "dark"}
      />
      <Stack>
        {/* AUTH STACK */}
        <Stack.Protected guard={!isAuthenticated || !hasCompletedOnboarding}>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack.Protected>

        {/* AUTHENTICATED NESTED STACK */}
        <Stack.Protected guard={!!(isAuthenticated && hasCompletedOnboarding)}>
          <Stack.Screen
            name="(main)"
            options={{ title: "", headerShown: false, ...root }}
          />
        </Stack.Protected>
      </Stack>
    </>
  );
}
