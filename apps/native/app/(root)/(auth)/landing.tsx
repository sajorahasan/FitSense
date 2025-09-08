import Ionicons from "@expo/vector-icons/build/Ionicons";
import { Link } from "expo-router";
import { Button, useTheme } from "heroui-native";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// import { useAppleSignIn } from "@/lib/better-auth/oauth/appleHandler";
// import { useGoogleSignIn } from "@/lib/better-auth/oauth/googleHandler";

export default function Landing() {
	const { colors } = useTheme();
	// const { gSignIn } = useGoogleSignIn();
	// const { aSignIn } = useAppleSignIn();
	return (
		<SafeAreaView className="flex-1 gap-4 px-8">
			<View className="flex-1 justify-end">
				<Text className="font-extrabold text-6xl text-foreground">
					Convexpo
				</Text>
				<Text className="text-muted-foreground text-xl">
					Convex + Better Auth + Expo + Heroui = 🚀
				</Text>
			</View>

			<View className="w-full flex-row gap-4">
				{/* google */}
				<Button
					className="flex-1 overflow-hidden rounded-full"
					size="lg"
					variant="secondary"
					onPress={() => {
						console.warn("Google Setup Needed");
						// gSignIn();
					}}
				>
					<Button.StartContent>
						<Ionicons
							name="logo-google"
							size={20}
							color={colors.defaultForeground}
						/>
					</Button.StartContent>
					<Button.LabelContent>Google</Button.LabelContent>
				</Button>
				{/* apple */}
				<Button
					className="flex-1 overflow-hidden rounded-full"
					size="lg"
					variant="secondary"
					onPress={() => {
						console.warn("Apple Setup Needed");
						// aSignIn();
					}}
				>
					<Button.StartContent>
						<Ionicons
							name="logo-apple"
							size={20}
							color={colors.defaultForeground}
						/>
					</Button.StartContent>
					<Button.LabelContent>Apple</Button.LabelContent>
				</Button>
			</View>
			{/* email + password route */}
			<Link href="/(root)/(auth)/email/signin" asChild>
				<Button className="w-full rounded-full" size="lg">
					<Button.LabelContent>Email</Button.LabelContent>
				</Button>
			</Link>
		</SafeAreaView>
	);
}
