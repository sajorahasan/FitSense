import Ionicons from "@expo/vector-icons/build/Ionicons";
import { useMutation } from "convex/react";
import { Button, Switch, useTheme } from "heroui-native";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { toast } from "sonner-native";
import FormHeader, { FormContainer } from "@/components/form";
import { useAppTheme } from "@/contexts/app-theme-context";
import { api } from "~/backend/_generated/api";

const notificationOptions = [
  {
    id: "workoutReminders",
    title: "Workout Reminders",
    description: "Get reminded to log your workouts",
    icon: "barbell",
  },
  {
    id: "mealReminders",
    title: "Meal Reminders",
    description: "Reminders to log your meals",
    icon: "restaurant",
  },
  {
    id: "goalCelebrations",
    title: "Goal Celebrations",
    description: "Celebrate when you achieve goals",
    icon: "trophy",
  },
  {
    id: "aiInsights",
    title: "AI Insights",
    description: "Receive personalized AI recommendations",
    icon: "bulb",
  },
  {
    id: "weeklyReports",
    title: "Weekly Reports",
    description: "Weekly summary of your progress",
    icon: "document-text",
  },
] as const;

export default function OnboardingPreferences() {
  const { colors } = useTheme();
  const { currentThemeId, setThemeById, availableThemes } = useAppTheme();
  const [notifications, setNotifications] = useState({
    workoutReminders: true,
    mealReminders: true,
    goalCelebrations: true,
    aiInsights: true,
    weeklyReports: true,
  });
  const [isLoading, setIsLoading] = useState(false);

  const updateProfile = useMutation(api.users.updateUserProfile);
  const completeOnboarding = useMutation(api.users.completeOnboarding);

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      // Save notification preferences and theme
      await updateProfile({
        notifications,
        themeId: currentThemeId,
      });

      // Complete onboarding
      await completeOnboarding();

      // Navigate to main app
      // router.replace("/(root)/(main)/index");
    } catch (error) {
      toast.error(
        `Failed to complete setup. Please try again. ${error instanceof Error ? error?.message : "Unknown error"}`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormContainer>
      <FormHeader
        title="Almost there!"
        description="Customize your preferences and choose your theme"
        containerClassName="mt-12"
      />

      {/* Progress indicator */}
      <View className="mb-6 flex-row items-center justify-center gap-2">
        <View className="h-2 w-8 rounded-full bg-accent" />
        <View className="h-2 w-8 rounded-full bg-accent" />
        <View className="h-2 w-8 rounded-full bg-accent" />
        <View className="h-2 w-8 rounded-full bg-accent" />
      </View>

      {/* Theme Selection */}
      <View className="mb-8">
        <Text className="mb-4 font-semibold text-foreground text-lg">
          Choose Your Theme
        </Text>
        <Text className="mb-6 text-muted-foreground">
          Pick a theme that matches your fitness journey and personality.
        </Text>

        <View className="gap-3">
          {availableThemes.map((theme) => (
            <TouchableOpacity
              key={theme.id}
              onPress={() => setThemeById(theme.id)}
              className={`rounded-2xl border-2 p-4 ${
                currentThemeId === theme.id
                  ? "border-accent bg-accent/5"
                  : "border-border bg-surface"
              }`}
            >
              <View className="flex-row items-center gap-3">
                <View
                  className={`rounded-full p-3 ${currentThemeId === theme.id ? "bg-accent" : "bg-muted"}`}
                >
                  <Ionicons
                    name={
                      theme.id === "lavender"
                        ? "flower"
                        : theme.id === "mint"
                          ? "leaf"
                          : theme.id === "sky"
                            ? "cloud"
                            : "color-palette"
                    }
                    size={20}
                    color={
                      currentThemeId === theme.id
                        ? colors.background
                        : colors.mutedForeground
                    }
                  />
                </View>
                <View className="flex-1">
                  <Text
                    className={`font-medium ${currentThemeId === theme.id ? "text-accent" : "text-foreground"}`}
                  >
                    {theme.name}
                  </Text>
                  <Text className="text-muted-foreground text-sm">
                    {theme.id === "lavender" &&
                      "Relaxing purple tones for mindfulness and evening routines"}
                    {theme.id === "mint" &&
                      "Fresh green hues for energy and outdoor activities"}
                    {theme.id === "sky" &&
                      "Calm blue shades for focus and morning routines"}
                    {theme.id === "default" && "Clean and minimal design"}
                  </Text>
                </View>
                {currentThemeId === theme.id && (
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

      {/* Notification Preferences */}
      <View className="mb-8">
        <Text className="mb-4 font-semibold text-foreground text-lg">
          Notification Preferences
        </Text>

        <Text className="mb-6 text-muted-foreground">
          Choose what notifications you'd like to receive. You can change these
          anytime in settings.
        </Text>

        <View className="gap-4">
          {notificationOptions.map((option) => (
            <View
              key={option.id}
              className="flex-row items-center gap-4 rounded-2xl bg-panel p-4"
            >
              <View className="rounded-full bg-accent/10 p-2">
                <Ionicons
                  name={option.icon as any}
                  size={20}
                  color={colors.accent}
                />
              </View>

              <View className="flex-1">
                <Text className="font-medium text-foreground">
                  {option.title}
                </Text>
                <Text className="text-muted-foreground text-sm">
                  {option.description}
                </Text>
              </View>

              <Switch
                isSelected={
                  notifications[option.id as keyof typeof notifications]
                }
                onSelectedChange={() =>
                  toggleNotification(option.id as keyof typeof notifications)
                }
              />
            </View>
          ))}
        </View>
      </View>

      {/* Complete Setup Button */}
      <View className="gap-3">
        <Button
          onPress={handleComplete}
          disabled={isLoading}
          className="rounded-3xl"
        >
          <Button.LabelContent>
            {isLoading ? "Completing Setup..." : "Complete Setup"}
          </Button.LabelContent>
          <Button.EndContent>
            <Ionicons name="checkmark" size={18} color={colors.background} />
          </Button.EndContent>
        </Button>

        <Button
          variant="ghost"
          onPress={handleComplete}
          disabled={isLoading}
          className="rounded-3xl"
        >
          <Button.LabelContent>Use default settings</Button.LabelContent>
        </Button>
      </View>
    </FormContainer>
  );
}
