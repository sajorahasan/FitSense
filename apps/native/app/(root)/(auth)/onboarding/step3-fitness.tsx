import Ionicons from "@expo/vector-icons/build/Ionicons";
import { useMutation } from "convex/react";
import { Link, router } from "expo-router";
import { Button, useTheme } from "heroui-native";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { toast } from "sonner-native";
import FormHeader, { FormContainer } from "@/components/form";
import { api } from "~/backend/_generated/api";

const fitnessLevels = [
  {
    id: "beginner",
    title: "Beginner",
    description: "New to fitness or getting back into it",
    icon: "walk",
  },
  {
    id: "intermediate",
    title: "Intermediate",
    description: "Regular exercise, building strength",
    icon: "fitness",
  },
  {
    id: "advanced",
    title: "Advanced",
    description: "Experienced, pushing limits",
    icon: "trophy",
  },
] as const;

const goals = [
  {
    id: "weight_loss",
    title: "Weight Loss",
    description: "Lose weight and improve body composition",
    icon: "scale",
  },
  {
    id: "muscle_gain",
    title: "Muscle Gain",
    description: "Build muscle and strength",
    icon: "barbell",
  },
  {
    id: "maintenance",
    title: "Maintenance",
    description: "Maintain current fitness level",
    icon: "shield-checkmark",
  },
  {
    id: "endurance",
    title: "Endurance",
    description: "Improve cardiovascular fitness",
    icon: "heart",
  },
  {
    id: "health_management",
    title: "Health Management",
    description: "Manage health conditions through fitness",
    icon: "medical",
  },
] as const;

export default function OnboardingFitness() {
  const { colors } = useTheme();
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [selectedGoal, setSelectedGoal] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const updateProfile = useMutation(api.users.updateUserProfile);

  const handleContinue = async () => {
    if (!selectedLevel) {
      toast.error("Please select your fitness level to continue.");
      return;
    }

    if (!selectedGoal) {
      toast.error("Please select your primary goal to continue.");
      return;
    }

    setIsLoading(true);
    try {
      await updateProfile({
        fitnessLevel: selectedLevel as any,
        primaryGoal: selectedGoal as any,
        onboardingStep: 3,
      });
      router.push("/(root)/(auth)/onboarding/step4-preferences");
    } catch (error) {
      toast.error(
        `Failed to save your fitness profile. Please try again. ${error instanceof Error ? error?.message : "Unknown error"}`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormContainer>
      <FormHeader
        title="Your Fitness Profile"
        description="Help us understand your fitness level and goals"
        containerClassName="mt-12"
      />

      {/* Progress indicator */}
      <View className="mb-6 flex-row items-center justify-center gap-2">
        <View className="h-2 w-8 rounded-full bg-primary" />
        <View className="h-2 w-8 rounded-full bg-primary" />
        <View className="h-2 w-8 rounded-full bg-primary" />
        <View className="h-2 w-8 rounded-full bg-muted" />
      </View>

      {/* Fitness Level Selection */}
      <View className="mb-8">
        <Text className="mb-4 font-semibold text-foreground text-lg">
          What's your fitness level?
        </Text>

        <View className="gap-3">
          {fitnessLevels.map((level) => (
            <TouchableOpacity
              key={level.id}
              onPress={() => setSelectedLevel(level.id)}
              className={`rounded-2xl border-2 p-4 ${
                selectedLevel === level.id
                  ? "border-accent bg-accent/5"
                  : "border-border bg-panel"
              }`}
            >
              <View className="flex-row items-center gap-3">
                <View
                  className={`rounded-full p-2 ${selectedLevel === level.id ? "bg-accent" : "bg-muted"}`}
                >
                  <Ionicons
                    name={level.icon as any}
                    size={20}
                    color={
                      selectedLevel === level.id
                        ? colors.background
                        : colors.mutedForeground
                    }
                  />
                </View>
                <View className="flex-1">
                  <Text
                    className={`font-medium ${selectedLevel === level.id ? "text-accent" : "text-foreground"}`}
                  >
                    {level.title}
                  </Text>
                  <Text className="text-muted-foreground text-sm">
                    {level.description}
                  </Text>
                </View>
                {selectedLevel === level.id && (
                  <Ionicons
                    name="checkmark-circle"
                    size={24}
                    color={colors.accent}
                  />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Primary Goal Selection */}
      <View className="mb-8">
        <Text className="mb-4 font-semibold text-foreground text-lg">
          What's your primary goal?
        </Text>

        <View className="gap-3">
          {goals.map((goal) => (
            <TouchableOpacity
              key={goal.id}
              onPress={() => setSelectedGoal(goal.id)}
              className={`rounded-2xl border-2 p-4 ${
                selectedGoal === goal.id
                  ? "border-accent bg-accent/5"
                  : "border-border bg-panel"
              }`}
            >
              <View className="flex-row items-center gap-3">
                <View
                  className={`rounded-full p-2 ${selectedGoal === goal.id ? "bg-accent" : "bg-muted"}`}
                >
                  <Ionicons
                    name={goal.icon as any}
                    size={20}
                    color={
                      selectedGoal === goal.id
                        ? colors.background
                        : colors.mutedForeground
                    }
                  />
                </View>
                <View className="flex-1">
                  <Text
                    className={`font-medium ${selectedGoal === goal.id ? "text-accent" : "text-foreground"}`}
                  >
                    {goal.title}
                  </Text>
                  <Text className="text-muted-foreground text-sm">
                    {goal.description}
                  </Text>
                </View>
                {selectedGoal === goal.id && (
                  <Ionicons
                    name="checkmark-circle"
                    size={24}
                    color={colors.accent}
                  />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Navigation buttons */}
      <View className="gap-3">
        <Button
          onPress={handleContinue}
          disabled={isLoading}
          className="rounded-3xl"
        >
          <Button.LabelContent>
            {isLoading ? "Saving..." : "Continue"}
          </Button.LabelContent>
          <Button.EndContent>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={colors.background}
            />
          </Button.EndContent>
        </Button>

        <Link href="/(root)/(auth)/onboarding/step4-preferences" asChild>
          <Button variant="ghost" disabled={isLoading} className="rounded-3xl">
            <Button.LabelContent>Skip for now</Button.LabelContent>
          </Button>
        </Link>
      </View>
    </FormContainer>
  );
}
