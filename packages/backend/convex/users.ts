import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { betterAuthComponent } from "./auth";
import { getAllUserData } from "./model/user";

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    // Use Better Auth to get the authenticated user
    const authUser = await betterAuthComponent.getAuthUser(ctx);
    if (!authUser) {
      return null;
    }

    // Get the user from our public users table
    const user = await ctx.db.get(authUser.userId as Id<"users">);
    return user;
  },
});

export const getAllUserDataQuery = query({
  args: {},
  handler: async (ctx) => {
    const allUserData = await getAllUserData(ctx);
    return allUserData;
  },
});

export const updateUserProfile = mutation({
  args: {
    name: v.optional(v.string()),
    dateOfBirth: v.optional(v.number()),
    gender: v.optional(
      v.union(
        v.literal("male"),
        v.literal("female"),
        v.literal("other"),
        v.literal("prefer-not-to-say"),
      ),
    ),
    height: v.optional(v.number()),
    weight: v.optional(v.number()),
    fitnessLevel: v.optional(
      v.union(
        v.literal("beginner"),
        v.literal("intermediate"),
        v.literal("advanced"),
      ),
    ),
    activityLevel: v.optional(
      v.union(
        v.literal("sedentary"),
        v.literal("lightly_active"),
        v.literal("moderately_active"),
        v.literal("very_active"),
        v.literal("extremely_active"),
      ),
    ),
    primaryGoal: v.optional(
      v.union(
        v.literal("weight_loss"),
        v.literal("muscle_gain"),
        v.literal("maintenance"),
        v.literal("endurance"),
        v.literal("health_management"),
      ),
    ),
    healthConditions: v.optional(v.array(v.string())),
    allergies: v.optional(v.array(v.string())),
    dietaryPreferences: v.optional(v.array(v.string())),
    privacyLevel: v.optional(
      v.union(
        v.literal("private"),
        v.literal("friends_only"),
        v.literal("public"),
      ),
    ),
    dataRetention: v.optional(
      v.union(v.literal("1_year"), v.literal("2_years"), v.literal("forever")),
    ),
    notifications: v.optional(
      v.object({
        workoutReminders: v.boolean(),
        mealReminders: v.boolean(),
        goalCelebrations: v.boolean(),
        aiInsights: v.boolean(),
        weeklyReports: v.boolean(),
      }),
    ),
    onboardingCompleted: v.optional(v.boolean()),
    onboardingStep: v.optional(v.number()),
    themeId: v.optional(
      v.union(
        v.literal("default"),
        v.literal("lavender"),
        v.literal("mint"),
        v.literal("sky"),
      ),
    ),
  },
  handler: async (ctx, args) => {
    // Use Better Auth to get the authenticated user
    const authUser = await betterAuthComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db.get(authUser.userId as Id<"users">);
    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(user._id, {
      ...args,
      lastSyncAt: Date.now(),
    });

    return { success: true };
  },
});

export const completeOnboarding = mutation({
  args: {},
  handler: async (ctx) => {
    // Use Better Auth to get the authenticated user
    const authUser = await betterAuthComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db.get(authUser.userId as Id<"users">);
    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(user._id, {
      onboardingCompleted: true,
      onboardingStep: 4, // Final step
      lastSyncAt: Date.now(),
    });

    return { success: true };
  },
});
