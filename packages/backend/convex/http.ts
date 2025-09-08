import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { betterAuthComponent } from "./auth";
import { createAuth } from "./lib/auth";
import { resendHandler } from "./lib/resend/sendEmails";

const http = httpRouter();
/**
 * AUTH
 * Client side frameworks need CORS enabled to work properly.
 */
betterAuthComponent.registerRoutes(http, createAuth, { cors: true });
/**
 * RESEND
 * Route for handling resend webhook events.
 * ONLY USED IN PRODUCTION
 */
http.route({
	path: "/resend-webhook",
	method: "POST",
	handler: httpAction(async (ctx, req) => {
		return await resendHandler.handleResendEventWebhook(ctx, req);
	}),
});

export default http;
