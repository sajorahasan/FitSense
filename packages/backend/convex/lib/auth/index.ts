import { expo } from "@better-auth/expo";
import { convexAdapter } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { requireEnv, requireMutationCtx } from "@convex-dev/better-auth/utils";
import { betterAuth } from "better-auth";
import type { GenericCtx } from "../../_generated/server";
import { betterAuthComponent } from "../../auth";
import { sendResetPassword } from "../resend/emails";

export const createAuth = (ctx: GenericCtx) =>
	betterAuth({
		trustedOrigins: [
			"https://appleid.apple.com",
			// requireEnv("SITE_URL"), // localhost:3000 next js?
			// requireEnv("EXPO_WEB_URL"), // http://localhost:8081  // expo web
			requireEnv("EXPO_MOBILE_URL"), // on dev set exp://xxx.xxx.x.xx:xxxx // expo mobile url
		],
		database: convexAdapter(ctx, betterAuthComponent),
		emailAndPassword: {
			enabled: true,
			requireEmailVerification: false,
			sendResetPassword: async ({ user, url }) => {
				await sendResetPassword(requireMutationCtx(ctx), {
					to: user.email,
					url,
				});
			},
		},
		user: {
			deleteUser: {
				enabled: true,
			},
		},

		/**
		 * social provider docs will be added later
		 */
		// socialProviders: {
		// 	apple: {
		// 		clientId: requireEnv("APPLE_CLIENT_ID"),
		// 		clientSecret: requireEnv("APPLE_CLIENT_SECRET"),
		// 		appBundleIdentifier: requireEnv("APPLE_APP_BUNDLE_IDENTIFIER"),
		// 	},
		// 	google: {
		// 		clientId: requireEnv("GOOGLE_CLIENT_ID"),
		// 		clientSecret: requireEnv("GOOGLE_CLIENT_SECRET"),
		// 	},
		// },

		plugins: [expo(), convex()],
	});
