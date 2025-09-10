import { useConvexAuth, useQuery } from "convex/react";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useAppTheme } from "@/contexts/app-theme-context";
import { useNavigationOptions } from "@/hooks/useNavigationOptions";
import { api } from "~/backend/_generated/api";

export const unstable_settings = {
  anchor: "(main)/index",
};

export default function RootLayout() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { root } = useNavigationOptions();
  const { syncThemeFromUser } = useAppTheme();

  // Check if user has completed onboarding
  const user = useQuery(api.users.getCurrentUser);
  const hasCompletedOnboarding = user?.onboardingCompleted;

  // Sync theme from user profile
  useEffect(() => {
    if (user?.themeId) {
      syncThemeFromUser(user.themeId);
    }
  }, [user?.themeId, syncThemeFromUser]);

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hide();
    }
  }, [isLoading]);

  if (isLoading) {
    return null;
  }

  /* --------------------------------- return --------------------------------- */
  return (
    <Stack>
      {/* AUTH STACK */}
      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack.Protected>

      {/* ONBOARDING STACK - for authenticated users who haven't completed onboarding */}
      <Stack.Protected guard={isAuthenticated && !hasCompletedOnboarding}>
        <Stack.Screen
          name="(auth)/onboarding"
          options={{ headerShown: false }}
        />
      </Stack.Protected>

      {/* AUTHENTICATED NESTED STACK */}
      <Stack.Protected guard={!!(isAuthenticated && hasCompletedOnboarding)}>
        {/* MAIN STACK*/}
        <Stack.Screen
          name="(main)"
          options={{
            title: "",
            headerShown: false,
            ...root,
          }}
        />
      </Stack.Protected>
    </Stack>
  );
}
