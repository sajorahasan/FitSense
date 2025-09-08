import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
	/**
	 * in the dashboard -> components -> better-auth
	 * the real user table is there when a user is created
	 *
	 * this is only the forward facing table
	 *
	 * you can edit this as you want this to be
	 */
	users: defineTable({
		name: v.optional(v.string()),
		image: v.optional(v.string()),
	}),
	/**
	 * add your own tables here
	 */
});
