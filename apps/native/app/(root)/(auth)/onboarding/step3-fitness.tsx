import Ionicons from "@expo/vector-icons/build/Ionicons";
import { useMutation } from "convex/react";
import { Link, router } from "expo-router";
import { Button, DropShadowView, useTheme } from "heroui-native";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { toast } from "sonner-native";
import FormHeader from "@/components/form";
import { ScreenScrollView } from "@/components/screen-scroll-view";
import { api } from "~/backend/_generated/api";
import { useOnboardingUser } from "./_layout";

const fitnessLevels = [
  {
    id: "beginner",
    title: "Beginner",
    description: "New to fitness or getting back into it",
    icon: "walk",
    color: "success", // Mint green for beginners
  },
  {
    id: "intermediate",
    title: "Intermediate",
    description: "Regular exercise, building strength",
    icon: "fitness",
    color: "warning", // Golden yellow for intermediate
  },
  {
    id: "advanced",
    title: "Advanced",
    description: "Experienced, pushing limits",
    icon: "trophy",
    color: "danger", // Soft rose for advanced
  },
] as const;

const goals = [
  {
    id: "weight_loss",
    title: "Weight Loss",
    description: "Lose weight and improve body composition",
    icon: "scale",
    color: "success", // Mint green for weight loss
  },
  {
    id: "muscle_gain",
    title: "Muscle Gain",
    description: "Build muscle and strength",
    icon: "barbell",
    color: "warning", // Golden yellow for muscle gain
  },
  {
    id: "maintenance",
    title: "Maintenance",
    description: "Maintain current fitness level",
    icon: "shield-checkmark",
    color: "accent", // Purple for maintenance
  },
  {
    id: "endurance",
    title: "Endurance",
    description: "Improve cardiovascular fitness",
    icon: "heart",
    color: "danger", // Soft rose for endurance
  },
  {
    id: "health_management",
    title: "Health Management",
    description: "Manage health conditions through fitness",
    icon: "medical",
    color: "accent", // Purple for health management - better contrast
  },
] as const;

export default function OnboardingFitness() {
  const { colors } = useTheme();
  const user = useOnboardingUser();
  const [selectedLevel, setSelectedLevel] = useState<string>(
    user.fitnessLevel || "",
  );
  const [selectedGoal, setSelectedGoal] = useState<string>(
    user.primaryGoal || "",
  );
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
    <ScreenScrollView contentContainerClassName="gap-4 px-6">
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
      <View className="mb-4">
        <Text className="mb-4 font-semibold text-foreground text-lg">
          What's your fitness level?
        </Text>

        <View className="gap-4">
          {fitnessLevels.map((level) => {
            const levelColor = colors[level.color as keyof typeof colors];
            const isSelected = selectedLevel === level.id;

            return (
              <DropShadowView className="rounded-2xl" key={level.id}>
                <Pressable
                  onPress={() => setSelectedLevel(level.id)}
                  className="rounded-2xl border-1 p-4"
                  style={{
                    borderColor: isSelected ? levelColor : colors.border,
                    backgroundColor: isSelected
                      ? colors.panel // Use panel background for better readability
                      : colors.panel,
                    shadowColor: isSelected ? "#000000" : "transparent",
                    shadowOffset: { width: 0, height: isSelected ? 2 : 0 },
                    shadowOpacity: isSelected ? 0.1 : 0,
                    shadowRadius: isSelected ? 8 : 0,
                    elevation: isSelected ? 3 : 0,
                  }}
                >
                  <View className="flex-row items-center gap-3 overflow-hidden">
                    <View
                      style={{
                        borderRadius: 999,
                        overflow: "hidden",
                        backgroundColor: isSelected ? levelColor : colors.panel,
                        borderWidth: isSelected ? 0 : 1,
                        borderColor: levelColor,
                      }}
                      className="p-3"
                    >
                      <Ionicons
                        name={level.icon as any}
                        size={20}
                        color={isSelected ? colors.background : levelColor}
                      />
                    </View>
                    <View className="flex-1">
                      <Text
                        className="font-medium"
                        style={{
                          color: isSelected ? levelColor : colors.foreground,
                        }}
                      >
                        {level.title}
                      </Text>
                      <Text
                        className="text-sm"
                        style={{
                          color: isSelected
                            ? levelColor
                            : colors.mutedForeground,
                        }}
                      >
                        {level.description}
                      </Text>
                    </View>
                    {isSelected && (
                      <Ionicons
                        name="checkmark-circle"
                        size={24}
                        color={levelColor}
                      />
                    )}
                  </View>
                </Pressable>
              </DropShadowView>
            );
          })}
        </View>
      </View>

      {/* Primary Goal Selection */}
      <View className="mb-8">
        <Text className="mb-4 font-semibold text-foreground text-lg">
          What's your primary goal?
        </Text>

        <View className="gap-4">
          {goals.map((goal) => {
            const goalColor = colors[goal.color as keyof typeof colors];
            const isSelected = selectedGoal === goal.id;

            return (
              <DropShadowView className="rounded-2xl" key={goal.id}>
                <Pressable
                  onPress={() => setSelectedGoal(goal.id)}
                  className="rounded-2xl border-1 p-4"
                  style={{
                    borderColor: isSelected ? goalColor : colors.border,
                    backgroundColor: isSelected
                      ? colors.panel // Use panel background for better readability
                      : colors.panel,
                    shadowColor: isSelected ? "#000000" : "transparent",
                    shadowOffset: { width: 0, height: isSelected ? 2 : 0 },
                    shadowOpacity: isSelected ? 0.1 : 0,
                    shadowRadius: isSelected ? 8 : 0,
                    elevation: isSelected ? 3 : 0,
                  }}
                >
                  <View className="flex-row items-center gap-3">
                    <View
                      className="rounded-full p-3"
                      style={{
                        backgroundColor: isSelected ? goalColor : colors.panel,
                        borderWidth: isSelected ? 0 : 1,
                        borderColor: goalColor,
                      }}
                    >
                      <Ionicons
                        name={goal.icon as any}
                        size={20}
                        color={isSelected ? colors.background : goalColor}
                      />
                    </View>
                    <View className="flex-1">
                      <Text
                        className="font-medium"
                        style={{
                          color: isSelected ? goalColor : colors.foreground,
                        }}
                      >
                        {goal.title}
                      </Text>
                      <Text
                        className="text-sm"
                        style={{
                          color: isSelected
                            ? goalColor
                            : colors.mutedForeground,
                        }}
                      >
                        {goal.description}
                      </Text>
                    </View>
                    {isSelected && (
                      <Ionicons
                        name="checkmark-circle"
                        size={24}
                        color={goalColor}
                      />
                    )}
                  </View>
                </Pressable>
              </DropShadowView>
            );
          })}
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
    </ScreenScrollView>
  );
}
