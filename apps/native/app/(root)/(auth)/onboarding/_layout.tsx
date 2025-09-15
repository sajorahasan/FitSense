import { Stack } from "expo-router";

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="step1-welcome" />
      <Stack.Screen name="step2-personal" />
      <Stack.Screen name="step3-fitness" />
      <Stack.Screen name="step4-preferences" />
    </Stack>
  );
}
