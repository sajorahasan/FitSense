import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import {
  Button,
  Card,
  Chip,
  Spinner,
  TextField,
  useTheme,
} from "heroui-native";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { toast } from "sonner-native";
import { ScreenScrollView } from "@/components/screen-scroll-view";
import { api } from "~/backend/_generated/api";
import {
  dateStringToTimestamp,
  timestampToDateString,
} from "~/shared/utils/date";

export default function ProfileRoute() {
  const { colors } = useTheme();
  const user = useQuery(api.users.getCurrentUser);
  const emailStatus = useQuery(api.users.getUserEmailStatus);
  const updateProfile = useMutation(api.users.updateUserProfile);
  const sendEmailVerification = useMutation(api.users.sendEmailVerification);

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    height: "",
    weight: "",
    dateOfBirth: "",
    fitnessLevel: "",
    primaryGoal: "",
    activityLevel: "",
  });

  // Initialize form data when user data loads
  useState(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        height: user.height?.toString() || "",
        weight: user.weight?.toString() || "",
        dateOfBirth: user.dateOfBirth
          ? timestampToDateString(user.dateOfBirth)
          : "",
        fitnessLevel: user.fitnessLevel || "",
        primaryGoal: user.primaryGoal || "",
        activityLevel: user.activityLevel || "",
      });
    }
  });

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const updates: any = {
        name: formData.name,
        height: formData.height
          ? Number.parseFloat(formData.height)
          : undefined,
        weight: formData.weight
          ? Number.parseFloat(formData.weight)
          : undefined,
        fitnessLevel: formData.fitnessLevel || undefined,
        primaryGoal: formData.primaryGoal || undefined,
        activityLevel: formData.activityLevel || undefined,
      };

      if (formData.dateOfBirth.trim()) {
        try {
          updates.dateOfBirth = dateStringToTimestamp(formData.dateOfBirth);
        } catch (error) {
          toast.error(
            `Invalid date format. Please use DD/MM/YYYY format. ${error instanceof Error ? error.message : "Unknown error"}`,
          );
          setIsLoading(false);
          return;
        }
      }

      await updateProfile(updates);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(
        `Failed to update profile: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original values
    if (user) {
      setFormData({
        name: user.name || "",
        height: user.height?.toString() || "",
        weight: user.weight?.toString() || "",
        dateOfBirth: user.dateOfBirth
          ? timestampToDateString(user.dateOfBirth)
          : "",
        fitnessLevel: user.fitnessLevel || "",
        primaryGoal: user.primaryGoal || "",
        activityLevel: user.activityLevel || "",
      });
    }
    setIsEditing(false);
  };

  const handleSendEmailVerification = async () => {
    setIsVerifyingEmail(true);
    try {
      const result = await sendEmailVerification();
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(
        `Failed to send verification email: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setIsVerifyingEmail(false);
    }
  };

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Spinner size="lg" />
        <Text className="mt-4 text-muted-foreground">Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScreenScrollView contentContainerClassName="gap-6 p-6">
      {/* Header */}
      <View className="items-center gap-4">
        <View className="h-24 w-24 items-center justify-center rounded-full bg-primary">
          <Ionicons name="person" size={40} color={colors.background} />
        </View>
        <View className="items-center">
          <Text className="font-bold text-2xl text-foreground">
            {user.name}
          </Text>
        </View>
      </View>

      {/* Email Verification Status */}
      {emailStatus && (
        <Card className="p-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="font-semibold text-foreground">
                Email Status
              </Text>
              <Text className="text-muted-foreground text-sm">
                {emailStatus.email}
              </Text>
              <View className="mt-2 flex-row items-center gap-2">
                <Chip
                  color={emailStatus.emailVerified ? "success" : "warning"}
                  size="sm"
                >
                  {emailStatus.emailVerified ? "Verified" : "Unverified"}
                </Chip>
                {!emailStatus.emailVerified && (
                  <Ionicons name="warning" size={16} color={colors.warning} />
                )}
              </View>
            </View>
            {!emailStatus.emailVerified && (
              <Button
                size="sm"
                onPress={handleSendEmailVerification}
                className="ml-4"
                disabled={isVerifyingEmail}
              >
                <Button.LabelContent>
                  {isVerifyingEmail ? "Sending..." : "Verify Email"}
                </Button.LabelContent>
                <Button.EndContent>
                  {isVerifyingEmail ? (
                    <Spinner size="sm" />
                  ) : (
                    <Ionicons name="mail" size={16} color={colors.background} />
                  )}
                </Button.EndContent>
              </Button>
            )}
          </View>
        </Card>
      )}

      {/* Action Buttons */}
      <View className="flex-row gap-3">
        {!isEditing ? (
          <Button
            onPress={() => setIsEditing(true)}
            className="flex-1 rounded-full"
          >
            <Button.LabelContent>Edit Profile</Button.LabelContent>
            <Button.EndContent>
              <Ionicons name="pencil" size={18} color={colors.background} />
            </Button.EndContent>
          </Button>
        ) : (
          <>
            <Button
              onPress={handleSave}
              disabled={isLoading}
              className="flex-1 rounded-full"
            >
              <Button.LabelContent>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button.LabelContent>
              <Button.EndContent>
                {isLoading ? (
                  <Spinner size="sm" color={colors.background} />
                ) : (
                  <Ionicons
                    name="checkmark"
                    size={18}
                    color={colors.background}
                  />
                )}
              </Button.EndContent>
            </Button>
            <Button
              onPress={handleCancel}
              disabled={isLoading}
              variant="ghost"
              className="flex-1 rounded-full"
            >
              <Button.LabelContent>Cancel</Button.LabelContent>
            </Button>
          </>
        )}
      </View>

      {/* Profile Information */}
      <Card>
        <Card.Header>
          <Text className="font-semibold text-lg">Personal Information</Text>
        </Card.Header>
        <Card.Body>
          <View className="gap-4">
            {/* Name */}
            <View>
              <Text className="mb-2 font-medium text-muted-foreground text-sm">
                Name
              </Text>
              {isEditing ? (
                <TextField>
                  <TextField.Input
                    value={formData.name}
                    onChangeText={(text) =>
                      setFormData((prev) => ({ ...prev, name: text }))
                    }
                    placeholder="Enter your name"
                    className="rounded-xl"
                  />
                </TextField>
              ) : (
                <Text className="text-foreground">
                  {user.name || "Not set"}
                </Text>
              )}
            </View>

            {/* Height */}
            <View>
              <Text className="mb-2 font-medium text-muted-foreground text-sm">
                Height
              </Text>
              {isEditing ? (
                <TextField>
                  <TextField.Input
                    value={formData.height}
                    onChangeText={(text) =>
                      setFormData((prev) => ({ ...prev, height: text }))
                    }
                    placeholder="Height in cm"
                    keyboardType="numeric"
                    className="rounded-xl"
                  />
                </TextField>
              ) : (
                <Text className="text-foreground">
                  {user.height ? `${user.height} cm` : "Not set"}
                </Text>
              )}
            </View>

            {/* Weight */}
            <View>
              <Text className="mb-2 font-medium text-muted-foreground text-sm">
                Weight
              </Text>
              {isEditing ? (
                <TextField>
                  <TextField.Input
                    value={formData.weight}
                    onChangeText={(text) =>
                      setFormData((prev) => ({ ...prev, weight: text }))
                    }
                    placeholder="Weight in kg"
                    keyboardType="numeric"
                    className="rounded-xl"
                  />
                </TextField>
              ) : (
                <Text className="text-foreground">
                  {user.weight ? `${user.weight} kg` : "Not set"}
                </Text>
              )}
            </View>

            {/* Date of Birth */}
            <View>
              <Text className="mb-2 font-medium text-muted-foreground text-sm">
                Date of Birth
              </Text>
              {isEditing ? (
                <TextField>
                  <TextField.Input
                    value={formData.dateOfBirth}
                    onChangeText={(text) =>
                      setFormData((prev) => ({ ...prev, dateOfBirth: text }))
                    }
                    placeholder="DD/MM/YYYY"
                    className="rounded-xl"
                  />
                </TextField>
              ) : (
                <Text className="text-foreground">
                  {user.dateOfBirth
                    ? timestampToDateString(user.dateOfBirth)
                    : "Not set"}
                </Text>
              )}
            </View>
          </View>
        </Card.Body>
      </Card>

      {/* Fitness Profile */}
      <Card>
        <Card.Header>
          <Text className="font-semibold text-lg">Fitness Profile</Text>
        </Card.Header>
        <Card.Body>
          <View className="gap-4">
            {/* Fitness Level */}
            <View>
              <Text className="mb-2 font-medium text-muted-foreground text-sm">
                Fitness Level
              </Text>
              {isEditing ? (
                <View className="gap-2">
                  {["beginner", "intermediate", "advanced"].map((level) => (
                    <Pressable
                      key={level}
                      onPress={() =>
                        setFormData((prev) => ({
                          ...prev,
                          fitnessLevel: level,
                        }))
                      }
                      className={`rounded-xl border p-3 ${
                        formData.fitnessLevel === level
                          ? "border-primary bg-primary/10"
                          : "border-border bg-surface"
                      }`}
                    >
                      <Text className="text-foreground capitalize">
                        {level}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              ) : (
                <Chip
                  color={
                    user.fitnessLevel === "beginner"
                      ? "success"
                      : user.fitnessLevel === "intermediate"
                        ? "warning"
                        : "danger"
                  }
                  className="w-fit"
                >
                  {user.fitnessLevel
                    ? user.fitnessLevel.charAt(0).toUpperCase() +
                      user.fitnessLevel.slice(1)
                    : "Not set"}
                </Chip>
              )}
            </View>

            {/* Primary Goal */}
            <View>
              <Text className="mb-2 font-medium text-muted-foreground text-sm">
                Primary Goal
              </Text>
              {isEditing ? (
                <View className="gap-2">
                  {[
                    "weight_loss",
                    "muscle_gain",
                    "maintenance",
                    "endurance",
                    "health_management",
                  ].map((goal) => (
                    <Pressable
                      key={goal}
                      onPress={() =>
                        setFormData((prev) => ({ ...prev, primaryGoal: goal }))
                      }
                      className={`rounded-xl border p-3 ${
                        formData.primaryGoal === goal
                          ? "border-primary bg-primary/10"
                          : "border-border bg-surface"
                      }`}
                    >
                      <Text className="text-foreground capitalize">
                        {goal.replace("_", " ")}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              ) : (
                <Chip color="accent" className="w-fit">
                  {user.primaryGoal
                    ? user.primaryGoal
                        .replace("_", " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())
                    : "Not set"}
                </Chip>
              )}
            </View>

            {/* Activity Level */}
            <View>
              <Text className="mb-2 font-medium text-muted-foreground text-sm">
                Activity Level
              </Text>
              {isEditing ? (
                <View className="gap-2">
                  {[
                    "sedentary",
                    "lightly_active",
                    "moderately_active",
                    "very_active",
                    "extremely_active",
                  ].map((level) => (
                    <Pressable
                      key={level}
                      onPress={() =>
                        setFormData((prev) => ({
                          ...prev,
                          activityLevel: level,
                        }))
                      }
                      className={`rounded-xl border p-3 ${
                        formData.activityLevel === level
                          ? "border-primary bg-primary/10"
                          : "border-border bg-surface"
                      }`}
                    >
                      <Text className="text-foreground capitalize">
                        {level.replace("_", " ")}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              ) : (
                <Chip color="accent" className="w-fit">
                  {user.activityLevel
                    ? user.activityLevel
                        .replace("_", " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())
                    : "Not set"}
                </Chip>
              )}
            </View>
          </View>
        </Card.Body>
      </Card>

      {/* Account Information */}
      <Card>
        <Card.Header>
          <Text className="font-semibold text-lg">Account Information</Text>
        </Card.Header>
        <Card.Body>
          <View className="gap-4">
            <View>
              <Text className="mb-2 font-medium text-muted-foreground text-sm">
                Email
              </Text>
              <Text className="text-foreground">
                {emailStatus?.email || "No email"}
              </Text>
            </View>
            <View>
              <Text className="mb-2 font-medium text-muted-foreground text-sm">
                Member Since
              </Text>
              <Text className="text-foreground">
                {new Date(user._creationTime).toDateString()}
              </Text>
            </View>
            <View>
              <Text className="mb-2 font-medium text-muted-foreground text-sm">
                Onboarding Status
              </Text>
              <Chip
                color={user.onboardingCompleted ? "success" : "warning"}
                className="w-fit"
              >
                {user.onboardingCompleted ? "Completed" : "Incomplete"}
              </Chip>
            </View>
          </View>
        </Card.Body>
      </Card>
    </ScreenScrollView>
  );
}
