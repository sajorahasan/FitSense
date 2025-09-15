import Ionicons from "@expo/vector-icons/build/Ionicons";
import { useMutation } from "convex/react";
import { useRouter } from "expo-router";
import { useTheme } from "heroui-native";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { toast } from "sonner-native";
import FormHeader from "@/components/form";
import { ScreenScrollView } from "@/components/screen-scroll-view";
import { useNetwork } from "@/contexts/network-context";
import { SyncManager } from "@/lib/sync-manager";
import { api } from "~/backend/_generated/api";

const workoutTypes = [
  { key: "cardio", label: "Cardio" },
  { key: "strength", label: "Strength Training" },
  { key: "flexibility", label: "Flexibility" },
  { key: "sports", label: "Sports" },
  { key: "other", label: "Other" },
] as const;

const moodOptions = [
  { key: "terrible", label: "Terrible" },
  { key: "poor", label: "Poor" },
  { key: "okay", label: "Okay" },
  { key: "good", label: "Good" },
  { key: "excellent", label: "Excellent" },
] as const;

const effortLevels = [
  { key: 1, label: "1 - Very Light" },
  { key: 2, label: "2 - Light" },
  { key: 3, label: "3 - Moderate" },
  { key: 4, label: "4 - Somewhat Hard" },
  { key: 5, label: "5 - Hard" },
  { key: 6, label: "6 - Very Hard" },
  { key: 7, label: "7 - Extremely Hard" },
  { key: 8, label: "8 - Maximum" },
  { key: 9, label: "9 - Near Maximum" },
  { key: 10, label: "10 - Maximum Effort" },
] as const;

