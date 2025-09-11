import Ionicons from "@expo/vector-icons/build/Ionicons";
import { Link } from "expo-router";
import { Button, Spinner, TextField, useTheme } from "heroui-native";
import { useState } from "react";
import { Text } from "react-native";
import { toast } from "sonner-native";
import FormHeader, { FormContainer } from "@/components/form";
import PasswordField from "@/components/password-field";
import { authClient } from "@/lib/better-auth/auth-client";

export default function SignUpRoute() {
  const { colors } = useTheme();

  /* ---------------------------------- state --------------------------------- */
  const [name, setName] = useState(__DEV__ ? "Hasan" : "");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(__DEV__ ? "#Reset123" : "");
  const [confirmPassword, setConfirmPassword] = useState(
    __DEV__ ? "#Reset123" : "",
  );
  const [isLoading, setIsLoading] = useState(false);
  /* ------------------------------ handle signup ----------------------------- */
  const handleSignUp = async () => {
    /**
     * FEAT: Add your own form validation validation here
     * i've been using tanstack form for react native with zod
     *
     * but this is just a base for you to get started
     */
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    const { data, error } = await authClient.signUp.email(
      {
        name: name.trim(),
        email: email.trim(),
        password: password,
      },
      {
        onRequest: () => {
          setIsLoading(true);
        },

        onError: (ctx) => {
          setIsLoading(false);
          toast.error(ctx.error.message || "Failed to sign up");
        },
        onSuccess: (ctx) => {
          setIsLoading(false);
          console.log("success!", ctx);
          toast.success(
            `Welcome to FitSense, ${name}! Your account is ready. Let's complete your onboarding to start your fitness journey.`,
          );
        },
      },
    );
    console.log(data, error);
  };
  /* --------------------------------- return --------------------------------- */
  return (
    <FormContainer>
      {/* header */}
      <FormHeader
        title="Sign Up"
        description="Create your account to get started"
      />
      {/* name */}
      <TextField isRequired>
        <TextField.Input
          className="rounded-3xl"
          placeholder="Enter your full name"
          autoCapitalize="words"
          value={name}
          onChangeText={setName}
        >
          <TextField.InputStartContent className="pointer-events-none">
            <Ionicons
              name="person-outline"
              size={16}
              color={colors.mutedForeground}
            />
          </TextField.InputStartContent>
        </TextField.Input>
      </TextField>
      {/* email */}
      <TextField isRequired>
        <TextField.Input
          className="rounded-3xl"
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        >
          <TextField.InputStartContent className="pointer-events-none">
            <Ionicons
              name="mail-outline"
              size={16}
              color={colors.mutedForeground}
            />
          </TextField.InputStartContent>
        </TextField.Input>
      </TextField>
      {/* password */}
      <PasswordField
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
        isRequired
      />
      {/* confirm password */}
      <PasswordField
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Confirm your password"
        isRequired
      />
      {/* submit button */}
      <Button
        onPress={handleSignUp}
        disabled={isLoading}
        className="rounded-3xl"
      >
        <Button.LabelContent>
          {isLoading ? "Creating Account..." : "Sign Up"}
        </Button.LabelContent>
        <Button.EndContent>
          {isLoading ? <Spinner color={colors.background} /> : null}
        </Button.EndContent>
      </Button>
      <Text className="px-14 text-center text-muted-foreground text-sm">
        by continuing you agree to our{" "}
        <Link href="http://convex.dev" className="text-primary underline">
          terms of service
        </Link>{" "}
        and{" "}
        <Link href="http://convex.dev" className="text-primary underline">
          privacy policy
        </Link>
      </Text>
    </FormContainer>
  );
}
