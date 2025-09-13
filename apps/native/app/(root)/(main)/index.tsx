import { Ionicons } from "@expo/vector-icons";
import { api } from "@fitsense/backend/convex/_generated/api";
import { useQuery } from "convex/react";
import { Link } from "expo-router";
import { Button, useTheme } from "heroui-native";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScreenScrollView } from "@/components/screen-scroll-view";

export default function HomeRoute() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const userData = useQuery(api.users.getAllUserDataQuery);

  if (!userData) return null;

  return (
    <ScreenScrollView
      className="flex-1"
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      <View className="flex-1 gap-6 px-6 py-4">
        {/* Welcome Section */}
        <View className="gap-2">
          <Text className="font-extrabold text-4xl text-foreground">
            Welcome back!
          </Text>
          <Text className="text-lg text-muted-foreground">
            {userData.userMetaData.name}
          </Text>
          <Text className="text-muted-foreground text-sm">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>
        </View>

        {/* Quick Actions */}
        <View className="gap-4">
          <Text className="font-semibold text-foreground text-xl">
            Quick Actions
          </Text>
          <View className="gap-3">
            <Link href={"/(root)/(main)/log-workout"} asChild>
              <Button className="rounded-xl" size={"lg"} color="primary">
                <Button.StartContent>
                  <Ionicons
                    name="fitness"
                    size={20}
                    color={colors.background}
                  />
                </Button.StartContent>
                <Button.LabelContent>Log Workout</Button.LabelContent>
              </Button>
            </Link>

            <Link href={"/(root)/(main)/log-meal"} asChild>
              <Button className="rounded-xl" size={"lg"} color="secondary">
                <Button.StartContent>
                  <Ionicons
                    name="restaurant"
                    size={20}
                    color={colors.background}
                  />
                </Button.StartContent>
                <Button.LabelContent>Log Meal</Button.LabelContent>
              </Button>
            </Link>

            <Link href={"/(root)/(main)/log-metrics"} asChild>
              <Button className="rounded-xl" size={"lg"} color="success">
                <Button.StartContent>
                  <Ionicons name="heart" size={20} color={colors.background} />
                </Button.StartContent>
                <Button.LabelContent>Log Health Metrics</Button.LabelContent>
              </Button>
            </Link>
          </View>
        </View>

        {/* Recent Activities */}
        <View className="gap-4">
          <Text className="font-semibold text-foreground text-xl">
            Recent Activities
          </Text>
          <View className="gap-3">
            {/* Placeholder for recent workouts */}
            <View className="rounded-xl border border-border bg-card p-4">
              <View className="flex-row items-center gap-3">
                <View className="rounded-full bg-primary/10 p-2">
                  <Ionicons name="fitness" size={20} color={colors.primary} />
                </View>
                <View className="flex-1">
                  <Text className="font-medium text-foreground">
                    No recent workouts
                  </Text>
                  <Text className="text-muted-foreground text-sm">
                    Start your fitness journey today!
                  </Text>
                </View>
              </View>
            </View>

            {/* Placeholder for recent meals */}
            <View className="rounded-xl border border-border bg-card p-4">
              <View className="flex-row items-center gap-3">
                <View className="rounded-full bg-secondary/10 p-2">
                  <Ionicons
                    name="restaurant"
                    size={20}
                    color={colors.secondary}
                  />
                </View>
                <View className="flex-1">
                  <Text className="font-medium text-foreground">
                    No recent meals logged
                  </Text>
                  <Text className="text-muted-foreground text-sm">
                    Track your nutrition to reach your goals
                  </Text>
                </View>
              </View>
            </View>

            {/* Placeholder for recent health metrics */}
            <View className="rounded-xl border border-border bg-card p-4">
              <View className="flex-row items-center gap-3">
                <View className="rounded-full bg-success/10 p-2">
                  <Ionicons name="heart" size={20} color={colors.success} />
                </View>
                <View className="flex-1">
                  <Text className="font-medium text-foreground">
                    No health metrics recorded
                  </Text>
                  <Text className="text-muted-foreground text-sm">
                    Monitor your health progress
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Navigation */}
        <View className="gap-3">
          <Link href={"/(root)/(main)/profile"} asChild>
            <Button className="rounded-xl" size={"lg"} variant="bordered">
              <Button.StartContent>
                <Ionicons name="person" size={18} color={colors.foreground} />
              </Button.StartContent>
              <Button.LabelContent>View Profile</Button.LabelContent>
            </Button>
          </Link>

          <Link href={"/(root)/(main)/settings"} asChild>
            <Button className="rounded-xl" size={"lg"} variant="bordered">
              <Button.StartContent>
                <Ionicons name="settings" size={18} color={colors.foreground} />
              </Button.StartContent>
              <Button.LabelContent>Settings</Button.LabelContent>
            </Button>
          </Link>
        </View>
      </View>
    </ScreenScrollView>
  );
}
