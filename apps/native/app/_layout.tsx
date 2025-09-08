import { Slot } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "../global.css";
import { HeroUINativeProvider } from "heroui-native";
import { AppThemeProvider, useAppTheme } from "@/contexts/app-theme-context";
import ConvexProvider from "@/providers/ConvexProvider";

/* ------------------------------ themed route ------------------------------ */
function ThemedLayout() {
	const { currentTheme } = useAppTheme();
	return (
		<HeroUINativeProvider
			config={{
				colorScheme: "dark",
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
				<AppThemeProvider>
					<ThemedLayout />
				</AppThemeProvider>
			</GestureHandlerRootView>
		</ConvexProvider>
	);
}
