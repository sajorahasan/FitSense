import "../global.css";
// import "expo-dev-client";

import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { HeroUINativeProvider } from "heroui-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
import { Toaster } from "sonner-native";

import { AppThemeProvider, useAppTheme } from "@/contexts/app-theme-context";
import ConvexProvider from "@/providers/ConvexProvider";

SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  duration: 250,
  fade: true,
});

// Disable Reanimated strict mode warnings
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

/* ------------------------------ themed route ------------------------------ */
function ThemedLayout() {
  const { currentTheme } = useAppTheme();
  return (
    <HeroUINativeProvider
      config={{
        colorScheme: "system",
        theme: currentTheme,
        textProps: {
          allowFontScaling: false,
        },
      }}
    >
      <Slot />
    </HeroUINativeProvider>
  );
}
/* ------------------------------- root layout ------------------------------ */
export default function Layout() {
  return (
    <ConvexProvider>
      <GestureHandlerRootView className="flex-1">
        <KeyboardProvider>
          <AppThemeProvider>
            <ThemedLayout />
            <Toaster position="top-center" duration={3000} />
          </AppThemeProvider>
        </KeyboardProvider>
      </GestureHandlerRootView>
    </ConvexProvider>
  );
}
