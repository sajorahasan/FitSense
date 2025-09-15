import Ionicons from "@expo/vector-icons/build/Ionicons";
import { useMutation } from "convex/react";
import { useRouter } from "expo-router";
import { Button, Spinner, TextField, useTheme } from "heroui-native";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { toast } from "sonner-native";
import FormHeader from "@/components/form";
import { ScreenScrollView } from "@/components/screen-scroll-view";
import { useNetwork } from "@/contexts/network-context";
import { SyncManager } from "@/lib/sync-manager";
import { api } from "~/backend/_generated/api";

const metricTypes = [
  { key: "weight", label: "Weight", unit: "kg", icon: "scale-outline" },
  {
    key: "heart_rate",
    label: "Heart Rate",
    unit: "bpm",
    icon: "heart-outline",
  },
  {
    key: "blood_pressure",
    label: "Blood Pressure",
    unit: "mmHg",
    icon: "pulse-outline",
  },
  { key: "sleep", label: "Sleep", unit: "hours", icon: "moon-outline" },
  { key: "steps", label: "Steps", unit: "count", icon: "walk-outline" },
  { key: "body_fat", label: "Body Fat", unit: "%", icon: "body-outline" },
  {
    key: "blood_sugar",
    label: "Blood Sugar",
    unit: "mg/dL",
    icon: "medical-outline",
  },
  {
    key: "temperature",
    label: "Temperature",
    unit: "°C",
    icon: "thermometer-outline",
  },
  {
    key: "oxygen_saturation",
    label: "Oxygen Saturation",
    unit: "%",
    icon: "air-outline",
  },
  {
    key: "stress_level",
    label: "Stress Level",
    unit: "1-10",
    icon: "happy-outline",
  },
] as const;

const qualityOptions = [
  { key: "poor", label: "Poor" },
  { key: "fair", label: "Fair" },
  { key: "good", label: "Good" },
  { key: "excellent", label: "Excellent" },
] as const;

