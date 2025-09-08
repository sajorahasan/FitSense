import Ionicons from "@expo/vector-icons/build/Ionicons";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { Button, Spinner, TextField, useTheme } from "heroui-native";
import { useState } from "react";
import { Alert, Text, View } from "react-native";
import FormHeader, { FormContainer } from "@/components/form";
import { authClient } from "@/lib/better-auth/auth-client";

export default function ResetPasswordRoute() {
  const { colors } = useTheme();
  const router = useRouter();
  /**
   * We are using proper routing to navigate to the reset password
   * we recieve the token from the email,
   *
   * check docs on the ERROR TYPE
   * https://www.better-auth.com/docs/authentication/email-password#request-password-reset
   *
   */
  const { token, error } = useLocalSearchParams<{
    token: string;
    error?: string;
  }>();
  /* ---------------------------------- state --------------------------------- */
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  /* ------------------------- handle reset password ------------------------- */
  const handleResetPassword = async () => {
    /**
     * FEAT: Add your own form validation validation here
     * i've been using tanstack form for react native with zod
     *
     * but this is just a base for you to get started
     */
    if (!password) {
      Alert.alert("Error", "Please enter your new password");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords don't match");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }
    const { error, data } = await authClient.resetPassword(
      {
        newPassword: password,
        token: token,
      },
      {
        onRequest: () => {
          setIsLoading(true);
        },

        onError: (ctx) => {
          setIsLoading(false);
          Alert.alert("Error", ctx.error.message || "Failed to reset password");
        },
        onSuccess: () => {
          setIsLoading(false);
          console.log("success!");
          Alert.alert("Success", "Password reset successfully");
          /**
           * i have a thought to better the ui
           *
           * you could route to the reset password page but since there is no token
           * you can say go check your email with some sort of animation
           * then since you're already on that page wait for the token to be sent
           * then route to the reset password page
           */
          router.back();
        },
      },
    );
    console.log(data, error);
  };
  /* --------------------------------- invalid token --------------------------------- */
  if (error === "INVALID_TOKEN" || !token) {
    return (
      <View className="flex-1 bg-background">
        <View className="flex-1 justify-center px-6">
          <View className="mb-8 text-center">
            <Text className="mb-4 font-bold text-2xl text-foreground">
              Invalid Link
            </Text>
            <Text className="text-muted-foreground">
              This reset link has already been used or is invalid
            </Text>
          </View>
          <Link href="/(root)/(auth)/email/signin" asChild>
            <Button className="rounded-3xl">
              <Button.StartContent>
                <Ionicons
                  name="arrow-back-outline"
                  size={16}
                  color={colors.defaultForeground}
                />
              </Button.StartContent>
              <Button.LabelContent>Back to Sign In</Button.LabelContent>
            </Button>
          </Link>
        </View>
      </View>
    );
  }
  /* --------------------------------- return --------------------------------- */
  return (
    <FormContainer>
      {/* header */}
      <FormHeader
        title="Reset Password"
        description="Enter your new password to complete the reset"
      />
      {/* new password */}
      <TextField isRequired>
        <TextField.Input
          className="rounded-3xl"
          placeholder="Enter your new password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        >
          <TextField.InputStartContent className="pointer-events-none">
            <Ionicons
              name="lock-closed-outline"
              size={16}
              color={colors.mutedForeground}
            />
          </TextField.InputStartContent>
          <TextField.InputEndContent className="pointer-events-none">
            <Ionicons
              name="eye-outline"
              size={16}
              color={colors.mutedForeground}
            />
          </TextField.InputEndContent>
        </TextField.Input>
      </TextField>
      {/* confirm password */}
      <TextField isRequired>
        <TextField.Input
          className="rounded-3xl"
          placeholder="Confirm your new password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        >
          <TextField.InputStartContent className="pointer-events-none">
            <Ionicons
              name="lock-closed-outline"
              size={16}
              color={colors.mutedForeground}
            />
          </TextField.InputStartContent>
          <TextField.InputEndContent className="pointer-events-none">
            <Ionicons
              name="checkmark-outline"
              size={16}
              color={colors.mutedForeground}
            />
          </TextField.InputEndContent>
        </TextField.Input>
      </TextField>
      {/* submit button */}
      <Button
        onPress={handleResetPassword}
        disabled={isLoading}
        className="rounded-3xl"
      >
        <Button.LabelContent>
          {isLoading ? "Resetting..." : "Reset Password"}
        </Button.LabelContent>
        <Button.EndContent>
          {isLoading ? <Spinner color={colors.background} /> : null}
        </Button.EndContent>
      </Button>
    </FormContainer>
  );
}
