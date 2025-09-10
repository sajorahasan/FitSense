import Ionicons from "@expo/vector-icons/build/Ionicons";
import { useMutation } from "convex/react";
import { Link, router } from "expo-router";
import { Button, TextField, useTheme } from "heroui-native";
import { useState } from "react";
import { View } from "react-native";
import { toast } from "sonner-native";
import FormHeader, { FormContainer } from "@/components/form";
import { api } from "~/backend/_generated/api";

export default function OnboardingPersonal() {
  const { colors } = useTheme();
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
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
        updates.dateOfBirth = new Date(dateOfBirth).getTime();
      }

      await updateProfile(updates);
      router.push("/(root)/(auth)/onboarding/step3-fitness");
    } catch (error) {
      toast.error(`Failed to save your information. Please try again. ${error instanceof Error ? error?.message : "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormContainer>
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
          placeholder="Date of Birth (optional)"
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
    </FormContainer>
  );
}
