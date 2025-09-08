import { type AuthFunctions, BetterAuth } from "@convex-dev/better-auth";
import { components, internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";

const authFunctions: AuthFunctions = internal.auth;

export const betterAuthComponent = new BetterAuth(components.betterAuth, {
  authFunctions,
  verbose: true,
});

export const { createUser, deleteUser, updateUser, createSession } =
  betterAuthComponent.createAuthFunctions({
    onCreateUser: async (ctx, user) => {
      /**
       * function on user created
       *
       * copy the user's name to the
       * application users table
       *
       * onUpdateUser to keep it synced.
       */
      const userId = await ctx.db.insert("users", {
        name: user.name || "new user",
      });
      return userId;
    },
    onUpdateUser: async () => {
      /**
       * function to update user
       *
       * update the name in USERS table
       * update stripe data
       * update resend data
       */
    },
    onDeleteUser: async (ctx, userId) => {
      /**
       * function to delete user
       *
       * delete the user from the
       * application public users table
       */
      await ctx.db.delete(userId as Id<"users">);
    },
  });