export default function LogHealthMetricsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { isOnline } = useNetwork();
  const syncManager = SyncManager.getInstance();

  // Form state
  const [selectedMetric, setSelectedMetric] = useState<string>("");
  const [value, setValue] = useState("");
  const [systolic, setSystolic] = useState(""); // For blood pressure
  const [diastolic, setDiastolic] = useState(""); // For blood pressure
  const [duration, setDuration] = useState(""); // For sleep, exercise duration
  const [quality, setQuality] = useState<string>("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [timestamp] = useState(new Date());

  const createHealthMetric = useMutation(api.healthMetrics.createHealthMetric);

  const getCurrentMetric = () => {
    return metricTypes.find((metric) => metric.key === selectedMetric);
  };

  const handleSave = async () => {
    if (!selectedMetric) {
      toast.error("Please select a metric type");
      return;
    }

    if (!value.trim()) {
      toast.error("Please enter a value");
      return;
    }

    const numericValue = Number.parseFloat(value);
    if (Number.isNaN(numericValue) || numericValue < 0) {
      toast.error("Please enter a valid value");
      return;
    }

    // Special validation for blood pressure
    if (selectedMetric === "blood_pressure") {
      if (!systolic.trim() || !diastolic.trim()) {
        toast.error("Please enter both systolic and diastolic values");
        return;
      }
      const sysValue = Number.parseFloat(systolic);
      const diaValue = Number.parseFloat(diastolic);
      if (
        Number.isNaN(sysValue) ||
        Number.isNaN(diaValue) ||
        sysValue < 0 ||
        diaValue < 0
      ) {
        toast.error("Please enter valid blood pressure values");
        return;
      }
    }

    setIsLoading(true);
    try {
      const metricData: any = {
        type: selectedMetric as any,
        value: numericValue,
        unit: getCurrentMetric()?.unit || "",
        timestamp: timestamp.getTime(),
        location: location.trim() || undefined,
        notes: notes.trim() || undefined,
      };

      // Add special fields based on metric type
      if (selectedMetric === "blood_pressure") {
        metricData.systolic = Number.parseFloat(systolic);
        metricData.diastolic = Number.parseFloat(diastolic);
      }

      if (selectedMetric === "sleep" && duration.trim()) {
        metricData.duration = Number.parseFloat(duration) * 3600; // Convert hours to seconds
      }

      if (quality) {
        metricData.quality = quality as any;
      }

      if (isOnline) {
        // Try to save online first
        try {
          await createHealthMetric(metricData);
          toast.success("Health metric logged successfully!");
        } catch (error) {
          // If online save fails, fall back to offline
          console.warn("Online save failed, saving offline:", error);
          const _offlineId = syncManager.addHealthMetricToQueue(
            metricData,
            "create",
          );
          toast.success(
            "Health metric saved offline. Will sync when connection is restored.",
          );
        }
      } else {
        // Save offline
        const _offlineId = syncManager.addHealthMetricToQueue(
          metricData,
          "create",
        );
        toast.success(
          "Health metric saved offline. Will sync when connection is restored.",
        );
      }

      router.back();
    } catch (error) {
      console.error("Error logging health metric:", error);
      toast.error("Failed to log health metric. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const currentMetric = getCurrentMetric();

  return (
    <ScreenScrollView contentContainerClassName="gap-6 px-6">
      <FormHeader
        title="Log Health Metric"
        description="Record your health measurements"
        containerClassName="mt-12"
      />

      {/* Metric Type Selection */}
      <View className="gap-4">
        <Text className="font-semibold text-foreground text-lg">
          Metric Type
        </Text>

        <View className="gap-2">
          <Text className="font-medium text-foreground text-sm">
            Select Metric *
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {metricTypes.map((metric) => (
              <TouchableOpacity
                key={metric.key}
                className={`rounded-lg border px-4 py-3 ${
                  selectedMetric === metric.key
                    ? "border-accent bg-accent/10"
                    : "border-border bg-background"
                }`}
                onPress={() => setSelectedMetric(metric.key)}
              >
                <View className="items-center gap-1">
                  <Ionicons
                    name={metric.icon as any}
                    size={20}
                    color={
                      selectedMetric === metric.key
                        ? colors.accent
                        : colors.foreground
                    }
                  />
                  <Text
                    className={`text-center text-xs ${
                      selectedMetric === metric.key
                        ? "font-medium"
                        : "text-foreground"
                    }`}
                    style={{
                      color:
                        selectedMetric === metric.key
                          ? colors.accent
                          : colors.foreground,
                    }}
                  >
                    {metric.label}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Value Input */}
      {selectedMetric && (
        <View className="gap-4">
          <Text className="font-semibold text-foreground text-lg">
            Measurement
          </Text>

          {selectedMetric === "blood_pressure" ? (
            <View className="gap-3">
              <Text className="font-medium text-foreground text-sm">
                Blood Pressure Values *
              </Text>
              <View className="flex-row gap-3">
                <View className="flex-1">
                  <TextField>
                    <TextField.Input
                      className="rounded-3xl"
                      placeholder="Systolic (e.g., 120)"
                      value={systolic}
                      onChangeText={setSystolic}
                      keyboardType="numeric"
                    >
                      <TextField.InputStartContent className="pointer-events-none">
                        <Ionicons
                          name="pulse-outline"
                          size={16}
                          color={colors.mutedForeground}
                        />
                      </TextField.InputStartContent>
                    </TextField.Input>
                  </TextField>
                </View>
                <View className="flex-1">
                  <TextField>
                    <TextField.Input
                      className="rounded-3xl"
                      placeholder="Diastolic (e.g., 80)"
                      value={diastolic}
                      onChangeText={setDiastolic}
                      keyboardType="numeric"
                    >
                      <TextField.InputStartContent className="pointer-events-none">
                        <Ionicons
                          name="pulse-outline"
                          size={16}
                          color={colors.mutedForeground}
                        />
                      </TextField.InputStartContent>
                    </TextField.Input>
                  </TextField>
                </View>
              </View>
            </View>
          ) : (
            <View className="gap-3">
              <Text className="font-medium text-foreground text-sm">
                {currentMetric?.label} Value *
              </Text>
              <TextField>
                <TextField.Input
                  className="rounded-3xl"
                  placeholder={`Enter ${currentMetric?.label.toLowerCase()} (${currentMetric?.unit})`}
                  value={value}
                  onChangeText={setValue}
                  keyboardType="numeric"
                >
                  <TextField.InputStartContent className="pointer-events-none">
                    <Ionicons
                      name={currentMetric?.icon as any}
                      size={16}
                      color={colors.mutedForeground}
                    />
                  </TextField.InputStartContent>
                </TextField.Input>
              </TextField>
            </View>
          )}

          {/* Duration for sleep */}
          {selectedMetric === "sleep" && (
            <TextField>
              <TextField.Input
                className="rounded-3xl"
                placeholder="Sleep duration (hours)"
                value={duration}
                onChangeText={setDuration}
                keyboardType="numeric"
              >
                <TextField.InputStartContent className="pointer-events-none">
                  <Ionicons
                    name="time-outline"
                    size={16}
                    color={colors.mutedForeground}
                  />
                </TextField.InputStartContent>
              </TextField.Input>
            </TextField>
          )}

          {/* Quality selection */}
          <View className="gap-2">
            <Text className="font-medium text-foreground text-sm">
              Quality (optional)
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {qualityOptions.map((option) => (
                <TouchableOpacity
                  key={option.key}
                  className={`rounded-lg border px-4 py-2 ${
                    quality === option.key
                      ? "border-accent bg-accent/10"
                      : "border-border bg-background"
                  }`}
                  onPress={() => setQuality(option.key)}
                >
                  <Text
                    className={`text-sm ${
                      quality === option.key ? "font-medium" : "text-foreground"
                    }`}
                    style={{
                      color:
                        quality === option.key
                          ? colors.accent
                          : colors.foreground,
                    }}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      )}

      {/* Additional Information */}
      <View className="gap-4">
        <Text className="font-semibold text-foreground text-lg">
          Additional Information
        </Text>

        <TextField>
          <TextField.Input
            className="rounded-3xl"
            placeholder="Location (optional)"
            value={location}
            onChangeText={setLocation}
          >
            <TextField.InputStartContent className="pointer-events-none">
              <Ionicons
                name="location-outline"
                size={16}
                color={colors.mutedForeground}
              />
            </TextField.InputStartContent>
          </TextField.Input>
        </TextField>

        <TextField>
          <TextField.Input
            className="rounded-xl"
            placeholder="Notes (optional)"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
          >
            <TextField.InputStartContent className="pointer-events-none">
              <Ionicons
                name="document-text-outline"
                size={16}
                color={colors.mutedForeground}
              />
            </TextField.InputStartContent>
          </TextField.Input>
        </TextField>
      </View>

      {/* Current Time Display */}
      <View className="rounded-lg border border-border bg-background p-4">
        <Text className="font-medium text-foreground text-sm">
          Measurement Time
        </Text>
        <Text className="text-muted-foreground">
          {timestamp.toLocaleString()}
        </Text>
      </View>

      <Button onPress={handleSave} disabled={isLoading} className="rounded-3xl">
        <Button.LabelContent>
          {isLoading ? "Logging Metric..." : "Log Health Metric"}
        </Button.LabelContent>
        <Button.EndContent>
          {isLoading ? <Spinner color={colors.background} /> : null}
        </Button.EndContent>
      </Button>
    </ScreenScrollView>
  );
}
