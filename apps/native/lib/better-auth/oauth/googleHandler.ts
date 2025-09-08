import { useState } from "react";
import { Alert } from "react-native";
import { authClient } from "../auth-client";

/* ------------------------------ core handler ------------------------------ */
export const handleGoogleSignIn = async () => {
	try {
		// Use auth client to sign in with Google
		const { data, error } = await authClient.signIn.social({
			provider: "google",
		});

		if (error) {
			throw error;
		}

		return { success: true, data };
	} catch (error) {
		console.log("Google Sign In Error", error);
		return {
			success: false,
			error:
				error instanceof Error ? error : new Error("Unknown error occurred"),
		};
	}
};

/* ---------------------------------- hook ---------------------------------- */
export interface UseGoogleSignInOptions {
	onSuccess?: (data: unknown) => void;
	onError?: (error: Error) => void;
	showAlert?: boolean;
}

export const useGoogleSignIn = (options: UseGoogleSignInOptions = {}) => {
	const { onSuccess, onError, showAlert = true } = options;
	const [submitting, setSubmitting] = useState(false);

	const gSignIn = async () => {
		if (submitting) return;

		setSubmitting(true);
		try {
			const result = await handleGoogleSignIn();

			if (result.success) {
				onSuccess?.(result.data);
				return result;
			}
			// Handle error
			if (showAlert && result.error) {
				Alert.alert("Google Sign In Error", result.error.message);
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
		gSignIn,
		submitting,
	};
};
