import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { router } from "expo-router";
import { Button, Card, Spinner, useTheme } from "heroui-native";
import { useState } from "react";
import { Alert, Linking, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { toast } from "sonner-native";
import { ScreenScrollView } from "@/components/screen-scroll-view";
import { authClient } from "@/lib/better-auth/auth-client";
import { api } from "~/backend/_generated/api";

// Simple Toggle Component
const Toggle = ({
  isSelected,
  onValueChange,
}: {
  isSelected: boolean;
  onValueChange: (value: boolean) => void;
}) => (
  <Pressable
    onPress={() => onValueChange(!isSelected)}
    className={`h-6 w-11 rounded-full ${isSelected ? "bg-primary" : "bg-muted"}`}
  >
    <View
      className={`h-5 w-5 rounded-full bg-background shadow-sm transition-transform ${
        isSelected ? "translate-x-5" : "translate-x-0.5"
      }`}
      style={{ marginTop: 0.5 }}
    />
  </Pressable>
);

export default function SettingsRoute() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isDeletingUser, setIsDeletingUser] = useState(false);

  // User data queries
  const user = useQuery(api.users.getCurrentUser);
  const emailStatus = useQuery(api.users.getUserEmailStatus);

  // Settings state
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [metricUnits, setMetricUnits] = useState(true);

  // Navigation function
  const handleNavigateToProfile = () => {
    router.push("/profile");
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
        <View className="mb-3 h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg">
          <Ionicons name="fitness" size={32} color={colors.background} />
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
            <View className="h-20 w-20 items-center justify-center rounded-full bg-primary shadow-lg">
              <Ionicons name="person" size={32} color={colors.background} />
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
            <Text className="font-bold text-2xl text-primary">7</Text>
            <Text className="text-muted-foreground text-sm">Workouts</Text>
          </View>
          <View className="items-center">
            <Text className="font-bold text-2xl text-primary">23</Text>
            <Text className="text-muted-foreground text-sm">Meals Logged</Text>
          </View>
          <View className="items-center">
            <Text className="font-bold text-2xl text-primary">5</Text>
            <Text className="text-muted-foreground text-sm">Days Active</Text>
          </View>
        </View>
      </Card>

      {/* App Preferences */}
      <Card className="p-4">
        <Text className="mb-4 font-bold text-foreground text-xl">
          Preferences
        </Text>
        <View className="gap-3">
          <View className="flex-row items-center justify-between py-2">
            <View className="flex-row items-center gap-3">
              <Ionicons name="moon" size={20} color={colors.foreground} />
              <Text className="text-foreground">Dark Mode</Text>
            </View>
            <Toggle isSelected={isDarkMode} onValueChange={setIsDarkMode} />
          </View>

          <View className="flex-row items-center justify-between py-2">
            <View className="flex-row items-center gap-3">
              <Ionicons
                name="notifications"
                size={20}
                color={colors.foreground}
              />
              <Text className="text-foreground">Notifications</Text>
            </View>
            <Toggle
              isSelected={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
            />
          </View>

          <Pressable className="flex-row items-center justify-between py-2">
            <View className="flex-row items-center gap-3">
              <Ionicons name="language" size={20} color={colors.foreground} />
              <Text className="text-foreground">Language</Text>
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
        <View className="gap-3">
          <View className="flex-row items-center justify-between py-2">
            <View className="flex-row items-center gap-3">
              <Ionicons name="fitness" size={20} color={colors.foreground} />
              <Text className="text-foreground">Units (Metric/Imperial)</Text>
            </View>
            <Toggle isSelected={metricUnits} onValueChange={setMetricUnits} />
          </View>

          <Pressable className="flex-row items-center justify-between py-2">
            <View className="flex-row items-center gap-3">
              <Ionicons name="time" size={20} color={colors.foreground} />
              <Text className="text-foreground">Reminder Times</Text>
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
        <View className="gap-3">
          <Pressable
            className="flex-row items-center justify-between py-2"
            onPress={() => handleOpenLink("https://fitsense.app/privacy")}
          >
            <View className="flex-row items-center gap-3">
              <Ionicons
                name="shield-checkmark"
                size={20}
                color={colors.foreground}
              />
              <Text className="text-foreground">Privacy Policy</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={colors.mutedForeground}
            />
          </Pressable>

          <Pressable
            className="flex-row items-center justify-between py-2"
            onPress={() => handleOpenLink("https://fitsense.app/terms")}
          >
            <View className="flex-row items-center gap-3">
              <Ionicons
                name="document-text"
                size={20}
                color={colors.foreground}
              />
              <Text className="text-foreground">Terms of Service</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={colors.mutedForeground}
            />
          </Pressable>

          <Pressable
            className="flex-row items-center justify-between py-2"
            onPress={handleExportData}
          >
            <View className="flex-row items-center gap-3">
              <Ionicons name="download" size={20} color={colors.foreground} />
              <Text className="text-foreground">Export Data</Text>
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
        <View className="gap-3">
          <Pressable
            className="flex-row items-center justify-between py-2"
            onPress={() => handleOpenLink("https://fitsense.app/help")}
          >
            <View className="flex-row items-center gap-3">
              <Ionicons
                name="help-circle"
                size={20}
                color={colors.foreground}
              />
              <Text className="text-foreground">Help & FAQ</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={colors.mutedForeground}
            />
          </Pressable>

          <Pressable
            className="flex-row items-center justify-between py-2"
            onPress={handleContactSupport}
          >
            <View className="flex-row items-center gap-3">
              <Ionicons name="mail" size={20} color={colors.foreground} />
              <Text className="text-foreground">Contact Support</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={colors.mutedForeground}
            />
          </Pressable>

          <Pressable
            className="flex-row items-center justify-between py-2"
            onPress={handleRateApp}
          >
            <View className="flex-row items-center gap-3">
              <Ionicons name="star" size={20} color={colors.foreground} />
              <Text className="text-foreground">Rate App</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={colors.mutedForeground}
            />
          </Pressable>

          <View className="flex-row items-center justify-between py-2">
            <View className="flex-row items-center gap-3">
              <Ionicons
                name="information-circle"
                size={20}
                color={colors.foreground}
              />
              <Text className="text-foreground">App Version</Text>
            </View>
            <Text className="text-muted-foreground">1.0.0</Text>
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
