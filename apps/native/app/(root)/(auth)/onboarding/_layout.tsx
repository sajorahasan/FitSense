import { useQuery } from "convex/react";
import { Stack } from "expo-router";
import { createContext, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "~/backend/_generated/api";

const UserContext = createContext<any>(null);

export function useOnboardingUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useOnboardingUser must be used within OnboardingLayout");
  }
  return context;
}

export default function OnboardingLayout() {
  const user = useQuery(api.users.getCurrentUser);

  return (
    <UserContext.Provider value={user}>
      <SafeAreaView className="flex-1">
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="step1-welcome" />
          <Stack.Screen name="step2-personal" />
          <Stack.Screen name="step3-fitness" />
          <Stack.Screen name="step4-preferences" />
        </Stack>
      </SafeAreaView>
    </UserContext.Provider>
  );
}
