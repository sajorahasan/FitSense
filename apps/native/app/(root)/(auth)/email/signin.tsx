import Ionicons from "@expo/vector-icons/build/Ionicons";
import { Link } from "expo-router";
import { Button, Spinner, TextField, useTheme } from "heroui-native";
import { useState } from "react";
import { Alert } from "react-native";
import FormHeader, { FormContainer } from "@/components/form";
import { authClient } from "@/lib/better-auth/auth-client";

export default function SignInRoute() {
	const { colors } = useTheme();
	/* ---------------------------------- state --------------------------------- */
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	/* ----------------------------- handle sign in ----------------------------- */
	const handleSignIn = async () => {
		/**
		 * FEAT: Add your own form validation validation here
		 * i've been using tanstack form for react native with zod
		 *
		 * but this is just a base for you to get started
		 */
		if (!email.trim()) {
			Alert.alert("Error", "Please enter your email");
			return;
		}
		if (!password) {
			Alert.alert("Error", "Please enter your password");
			return;
		}

		const { data, error } = await authClient.signIn.email(
			{
				email: email.trim(),
				password: password,
				rememberMe: true,
			},
			{
				onRequest: () => {
					setIsLoading(true);
				},

				onError: (ctx) => {
					setIsLoading(false);
					Alert.alert("Error", ctx.error.message || "Failed to sign in");
				},
				onSuccess: () => {
					setIsLoading(false);
					console.log("success!");
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
				title="Login"
				description="Enter your email and password to login"
			/>
			{/* email text-field*/}
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
			{/* password text-field */}
			<TextField isRequired>
				<TextField.Input
					className="rounded-3xl"
					placeholder="Enter your password"
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
			{/* submit button */}
			<Button
				onPress={handleSignIn}
				disabled={isLoading}
				className="rounded-3xl"
			>
				<Button.LabelContent>
					{isLoading ? "Signing In..." : "Sign In"}
				</Button.LabelContent>
				<Button.EndContent>
					{isLoading ? <Spinner color={colors.background} /> : null}
				</Button.EndContent>
			</Button>
			{/* forgot password route */}
			<Link href="/(root)/(auth)/email/(reset)/request-password-reset" asChild>
				<Button variant="tertiary" size="sm" className="self-start rounded-3xl">
					<Button.StartContent>
						<Ionicons
							name="lock-closed-outline"
							size={14}
							color={colors.defaultForeground}
						/>
					</Button.StartContent>
					<Button.LabelContent>Forgot Password?</Button.LabelContent>
					<Button.EndContent>
						<Ionicons
							name="chevron-forward"
							size={18}
							color={colors.defaultForeground}
						/>
					</Button.EndContent>
				</Button>
			</Link>
			{/* sign up route */}
			<Link href="/(root)/(auth)/email/signup" asChild>
				<Button variant="tertiary" size="sm" className="self-start rounded-3xl">
					<Button.StartContent>
						<Ionicons
							name="person-add-outline"
							size={14}
							color={colors.defaultForeground}
						/>
					</Button.StartContent>
					<Button.LabelContent>Sign Up</Button.LabelContent>
					<Button.EndContent>
						<Ionicons
							name="chevron-forward"
							size={18}
							color={colors.defaultForeground}
						/>
					</Button.EndContent>
				</Button>
			</Link>
		</FormContainer>
	);
}
