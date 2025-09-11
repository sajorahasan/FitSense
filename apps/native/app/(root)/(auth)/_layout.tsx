import { useConvexAuth, useQuery } from "convex/react";
import { Stack } from "expo-router";
import { useNavigationOptions } from "@/hooks/useNavigationOptions";
import { api } from "~/backend/_generated/api";

export default function AuthLayout() {
  const { root, standard } = useNavigationOptions();
  const { isAuthenticated } = useConvexAuth();
  const user = useQuery(api.users.getCurrentUser);
  const hasCompletedOnboarding = user?.onboardingCompleted;

  return (
    <Stack>
      {/* ONBOARDING STACK - for authenticated users who haven't completed onboarding */}
      <Stack.Protected guard={isAuthenticated && !hasCompletedOnboarding}>
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Screen
        name="landing"
        options={{ headerShown: true, title: "", ...standard }}
      />
      <Stack.Screen
        name="email"
        options={{ headerShown: false, presentation: "modal", ...root }}
      />
    </Stack>
  );
}
