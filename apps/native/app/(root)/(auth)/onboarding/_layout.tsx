import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OnboardingLayout() {
  return (
    <SafeAreaView className="flex-1">
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="step1-welcome" />
        <Stack.Screen name="step2-personal" />
        <Stack.Screen name="step3-fitness" />
        <Stack.Screen name="step4-preferences" />
      </Stack>
    </SafeAreaView>
  );
}
