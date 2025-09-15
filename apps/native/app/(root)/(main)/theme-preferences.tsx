import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import { router } from "expo-router";
import { Button, DropShadowView, Spinner, useTheme } from "heroui-native";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { toast } from "sonner-native";
import { ScreenScrollView } from "@/components/screen-scroll-view";
import { useAppTheme } from "@/contexts/app-theme-context";
import { api } from "~/backend/_generated/api";

export default function ThemePreferencesRoute() {
  const { colors, isDark } = useTheme();
  const { currentThemeId, setThemeById, availableThemes } = useAppTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedThemeId, setSelectedThemeId] = useState(currentThemeId);

  const updateProfile = useMutation(api.users.updateUserProfile);

  // Get the selected theme configuration for preview
  const selectedTheme = availableThemes.find(
    (theme) => theme.id === selectedThemeId,
  );
  const selectedThemeConfig = selectedTheme?.config;

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // First update the backend
      await updateProfile({
        themeId: selectedThemeId,
      });

      // Then update the local theme context
      setThemeById(selectedThemeId);

      toast.success("Theme preferences saved!");
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
          <Text className="font-bold text-2xl text-foreground">Theme</Text>
          <Text className="text-muted-foreground text-sm">
            Choose your preferred theme and colors
          </Text>
        </View>
      </View>

      {/* Theme Selection */}
      <View className="mb-6">
        <Text className="mb-4 font-semibold text-foreground text-lg">
          Choose Your Theme
        </Text>
        <Text className="mb-6 text-muted-foreground">
          Pick a theme that matches your fitness journey and personality.
        </Text>

        <View className="gap-3">
          {availableThemes.map((theme) => (
            <DropShadowView className="rounded-2xl" key={theme.id}>
              <Pressable
                onPress={() => setSelectedThemeId(theme.id)}
                className={`rounded-2xl border-2 p-4 ${
                  selectedThemeId === theme.id
                    ? "border-accent bg-accent/5"
                    : "border-border bg-surface"
                }`}
              >
                <View className="flex-row items-center gap-3">
                  <View
                    className={`rounded-full p-3 ${selectedThemeId === theme.id ? "bg-accent" : "bg-muted"}`}
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
                        selectedThemeId === theme.id
                          ? colors.background
                          : colors.mutedForeground
                      }
                    />
                  </View>
                  <View className="flex-1">
                    <Text
                      className={`font-medium ${selectedThemeId === theme.id ? "text-accent" : "text-foreground"}`}
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
                  {selectedThemeId === theme.id && (
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color={colors.accent}
                    />
                  )}
                </View>
              </Pressable>
            </DropShadowView>
          ))}
        </View>
      </View>

      {/* Theme Preview */}
      <View className="mb-6">
        <Text className="mb-4 font-semibold text-foreground text-lg">
          Preview - {selectedTheme?.name}
        </Text>
        <DropShadowView className="rounded-2xl">
          <View
            className="rounded-2xl p-4"
            style={{
              backgroundColor:
                selectedThemeConfig?.[isDark ? "dark" : "light"]?.colors
                  ?.panel || colors.panel,
            }}
          >
            <View className="mb-4 flex-row items-center gap-3">
              <View
                className="h-12 w-12 items-center justify-center rounded-full"
                style={{
                  backgroundColor:
                    selectedThemeConfig?.[isDark ? "dark" : "light"]?.colors
                      ?.accent || colors.accent,
                }}
              >
                <Ionicons
                  name="fitness"
                  size={24}
                  color={
                    selectedThemeConfig?.[isDark ? "dark" : "light"]?.colors
                      ?.accentForeground || colors.accentForeground
                  }
                />
              </View>
              <View className="flex-1">
                <Text
                  className="font-bold text-lg"
                  style={{
                    color:
                      selectedThemeConfig?.[isDark ? "dark" : "light"]?.colors
                        ?.foreground || colors.foreground,
                  }}
                >
                  FitSense
                </Text>
                <Text
                  className="text-sm"
                  style={{
                    color:
                      selectedThemeConfig?.[isDark ? "dark" : "light"]?.colors
                        ?.mutedForeground || colors.mutedForeground,
                  }}
                >
                  Your AI-powered fitness companion
                </Text>
              </View>
            </View>
            <View className="flex-row gap-2">
              <View
                className="h-8 flex-1 rounded-lg"
                style={{
                  backgroundColor:
                    selectedThemeConfig?.[isDark ? "dark" : "light"]?.colors
                      ?.accent || colors.accent,
                }}
              />
              <View
                className="h-8 flex-1 rounded-lg"
                style={{
                  backgroundColor:
                    selectedThemeConfig?.[isDark ? "dark" : "light"]?.colors
                      ?.success || colors.success,
                }}
              />
              <View
                className="h-8 flex-1 rounded-lg"
                style={{
                  backgroundColor:
                    selectedThemeConfig?.[isDark ? "dark" : "light"]?.colors
                      ?.warning || colors.warning,
                }}
              />
            </View>
          </View>
        </DropShadowView>
      </View>

      {/* Save Button */}
      <View className="gap-3">
        <Button
          onPress={handleSave}
          disabled={isLoading || selectedThemeId === currentThemeId}
          className="rounded-3xl"
        >
          <Button.LabelContent>
            {isLoading
              ? "Saving..."
              : selectedThemeId === currentThemeId
                ? "No Changes"
                : "Save Theme"}
          </Button.LabelContent>
          <Button.EndContent>
            {isLoading ? (
              <Spinner size="sm" color={colors.background} />
            ) : (
              <Ionicons name="checkmark" size={18} color={colors.background} />
            )}
          </Button.EndContent>
        </Button>

        {selectedThemeId !== currentThemeId && (
          <View className="mb-4 rounded-lg bg-accent/10 p-3">
            <Text className="text-center font-medium text-accent text-sm">
              Theme selection will be applied when you save
            </Text>
          </View>
        )}
      </View>
    </ScreenScrollView>
  );
}
