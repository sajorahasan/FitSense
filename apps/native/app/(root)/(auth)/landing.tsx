import Ionicons from "@expo/vector-icons/build/Ionicons";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { Button, useTheme } from "heroui-native";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGoogleSignIn } from "@/lib/better-auth/oauth/googleHandler";

export default function Landing() {
  const { colors } = useTheme();
  const { gSignIn } = useGoogleSignIn();

  return (
    <SafeAreaView className="flex-1">
      {/* Background gradient overlay */}
      <View className="absolute inset-0" />

      {/* Main content container */}
      <View className="flex-1 px-8 pt-16">
        {/* Hero section */}
        <View className="flex-1 items-center justify-center">
          {/* App logo */}
          <Image
            source={require("../../../assets/app-logo.png")}
            style={{ width: "40%", height: "40%" }}
            contentFit="cover"
          />

          {/* App title and description */}
          <View className="mb-16 items-center">
            <Text
              className="mb-4 font-black text-7xl text-foreground tracking-tight"
              accessibilityRole="header"
            >
              FitSense
            </Text>
            <Text
              className="max-w-sm text-center text-muted-foreground text-xl leading-7"
              accessibilityRole="text"
            >
              Your AI-Powered Fitness Companion for a Healthier Tomorrow
            </Text>
          </View>
        </View>

        {/* Action buttons section */}
        <View className="gap-4 pb-8">
          {/* Primary CTA - Email */}
          <Link href="/(root)/(auth)/email/signin" asChild>
            <Button
              className="h-14 w-full rounded-2xl"
              size="lg"
              accessibilityLabel="Continue with Email"
              accessibilityHint="Navigate to email sign in page"
            >
              <Button.LabelContent className="font-semibold text-lg">
                Continue with Email
              </Button.LabelContent>
            </Button>
          </Link>

          {/* Secondary CTA - Google */}

          <Button
            className="h-14 w-full rounded-2xl border-2"
            size="lg"
            // variant="secondary"
            accessibilityLabel="Continue with Google"
            accessibilityHint="Sign in using your Google account"
            onPress={() => {
              console.warn("Google Setup Needed");
              gSignIn();
            }}
          >
            <Button.StartContent>
              <Ionicons
                name="logo-google"
                size={24}
                color={colors.accentForeground}
              />
            </Button.StartContent>
            <Button.LabelContent className="font-medium text-lg">
              Continue with Google
            </Button.LabelContent>
          </Button>

          {/* Divider */}
          <View className="my-6 flex-row items-center">
            <View className="h-px flex-1 bg-border" />
            <Text className="px-4 text-muted-foreground text-sm">or</Text>
            <View className="h-px flex-1 bg-border" />
          </View>

          {/* Test onboarding link */}
          <Link href="/(root)/(auth)/onboarding/step1-welcome" asChild>
            <Button
              variant="secondary"
              className="h-12 w-full rounded-2xl"
              size="lg"
              accessibilityLabel="Try Demo Onboarding"
              accessibilityHint="Experience the app onboarding flow"
            >
              <Button.LabelContent className="text-muted-foreground">
                Try Demo Onboarding
              </Button.LabelContent>
            </Button>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}
