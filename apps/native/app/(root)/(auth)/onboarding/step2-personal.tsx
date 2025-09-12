import Ionicons from "@expo/vector-icons/build/Ionicons";
import { useMutation } from "convex/react";
import { Link, router } from "expo-router";
import { Button, TextField, useTheme } from "heroui-native";
import { useState } from "react";
import { View } from "react-native";
import { toast } from "sonner-native";
import FormHeader from "@/components/form";
import { ScreenScrollView } from "@/components/screen-scroll-view";
import { api } from "~/backend/_generated/api";
import {
  dateStringToTimestamp,
  timestampToDateString,
} from "~/shared/utils/date";
import { useOnboardingUser } from "./_layout";

export default function OnboardingPersonal() {
  const { colors } = useTheme();
  const user = useOnboardingUser();

  const [height, setHeight] = useState(user?.height?.toString() || "");
  const [weight, setWeight] = useState(user?.weight?.toString() || "");
  const [dateOfBirth, setDateOfBirth] = useState(() => {
    if (user?.dateOfBirth) {
      try {
        // If dateOfBirth is a timestamp, convert it to DD/MM/YYYY format
        if (typeof user.dateOfBirth === "number") {
          return timestampToDateString(user.dateOfBirth);
        }
        // If it's an ISO string, convert it to DD/MM/YYYY format
        if (typeof user.dateOfBirth === "string") {
          return timestampToDateString(new Date(user.dateOfBirth).getTime());
        }
      } catch (error) {
        console.warn("Failed to parse existing date of birth:", error);
      }
    }
    return "";
  });
  const [isLoading, setIsLoading] = useState(false);

  const updateProfile = useMutation(api.users.updateUserProfile);

  const handleContinue = async () => {
    if (!height.trim() || !weight.trim()) {
      toast.error("Please enter your height and weight to continue.");
      return;
    }

    setIsLoading(true);
    try {
      const updates: any = {
        height: Number.parseFloat(height),
        weight: Number.parseFloat(weight),
        onboardingStep: 2,
      };

      if (dateOfBirth.trim()) {
        try {
          // Convert DD/MM/YYYY format to timestamp
          updates.dateOfBirth = dateStringToTimestamp(dateOfBirth);
        } catch (error) {
          toast.error(
            `Invalid date format. Please use DD/MM/YYYY format. ${error instanceof Error ? error.message : "Unknown error"}`,
          );
          setIsLoading(false);
          return;
        }
      }

      await updateProfile(updates);
      router.push("/(root)/(auth)/onboarding/step3-fitness");
    } catch (error) {
      toast.error(
        `Failed to save your information. Please try again. ${error instanceof Error ? error?.message : "Unknown error"}`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenScrollView contentContainerClassName="gap-4 px-6">
      <FormHeader
        title="Tell us about yourself"
        description="This helps us personalize your experience"
        containerClassName="mt-12"
      />

      {/* Progress indicator */}
      <View className="mb-6 flex-row items-center justify-center gap-2">
        <View className="h-2 w-8 rounded-full bg-primary" />
        <View className="h-2 w-8 rounded-full bg-primary" />
        <View className="h-2 w-8 rounded-full bg-muted" />
        <View className="h-2 w-8 rounded-full bg-muted" />
      </View>

      {/* Height */}
      <TextField isRequired>
        <TextField.Input
          className="rounded-3xl"
          placeholder="Height (cm)"
          keyboardType="numeric"
          value={height}
          onChangeText={setHeight}
        >
          <TextField.InputStartContent className="pointer-events-none">
            <Ionicons name="body" size={16} color={colors.mutedForeground} />
          </TextField.InputStartContent>
        </TextField.Input>
      </TextField>

      {/* Weight */}
      <TextField isRequired>
        <TextField.Input
          className="rounded-3xl"
          placeholder="Weight (kg)"
          keyboardType="numeric"
          value={weight}
          onChangeText={setWeight}
        >
          <TextField.InputStartContent className="pointer-events-none">
            <Ionicons name="scale" size={16} color={colors.mutedForeground} />
          </TextField.InputStartContent>
        </TextField.Input>
      </TextField>

      {/* Date of Birth (optional) */}
      <TextField>
        <TextField.Input
          className="rounded-3xl"
          placeholder="Date of Birth (DD/MM/YYYY)"
          value={dateOfBirth}
          onChangeText={setDateOfBirth}
        >
          <TextField.InputStartContent className="pointer-events-none">
            <Ionicons
              name="calendar-outline"
              size={16}
              color={colors.mutedForeground}
            />
          </TextField.InputStartContent>
        </TextField.Input>
      </TextField>

      {/* Navigation buttons */}
      <View className="mt-6 gap-3">
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

        <Link href="/(root)/(auth)/onboarding/step3-fitness" asChild>
          <Button variant="ghost" disabled={isLoading} className="rounded-3xl">
            <Button.LabelContent>Skip for now</Button.LabelContent>
          </Button>
        </Link>
      </View>
    </ScreenScrollView>
  );
}
