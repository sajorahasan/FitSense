import { Stack } from "expo-router";
import { useNavigationOptions } from "@/hooks/useNavigationOptions";

export default function MainLayout() {
	const { standard } = useNavigationOptions();
	return (
		<Stack>
			<Stack.Screen
				name="index"
				options={{
					title: "Home",
					headerTitle: "",
					headerBackTitle: "Home",
					...standard,
				}}
			/>
			<Stack.Screen
				name="settings"
				options={{
					title: "Settings",
					headerLargeTitle: true,
					...standard,
				}}
			/>
		</Stack>
	);
}
