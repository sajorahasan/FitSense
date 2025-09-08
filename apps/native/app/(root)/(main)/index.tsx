import { Ionicons } from "@expo/vector-icons";
import { api } from "@my-better-t-app/backend/convex/_generated/api";
import { useQuery } from "convex/react";
import { Link } from "expo-router";
import { Button, useTheme } from "heroui-native";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// import {api} form
export default function HomeRoute() {
	const insets = useSafeAreaInsets();
	const { colors } = useTheme();
	const userData = useQuery(api.users.getAllUserDataQuery);
	if (!userData) return null;
	return (
		<View
			className="flex-1 gap-4 px-8"
			style={{
				paddingTop: insets.top,
				paddingBottom: insets.bottom,
			}}
		>
			<View className="flex-1 justify-end">
				<Text className="font-extrabold text-6xl text-foreground">
					Welcome {userData.userMetaData.name}
				</Text>
				<Text className="text-muted-foreground text-xl">
					{userData.userMetaData.email}
				</Text>
				<Text className="text-muted-foreground text-xl">
					on {new Date(userData.userMetaData.createdAt).toDateString()}
				</Text>
			</View>
			<Link href={"/(root)/(main)/settings"} asChild>
				<Button
					className="rounded-full"
					size={"lg"}
					onPress={() => console.log("Button pressed")}
				>
					<Button.LabelContent>Go to settings</Button.LabelContent>
					<Button.EndContent>
						<Ionicons
							name="chevron-forward"
							size={18}
							color={colors.background}
						/>
					</Button.EndContent>
				</Button>
			</Link>
		</View>
	);
}
