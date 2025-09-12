import Ionicons from "@expo/vector-icons/build/Ionicons";
import { Link, useRouter } from "expo-router";
import { Button, useTheme } from "heroui-native";
import { useEffect } from "react";
import { Text, View } from "react-native";
import FormHeader from "@/components/form";
import { ScreenScrollView } from "@/components/screen-scroll-view";
import { useOnboardingUser } from "./_layout";

export default function OnboardingWelcome() {
  const { colors } = useTheme();
  const router = useRouter();
  const user = useOnboardingUser();

  // Check if user has already completed onboarding
  useEffect(() => {
    if (user?.onboardingCompleted) {
      console.log(
        "User has already completed onboarding, redirecting to main app",
      );
      router.replace("/(root)/(main)");
    } else if (user?.onboardingStep === 1) {
      console.log("User is on onboarding step 1, redirecting to step 2");
      router.push("/(root)/(auth)/onboarding/step2-personal");
    } else if (user?.onboardingStep === 2) {
      console.log("User is on onboarding step 2, redirecting to step 3");
      router.push("/(root)/(auth)/onboarding/step3-fitness");
    } else if (user?.onboardingStep === 3) {
      console.log("User is on onboarding step 3, redirecting to step 4");
      router.push("/(root)/(auth)/onboarding/step4-preferences");
    }
  }, [user?.onboardingCompleted, user?.onboardingStep, router]);

  return (
    <ScreenScrollView contentContainerClassName="gap-4 px-6">
      <FormHeader
        title="Welcome to FitSense!"
        description="Let's personalize your fitness journey"
        containerClassName="mt-12"
      />

      {/* Welcome content */}
      <View className="items-center py-8">
        <View className="mb-6 rounded-full bg-accent/10 p-6">
          <Ionicons name="fitness" size={48} color={colors.accent} />
        </View>

        <Text className="mb-4 text-center font-medium text-foreground text-lg">
          Your AI-Powered Fitness Companion
        </Text>

        <Text className="text-center text-muted-foreground">
          Track workouts, log meals, get personalized insights, and achieve your
          fitness goals with the help of AI.
        </Text>
      </View>

      {/* Features list */}
      <View className="mb-8 gap-4">
        <View className="flex-row items-center gap-3">
          <View className="rounded-full bg-accent/10 p-2">
            <Ionicons name="barbell" size={20} color={colors.accent} />
          </View>
          <Text className="text-foreground">Smart workout tracking</Text>
        </View>

        <View className="flex-row items-center gap-3">
          <View className="rounded-full bg-accent/10 p-2">
            <Ionicons name="restaurant" size={20} color={colors.accent} />
          </View>
          <Text className="text-foreground">Nutrition insights</Text>
        </View>

        <View className="flex-row items-center gap-3">
          <View className="rounded-full bg-accent/10 p-2">
            <Ionicons name="bulb" size={20} color={colors.accent} />
          </View>
          <Text className="text-foreground">AI-powered recommendations</Text>
        </View>

        <View className="flex-row items-center gap-3">
          <View className="rounded-full bg-accent/10 p-2">
            <Ionicons name="trophy" size={20} color={colors.accent} />
          </View>
          <Text className="text-foreground">Goal achievement tracking</Text>
        </View>
      </View>

      {/* Continue button */}
      <Link href="/(root)/(auth)/onboarding/step2-personal" asChild>
        <Button className="rounded-3xl">
          <Button.LabelContent>Get Started</Button.LabelContent>
          <Button.EndContent>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={colors.background}
            />
          </Button.EndContent>
        </Button>
      </Link>
    </ScreenScrollView>
  );
}
