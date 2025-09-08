import { ConvexError } from "convex/values";
import type { Id } from "../_generated/dataModel";
import type { QueryCtx } from "../_generated/server";
import { betterAuthComponent } from "../auth";

/* ------------------------------ user metadata ----------------------------- */
export async function getAuthUserDataOrThrow(ctx: QueryCtx) {
	const userMetadata = await betterAuthComponent.getAuthUser(ctx);
	if (!userMetadata) {
		throw new ConvexError({
			code: "NOT_AUTHENTICATED",
			message: "Not authenticated",
		});
	}
	return userMetadata;
}

/* ------------------------ user metadata (graceful) ------------------------ */
export async function getAuthUserData(ctx: QueryCtx) {
	const userMetadata = await betterAuthComponent.getAuthUser(ctx);
	return userMetadata; // Returns null if not authenticated, doesn't throw
}
/* -------------------------------- user data ------------------------------- */
export async function getPublicUserDataOrThrow(
	ctx: QueryCtx,
	userId: Id<"users">,
) {
	const user = await ctx.db.get(userId as Id<"users">);
	if (!user) {
		throw new ConvexError({
			code: "USER_NOT_FOUND",
			message: "User not found",
		});
	}
	return user;
}
/* ------------------------------ all user data ------------------------------ */
export async function getAllUserDataOrThrow(ctx: QueryCtx) {
	const userMetaData = await getAuthUserDataOrThrow(ctx);
	const user = await getPublicUserDataOrThrow(
		ctx,
		userMetaData.userId as Id<"users">,
	);
	return {
		user,
		userMetaData,
	};
}

/* ------------------------- all user data (graceful) ------------------------ */
export async function getAllUserData(ctx: QueryCtx) {
	const userMetaData = await getAuthUserData(ctx);
	if (!userMetaData) {
		return null; // Return null if not authenticated
	}
	const user = await ctx.db.get(userMetaData.userId as Id<"users">);
	if (!user) {
		return null; // Return null if user doesn't exist (deleted)
	}
	return {
		user,
		userMetaData,
	};
}
/* ------------------------------- asset admin ------------------------------ */
// lol probably dont follow this implementation in produciton
const ADMIN_EMAILS = ["myname@project.com"];

export async function assertAdmin(ctx: QueryCtx) {
	const userData = await getAllUserDataOrThrow(ctx);
	if (!ADMIN_EMAILS.includes(userData.userMetaData.email)) {
		throw new ConvexError({
			code: "NOT_ADMIN",
			message: "Not admin",
		});
	}
	return userData;
}