export default function LogWorkoutScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { isOnline } = useNetwork();
  const syncManager = SyncManager.getInstance();
  const insets = useSafeAreaInsets();

  // Form state
  const [workoutName, setWorkoutName] = useState("");
  const [workoutType, setWorkoutType] = useState<string>("");
  const [startTime] = useState(new Date());
  const [endTime] = useState<Date | null>(null);
  const [duration, setDuration] = useState("");
  const [mood, setMood] = useState<string>("");
  const [perceivedEffort, setPerceivedEffort] = useState<number | null>(null);
  const [notes, setNotes] = useState("");
  const [location, setLocation] = useState("");
  const [isIndoor, setIsIndoor] = useState(true);

  const createWorkout = useMutation(api.workouts.createWorkout);

  const handleSave = async () => {
    if (!workoutName.trim()) {
      toast.error("Please enter a workout name");
      return;
    }

    if (!workoutType) {
      toast.error("Please select a workout type");
      return;
    }

    if (!mood) {
      toast.error("Please select your mood");
      return;
    }

    if (perceivedEffort === null) {
      toast.error("Please select your perceived effort level");
      return;
    }

    setIsLoading(true);
    try {
      const endTimeValue = endTime || new Date();
      const durationMinutes = duration
        ? Number.parseInt(duration, 10)
        : Math.round(
            (endTimeValue.getTime() - startTime.getTime()) / (1000 * 60),
          );

      const workoutData = {
        name: workoutName.trim(),
        type: workoutType as any,
        startTime: startTime.getTime(),
        endTime: endTimeValue.getTime(),
        duration: durationMinutes,
        mood: mood as any,
        perceivedEffort: perceivedEffort as any,
        notes: notes.trim() || undefined,
        location: location.trim() || undefined,
        indoor: isIndoor,
        exercises: [], // TODO: Add exercise tracking in future iteration
      };

      if (isOnline) {
        // Try to save online first
        try {
          await createWorkout(workoutData);
          toast.success("Workout logged successfully!");
        } catch (error) {
          // If online save fails, fall back to offline
          console.warn("Online save failed, saving offline:", error);
          const _offlineId = syncManager.addWorkoutToQueue(
            workoutData,
            "create",
          );
          toast.success(
            "Workout saved offline. Will sync when connection is restored.",
          );
        }
      } else {
        // Save offline
        const _offlineId = syncManager.addWorkoutToQueue(workoutData, "create");
        toast.success(
          "Workout saved offline. Will sync when connection is restored.",
        );
      }

      router.back();
    } catch (error) {
      console.error("Error logging workout:", error);
      toast.error("Failed to log workout. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenScrollView
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
      contentContainerClassName="gap-6 px-6"
    >
      <FormHeader
        title="Log Workout"
        description="Record your exercise session"
        containerClassName="mt-12"
      />

      {/* Basic Information */}
      <View className="gap-4">
        <Text className="font-semibold text-foreground text-lg">
          Basic Information
        </Text>

        <View className="gap-2">
          <Text className="font-medium text-foreground text-sm">
            Workout Name *
          </Text>
          <TextInput
            className="rounded-lg border border-border bg-background px-3 py-3 text-foreground"
            placeholder="e.g., Morning Run, Upper Body Strength"
            placeholderTextColor={colors.mutedForeground}
            value={workoutName}
            onChangeText={setWorkoutName}
          />
        </View>

        <View className="gap-2">
          <Text className="font-medium text-foreground text-sm">
            Workout Type *
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {workoutTypes.map((type) => (
              <TouchableOpacity
                key={type.key}
                className={`rounded-lg border px-4 py-2 ${
                  workoutType === type.key
                    ? "border-accent bg-accent/10"
                    : "border-border bg-background"
                }`}
                onPress={() => setWorkoutType(type.key)}
              >
                <Text
                  className={`text-sm ${
                    workoutType === type.key ? "font-medium" : "text-foreground"
                  }`}
                  style={{
                    color:
                      workoutType === type.key
                        ? colors.accent
                        : colors.foreground,
                  }}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="flex-row gap-3">
          <View className="flex-1">
            <View className="gap-2">
              <Text className="font-medium text-foreground text-sm">
                Start Time
              </Text>
              <TextInput
                className="rounded-lg border border-border bg-muted px-3 py-3 text-foreground"
                value={startTime.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                editable={false}
              />
            </View>
          </View>
          <View className="flex-1">
            <View className="gap-2">
              <Text className="font-medium text-foreground text-sm">
                Duration (minutes)
              </Text>
              <TextInput
                className="rounded-lg border border-border bg-background px-3 py-3 text-foreground"
                placeholder="e.g., 45"
                placeholderTextColor={colors.mutedForeground}
                value={duration}
                onChangeText={setDuration}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        <View className="gap-2">
          <Text className="font-medium text-foreground text-sm">
            Location (optional)
          </Text>
          <TextInput
            className="rounded-lg border border-border bg-background px-3 py-3 text-foreground"
            placeholder="e.g., Gym, Park, Home"
            placeholderTextColor={colors.mutedForeground}
            value={location}
            onChangeText={setLocation}
          />
        </View>

        <View className="flex-row items-center justify-between">
          <Text className="text-foreground">Indoor Workout</Text>
          <TouchableOpacity
            className={`rounded-lg border px-4 py-2 ${
              isIndoor
                ? "border-accent bg-accent/10"
                : "border-border bg-background"
            }`}
            onPress={() => setIsIndoor(!isIndoor)}
          >
            <Text
              className={`text-sm ${
                isIndoor ? "font-medium" : "text-foreground"
              }`}
              style={{
                color: isIndoor ? colors.accent : colors.foreground,
              }}
            >
              {isIndoor ? "Yes" : "No"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* How You Felt */}
      <View className="gap-4">
        <Text className="font-semibold text-foreground text-lg">
          How You Felt
        </Text>

        <View className="gap-2">
          <Text className="font-medium text-foreground text-sm">
            Mood After Workout *
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {moodOptions.map((option) => (
              <TouchableOpacity
                key={option.key}
                className={`rounded-lg border px-4 py-2 ${
                  mood === option.key
                    ? "border-accent bg-accent/10"
                    : "border-border bg-background"
                }`}
                onPress={() => setMood(option.key)}
              >
                <Text
                  className={`text-sm ${
                    mood === option.key ? "font-medium" : "text-foreground"
                  }`}
                  style={{
                    color:
                      mood === option.key ? colors.accent : colors.foreground,
                  }}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="gap-2">
          <Text className="font-medium text-foreground text-sm">
            Perceived Effort (1-10) *
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {effortLevels.map((level) => (
              <TouchableOpacity
                key={level.key}
                className={`rounded-lg border px-3 py-2 ${
                  perceivedEffort === level.key
                    ? "border-accent bg-accent/10"
                    : "border-border bg-background"
                }`}
                onPress={() => setPerceivedEffort(level.key)}
              >
                <Text
                  className={`text-xs ${
                    perceivedEffort === level.key
                      ? "font-medium"
                      : "text-foreground"
                  }`}
                  style={{
                    color:
                      perceivedEffort === level.key
                        ? colors.accent
                        : colors.foreground,
                  }}
                >
                  {level.key}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Notes */}
      <View className="gap-4">
        <Text className="font-semibold text-foreground text-lg">
          Additional Notes
        </Text>

        <View className="gap-2">
          <Text className="font-medium text-foreground text-sm">
            Notes (optional)
          </Text>
          <TextInput
            className="rounded-lg border border-border bg-background px-3 py-3 text-foreground"
            placeholder="Any additional thoughts about your workout..."
            placeholderTextColor={colors.mutedForeground}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>
      </View>

      {/* Action Buttons */}
      <View className="gap-3 pb-6">
        <TouchableOpacity
          className={`rounded-xl px-6 py-4 ${isLoading ? "opacity-50" : ""}`}
          style={{ backgroundColor: colors.accent }}
          onPress={handleSave}
          disabled={isLoading}
        >
          <View className="flex-row items-center justify-center gap-2">
            <Ionicons name="checkmark" size={20} color={colors.background} />
            <Text className="font-semibold text-background text-lg">
              {isLoading ? "Logging..." : "Log Workout"}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          className="rounded-xl border border-border bg-background px-6 py-4"
          onPress={() => router.back()}
          disabled={isLoading}
        >
          <Text className="text-center font-semibold text-foreground text-lg">
            Cancel
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenScrollView>
  );
}
