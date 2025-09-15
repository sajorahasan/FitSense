import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { router } from "expo-router";
import { Button, Card, Spinner, Switch, useTheme } from "heroui-native";
import { useState } from "react";
import { Alert, Linking, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { toast } from "sonner-native";
import { ScreenScrollView } from "@/components/screen-scroll-view";
import { authClient } from "@/lib/better-auth/auth-client";
import { api } from "~/backend/_generated/api";

export default function SettingsRoute() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isDeletingUser, setIsDeletingUser] = useState(false);

  // User data queries
  const user = useQuery(api.users.getCurrentUser);
  const emailStatus = useQuery(api.users.getUserEmailStatus);

  // Settings state
  const [metricUnits, setMetricUnits] = useState(true);

  // Navigation functions
  const handleNavigateToProfile = () => {
    router.push("/profile");
  };

  const handleNavigateToNotifications = () => {
    router.push("/notification-preferences");
  };

  const handleNavigateToTheme = () => {
    router.push("/theme-preferences");
  };

  // Settings handlers
  const handleOpenLink = (url: string) => {
    Linking.openURL(url).catch(() => {
      toast.error("Could not open link");
    });
  };

  const handleRateApp = () => {
    // In a real app, this would open the app store
    toast.success("Thank you for your feedback!");
  };

  const handleContactSupport = () => {
    Linking.openURL("mailto:support@fitsense.app").catch(() => {
      toast.error("Could not open email client");
    });
  };

  const handleExportData = () => {
    toast.success("Data export feature coming soon!");
  };

  // Auth functions
  const handleSignOut = async () => {
    const { error, data } = await authClient.signOut(
      {},
      {
        onRequest: () => {
          setIsSigningOut(true);
        },
        onSuccess: () => {
          setIsSigningOut(false);
          console.log("Sign out successful");
        },
        onError: (ctx) => {
          console.error(ctx.error);
          toast.error(ctx.error.message || "Failed to sign out");
        },
      },
    );

    console.log(data, error);
  };

  const handleDeleteUser = async () => {
    const { error, data } = await authClient.deleteUser(
      {},
      {
        onRequest: () => {
          setIsDeletingUser(true);
        },
        onSuccess: () => {
          console.log("User deleted successfully");
          setIsDeletingUser(false);
          // The auth system will automatically handle the redirect
        },
        onError: (ctx) => {
          setIsDeletingUser(false);
          console.error(ctx.error);
          toast.error(ctx.error.message || "Failed to delete user");
        },
      },
    );

    console.log(data, error);
  };

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Spinner size="lg" />
        <Text className="mt-4 text-muted-foreground">Loading settings...</Text>
      </View>
    );
  }

  return (
    <ScreenScrollView
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
      contentContainerClassName="gap-6 p-6"
    >
      {/* App Header */}
      <View className="items-center py-6">
        <View
          className="mb-3 h-16 w-16 items-center justify-center rounded-2xl shadow-lg"
          style={{ backgroundColor: colors.accent }}
        >
          <Ionicons name="fitness" size={32} color={colors.accentForeground} />
        </View>
        <Text className="font-bold text-2xl text-foreground">FitSense</Text>
        <Text className="text-muted-foreground text-sm">
          Your AI-powered fitness companion
        </Text>
      </View>

      {/* Enhanced Profile Section */}
      <Card className="p-4">
        <Pressable onPress={handleNavigateToProfile}>
          <View className="flex-row items-center gap-4">
            {/* Profile Avatar with better styling */}
            <View
              className="h-20 w-20 items-center justify-center rounded-full shadow-lg"
              style={{ backgroundColor: colors.accent }}
            >
              <Ionicons
                name="person"
                size={32}
                color={colors.accentForeground}
              />
            </View>

            {/* User Info with more details */}
            <View className="flex-1">
              <Text className="font-bold text-foreground text-xl">
                {emailStatus?.name || "User"}
              </Text>
              <Text className="mb-1 text-muted-foreground text-sm">
                {emailStatus?.email}
              </Text>
              <View className="flex-row items-center gap-2">
                <View
                  className={`h-2 w-2 rounded-full ${emailStatus?.emailVerified ? "bg-green-500" : "bg-yellow-500"}`}
                />
                <Text className="text-muted-foreground text-xs">
                  {emailStatus?.emailVerified ? "Verified" : "Unverified"}
                </Text>
              </View>
            </View>

            {/* Arrow Icon */}
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.mutedForeground}
            />
          </View>
        </Pressable>
      </Card>

      {/* Quick Stats */}
      <Card className="p-4">
        <Text className="mb-4 font-bold text-foreground text-xl">
          Quick Stats
        </Text>
        <View className="flex-row justify-between">
          <View className="items-center">
            <Text
              className="font-bold text-2xl"
              style={{ color: colors.accent }}
            >
              7
            </Text>
            <Text className="text-muted-foreground text-sm">Workouts</Text>
          </View>
          <View className="items-center">
            <Text
              className="font-bold text-2xl"
              style={{ color: colors.accent }}
            >
              23
            </Text>
            <Text className="text-muted-foreground text-sm">Meals Logged</Text>
          </View>
          <View className="items-center">
            <Text
              className="font-bold text-2xl"
              style={{ color: colors.accent }}
            >
              5
            </Text>
            <Text className="text-muted-foreground text-sm">Days Active</Text>
          </View>
        </View>
      </Card>

      {/* App Preferences */}
      <Card className="p-4">
        <Text className="mb-4 font-bold text-foreground text-xl">
          App Preferences
        </Text>
        <View className="gap-4">
          <Pressable
            className="flex-row items-center gap-4 rounded-2xl p-4"
            onPress={handleNavigateToTheme}
          >
            <View className="rounded-full bg-accent/10 p-2">
              <Ionicons name="color-palette" size={20} color={colors.accent} />
            </View>
            <View className="flex-1">
              <Text className="font-medium text-foreground">Theme</Text>
              <Text className="text-muted-foreground text-sm">
                Choose your preferred theme and colors
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={colors.mutedForeground}
            />
          </Pressable>

          <Pressable
            className="flex-row items-center gap-4 rounded-2xl p-4"
            onPress={handleNavigateToNotifications}
          >
            <View className="rounded-full bg-accent/10 p-2">
              <Ionicons name="notifications" size={20} color={colors.accent} />
            </View>
            <View className="flex-1">
              <Text className="font-medium text-foreground">Notifications</Text>
              <Text className="text-muted-foreground text-sm">
                Customize your notification preferences
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={colors.mutedForeground}
            />
          </Pressable>
        </View>
      </Card>

      {/* Health & Fitness Settings */}
      <Card className="p-4">
        <Text className="mb-4 font-bold text-foreground text-xl">
          Health & Fitness
        </Text>
        <View className="gap-4">
          <Pressable
            onPress={() => setMetricUnits(!metricUnits)}
            className="flex-row items-center gap-4 rounded-2xl p-4"
          >
            <View className="rounded-full bg-accent/10 p-2">
              <Ionicons name="fitness" size={20} color={colors.accent} />
            </View>
            <View className="flex-1">
              <Text className="font-medium text-foreground">
                Units (Metric/Imperial)
              </Text>
              <Text className="text-muted-foreground text-sm">
                {metricUnits
                  ? "Using metric units (kg, cm)"
                  : "Using imperial units (lbs, ft)"}
              </Text>
            </View>
            <Switch
              isSelected={metricUnits}
              onSelectedChange={() => setMetricUnits(!metricUnits)}
            />
          </Pressable>

          <Pressable className="flex-row items-center gap-4 rounded-2xl p-4">
            <View className="rounded-full bg-accent/10 p-2">
              <Ionicons name="time" size={20} color={colors.accent} />
            </View>
            <View className="flex-1">
              <Text className="font-medium text-foreground">
                Reminder Times
              </Text>
              <Text className="text-muted-foreground text-sm">
                Set custom reminder times for workouts and meals
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={colors.mutedForeground}
            />
          </Pressable>
        </View>
      </Card>

      {/* Data & Privacy */}
      <Card className="p-4">
        <Text className="mb-4 font-bold text-foreground text-xl">
          Data & Privacy
        </Text>
        <View className="gap-4">
          <Pressable
            className="flex-row items-center gap-4 rounded-2xl p-4"
            onPress={() => handleOpenLink("https://fitsense.app/privacy")}
          >
            <View className="rounded-full bg-accent/10 p-2">
              <Ionicons
                name="shield-checkmark"
                size={20}
                color={colors.accent}
              />
            </View>
            <View className="flex-1">
              <Text className="font-medium text-foreground">
                Privacy Policy
              </Text>
              <Text className="text-muted-foreground text-sm">
                Learn how we protect your data
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={colors.mutedForeground}
            />
          </Pressable>

          <Pressable
            className="flex-row items-center gap-4 rounded-2xl p-4"
            onPress={() => handleOpenLink("https://fitsense.app/terms")}
          >
            <View className="rounded-full bg-accent/10 p-2">
              <Ionicons name="document-text" size={20} color={colors.accent} />
            </View>
            <View className="flex-1">
              <Text className="font-medium text-foreground">
                Terms of Service
              </Text>
              <Text className="text-muted-foreground text-sm">
                Read our terms and conditions
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={colors.mutedForeground}
            />
          </Pressable>

          <Pressable
            className="flex-row items-center gap-4 rounded-2xl p-4"
            onPress={handleExportData}
          >
            <View className="rounded-full bg-accent/10 p-2">
              <Ionicons name="download" size={20} color={colors.accent} />
            </View>
            <View className="flex-1">
              <Text className="font-medium text-foreground">Export Data</Text>
              <Text className="text-muted-foreground text-sm">
                Download your personal data
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={colors.mutedForeground}
            />
          </Pressable>
        </View>
      </Card>

      {/* Support & Info */}
      <Card className="p-4">
        <Text className="mb-4 font-bold text-foreground text-xl">Support</Text>
        <View className="gap-4">
          <Pressable
            className="flex-row items-center gap-4 rounded-2xl p-4"
            onPress={() => handleOpenLink("https://fitsense.app/help")}
          >
            <View className="rounded-full bg-accent/10 p-2">
              <Ionicons name="help-circle" size={20} color={colors.accent} />
            </View>
            <View className="flex-1">
              <Text className="font-medium text-foreground">Help & FAQ</Text>
              <Text className="text-muted-foreground text-sm">
                Find answers to common questions
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={colors.mutedForeground}
            />
          </Pressable>

          <Pressable
            className="flex-row items-center gap-4 rounded-2xl p-4"
            onPress={handleContactSupport}
          >
            <View className="rounded-full bg-accent/10 p-2">
              <Ionicons name="mail" size={20} color={colors.accent} />
            </View>
            <View className="flex-1">
              <Text className="font-medium text-foreground">
                Contact Support
              </Text>
              <Text className="text-muted-foreground text-sm">
                Get help from our support team
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={colors.mutedForeground}
            />
          </Pressable>

          <Pressable
            className="flex-row items-center gap-4 rounded-2xl p-4"
            onPress={handleRateApp}
          >
            <View className="rounded-full bg-accent/10 p-2">
              <Ionicons name="star" size={20} color={colors.accent} />
            </View>
            <View className="flex-1">
              <Text className="font-medium text-foreground">Rate App</Text>
              <Text className="text-muted-foreground text-sm">
                Share your feedback with us
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={colors.mutedForeground}
            />
          </Pressable>

          <View className="flex-row items-center gap-4 rounded-2xl p-4">
            <View className="rounded-full bg-accent/10 p-2">
              <Ionicons
                name="information-circle"
                size={20}
                color={colors.accent}
              />
            </View>
            <View className="flex-1">
              <Text className="font-medium text-foreground">App Version</Text>
              <Text className="text-muted-foreground text-sm">
                Current version information
              </Text>
            </View>
            <Text className="font-medium text-muted-foreground">1.0.0</Text>
          </View>
        </View>
      </Card>

      {/* Enhanced Account Actions */}
      <Card className="p-4">
        <Text className="mb-4 font-bold text-foreground text-xl">Account</Text>
        <View className="gap-3">
          <Button
            className="rounded-full"
            variant="tertiary"
            disabled={isSigningOut}
            onPress={() => {
              Alert.alert("Sign Out", "Are you sure you want to sign out?", [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Sign Out",
                  style: "destructive",
                  onPress: handleSignOut,
                },
              ]);
            }}
          >
            <Button.StartContent>
              <Ionicons
                name="log-out-outline"
                size={18}
                color={colors.foreground}
              />
            </Button.StartContent>
            <Button.LabelContent>
              {isSigningOut ? "Signing Out..." : "Sign Out"}
            </Button.LabelContent>
            {isSigningOut && (
              <Button.EndContent>
                <Spinner color={colors.foreground} />
              </Button.EndContent>
            )}
          </Button>

          <Button
            variant="tertiary"
            className="rounded-full border-red-500/20"
            disabled={isDeletingUser}
            onPress={() => {
              Alert.alert(
                "Delete Account",
                "This action cannot be undone. All your data will be permanently deleted.",
                [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Delete",
                    style: "destructive",
                    onPress: handleDeleteUser,
                  },
                ],
              );
            }}
          >
            <Button.StartContent>
              <Ionicons name="trash-outline" size={18} color="#ef4444" />
            </Button.StartContent>
            <Button.LabelContent className="text-red-500">
              {isDeletingUser ? "Deleting..." : "Delete Account"}
            </Button.LabelContent>
            {isDeletingUser && (
              <Button.EndContent>
                <Spinner color="#ef4444" />
              </Button.EndContent>
            )}
          </Button>
        </View>
      </Card>
    </ScreenScrollView>
  );
}
