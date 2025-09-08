import * as AppleAuthentication from "expo-apple-authentication";
import { useState } from "react";
import { Alert } from "react-native";
import { authClient } from "../auth-client";

/* ------------------------------ core handler ------------------------------ */
export const handleAppleSignIn = async () => {
	try {
		// Request credential from Apple
		const credential = await AppleAuthentication.signInAsync({
			requestedScopes: [
				AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
				AppleAuthentication.AppleAuthenticationScope.EMAIL,
			],
		});

		if (!credential.identityToken) {
			throw new Error("Failed to get Apple identity token");
		}

		// Use auth client to sign in with apple
		const { data, error } = await authClient.signIn.social({
			provider: "apple",
			idToken: {
				token: credential.identityToken,
			},
		});

		if (error) {
			throw error;
		}

		return { success: true, data };
	} catch (error) {
		console.log("Apple Sign In Error", error);
		return {
			success: false,
			error:
				error instanceof Error ? error : new Error("Unknown error occurred"),
		};
	}
};

/* ---------------------------------- hook ---------------------------------- */
export interface UseAppleSignInOptions {
	onSuccess?: (data: unknown) => void;
	onError?: (error: Error) => void;
	showAlert?: boolean;
}

export const useAppleSignIn = (options: UseAppleSignInOptions = {}) => {
	const { onSuccess, onError, showAlert = true } = options;
	const [submitting, setSubmitting] = useState(false);

	const aSignIn = async () => {
		if (submitting) return;

		setSubmitting(true);
		try {
			const result = await handleAppleSignIn();

			if (result.success) {
				onSuccess?.(result.data);
				return result;
			}
			// Handle error
			if (showAlert && result.error) {
				Alert.alert("Apple Sign In Error", result.error.message);
			}
			if (result.error) {
				onError?.(result.error);
			}
			return result;
		} finally {
			setSubmitting(false);
		}
	};

	return {
		aSignIn,
		submitting,
	};
};
