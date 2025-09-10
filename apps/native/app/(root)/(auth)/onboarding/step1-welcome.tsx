import Ionicons from "@expo/vector-icons/build/Ionicons";
import { Link } from "expo-router";
import { Button, useTheme } from "heroui-native";
import { Text, View } from "react-native";
import FormHeader, { FormContainer } from "@/components/form";

export default function OnboardingWelcome() {
  const { colors } = useTheme();

  return (
    <FormContainer>
      <FormHeader
        title="Welcome to FitSense!"
        description="Let's personalize your fitness journey"
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
    </FormContainer>
  );
}
