import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { ConvexReactClient } from "convex/react";
import type React from "react";
import { authClient } from "@/lib/better-auth/auth-client";

if (!process.env.EXPO_PUBLIC_CONVEX_URL) {
	throw new Error("EXPO_PUBLIC_CONVEX_URL is not set");
}

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL);

export default function ConvexProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<ConvexBetterAuthProvider client={convex} authClient={authClient}>
			{children}
		</ConvexBetterAuthProvider>
	);
}
