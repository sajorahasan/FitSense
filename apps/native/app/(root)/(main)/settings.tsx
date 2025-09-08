import { Ionicons } from "@expo/vector-icons";
import { Button, Spinner, useTheme } from "heroui-native";
import { useState } from "react";
import { Alert, ScrollView } from "react-native";
import { authClient } from "@/lib/better-auth/auth-client";

export default function SettingsRoute() {
	const { colors } = useTheme();
	const [isSigningOut, setIsSigningOut] = useState(false);
	const [isDeletingUser, setIsDeletingUser] = useState(false);
	// sign out
	const handleSignOut = async () => {
		const { error, data } = await authClient.signOut(
			{},
			{
				onRequest: () => {
					setIsSigningOut(true);
				},
				onSuccess: () => {
					setIsSigningOut(false);
					console.log("Sign out successful");
				},
				onError: (ctx) => {
					console.error(ctx.error);
					Alert.alert("Error", ctx.error.message || "Failed to sign out");
				},
			},
		);

		console.log(data, error);
	};
	// delete user
	const handleDeleteUser = async () => {
		const { error, data } = await authClient.deleteUser(
			{},
			{
				onRequest: () => {
					setIsDeletingUser(true);
				},
				onSuccess: () => {
					console.log("User deleted successfully");
					setIsDeletingUser(false);
					// The auth system will automatically handle the redirect
				},
				onError: (ctx) => {
					setIsDeletingUser(false);
					console.error(ctx.error);
					Alert.alert("Error", ctx.error.message || "Failed to delete user");
				},
			},
		);

		console.log(data, error);
	};

	return (
		<ScrollView
			automaticallyAdjustsScrollIndicatorInsets
			contentInsetAdjustmentBehavior="always"
			contentContainerClassName="px-4 py-4 gap-4"
		>
			{/*Sign Out*/}
			<Button
				className="rounded-full"
				variant="tertiary"
				disabled={isSigningOut}
				onPress={() => {
					Alert.alert("Sign Out", "Are you sure you want to sign out", [
						{
							text: "Cancel",
							style: "cancel",
						},
						{
							text: "Sign Out",
							onPress: async () => {
								await handleSignOut();
							},
						},
					]);
				}}
			>
				<Button.StartContent>
					<Ionicons
						name="log-out-outline"
						size={18}
						color={colors.foreground}
					/>
				</Button.StartContent>
				<Button.LabelContent>
					{isSigningOut ? "Signing Out..." : "Sign Out"}
				</Button.LabelContent>
				<Button.EndContent>
					{isSigningOut ? <Spinner color={colors.foreground} /> : null}
				</Button.EndContent>
			</Button>
			{/* Delete User*/}
			<Button
				variant="tertiary"
				className="rounded-full"
				disabled={isDeletingUser}
				onPress={async () => {
					Alert.alert(
						"Delete User",
						"Are you sure you want to delete your account?",
						[
							{
								text: "Cancel",
								style: "cancel",
							},
							{
								text: "Delete",
								onPress: async () => {
									await handleDeleteUser();
								},
							},
						],
					);
				}}
			>
				<Button.StartContent>
					<Ionicons name="trash-outline" size={18} color={colors.foreground} />
				</Button.StartContent>
				<Button.LabelContent>
					{isDeletingUser ? "Deleting..." : "Delete User"}
				</Button.LabelContent>
				<Button.EndContent>
					{isDeletingUser ? <Spinner color={colors.foreground} /> : null}
				</Button.EndContent>
			</Button>
		</ScrollView>
	);
}
