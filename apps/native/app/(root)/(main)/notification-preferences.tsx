import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import { router } from "expo-router";
import {
  Button,
  DropShadowView,
  Spinner,
  Switch,
  useTheme,
} from "heroui-native";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { toast } from "sonner-native";
import { ScreenScrollView } from "@/components/screen-scroll-view";
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

export default function NotificationPreferencesRoute() {
  const { colors } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const [notifications, setNotifications] = useState({
    workoutReminders: true,
    mealReminders: true,
    goalCelebrations: true,
    aiInsights: true,
    weeklyReports: true,
  });

  const updateProfile = useMutation(api.users.updateUserProfile);

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateProfile({
        notifications,
      });
      toast.success("Notification preferences saved!");
      router.back();
    } catch (error) {
      toast.error(
        `Failed to save preferences: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenScrollView contentContainerClassName="gap-6 p-6">
      {/* Header */}
      <View className="flex-row items-center gap-4">
        <Pressable
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center rounded-full bg-surface"
        >
          <Ionicons name="arrow-back" size={20} color={colors.foreground} />
        </Pressable>
        <View className="flex-1">
          <Text className="font-bold text-2xl text-foreground">
            Notifications
          </Text>
          <Text className="text-muted-foreground text-sm">
            Customize your notification preferences
          </Text>
        </View>
      </View>

      {/* Notification Preferences */}
      <View className="mb-6">
        <Text className="mb-4 font-semibold text-foreground text-lg">
          Notification Preferences
        </Text>
        <Text className="mb-6 text-muted-foreground">
          Choose what notifications you'd like to receive. You can change these
          anytime in settings.
        </Text>

        <View className="gap-4">
          {notificationOptions.map((option) => (
            <DropShadowView className="rounded-2xl" key={option.id}>
              <Pressable
                onPress={() =>
                  toggleNotification(option.id as keyof typeof notifications)
                }
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
              </Pressable>
            </DropShadowView>
          ))}
        </View>
      </View>

      {/* Save Button */}
      <View className="gap-3">
        <Button
          onPress={handleSave}
          disabled={isLoading}
          className="rounded-3xl"
        >
          <Button.LabelContent>
            {isLoading ? "Saving..." : "Save Preferences"}
          </Button.LabelContent>
          <Button.EndContent>
            {isLoading ? (
              <Spinner size="sm" color={colors.background} />
            ) : (
              <Ionicons name="checkmark" size={18} color={colors.background} />
            )}
          </Button.EndContent>
        </Button>

        <Button
          variant="ghost"
          onPress={() => router.back()}
          disabled={isLoading}
          className="rounded-3xl"
        >
          <Button.LabelContent>Cancel</Button.LabelContent>
        </Button>
      </View>
    </ScreenScrollView>
  );
}
