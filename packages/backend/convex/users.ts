import { v } from "convex/values";
import { query } from "./_generated/server";
import * as Users from "./model/user";

/**
 * this will return
 * user public table -- if being used
 * user meta data from better auth component
 * Returns null if user is not authenticated or has been deleted
 */
export const getAllUserDataQuery = query({
	args: {},
	returns: v.union(
		v.object({
			user: v.any(),
			userMetaData: v.any(),
		}),
		v.null(),
	),
	handler: async (ctx) => {
		const user = await Users.getAllUserData(ctx);
		return user;
	},
});
