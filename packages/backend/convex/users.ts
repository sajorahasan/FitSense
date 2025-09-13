import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { betterAuthComponent } from "./auth";
import { sendEmailVerification as sendVerificationEmail } from "./lib/resend/emails";
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
    // Basic profile fields
    name: v.optional(v.string()),
    avatar: v.optional(v.string()),

    // Personal Information
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

    // Fitness Profile (required fields - can be updated)
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

    // Health Conditions & Preferences (required arrays - can be updated)
    healthConditions: v.optional(v.array(v.string())),
    allergies: v.optional(v.array(v.string())),
    dietaryPreferences: v.optional(v.array(v.string())),

    // Privacy & Preferences (required fields - can be updated)
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

    // Technical fields
    deviceId: v.optional(v.string()),
    timezone: v.optional(v.string()),

    // Onboarding status
    onboardingCompleted: v.optional(v.boolean()),
    onboardingStep: v.optional(v.number()),

    // Theme preference
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

    // Map 'name' field to 'displayName' for database storage
    const updates: any = { ...args };
    if (updates.name) {
      updates.displayName = updates.name;
      delete updates.name; // Remove the name field since schema uses displayName
    }

    await ctx.db.patch(user._id, {
      ...updates,
      updatedAt: Date.now(),
      lastSyncAt: Date.now(),
    });

    return { success: true };
  },
});

export const getUserEmailStatus = query({
  args: {},
  returns: v.union(
    v.null(),
    v.object({
      email: v.string(),
      emailVerified: v.boolean(),
      name: v.optional(v.string()),
    }),
  ),
  handler: async (ctx) => {
    const authUser = await betterAuthComponent.getAuthUser(ctx);
    if (!authUser) {
      return null;
    }

    // Get the user profile from our database
    const user = await ctx.db.get(authUser.userId as Id<"users">);

    return {
      email: authUser.email,
      emailVerified: authUser.emailVerified || false,
      name: user?.displayName || authUser.name,
    };
  },
});

export const sendEmailVerification = mutation({
  args: {},
  returns: v.object({
    success: v.boolean(),
    message: v.string(),
  }),
  handler: async (ctx) => {
    const authUser = await betterAuthComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // Check if email is already verified
    if (authUser.emailVerified) {
      return {
        success: false,
        message: "Email is already verified",
      };
    }

    try {
      // Generate verification URL - in a real app, this would be a proper verification endpoint
      const verificationUrl = `${process.env.EXPO_MOBILE_URL || "http://localhost:8081"}/verify-email?token=${authUser.userId}`;

      // Send verification email using the existing email function
      await sendVerificationEmail(ctx, {
        to: authUser.email,
        url: verificationUrl,
      });

      return {
        success: true,
        message: "Verification email sent successfully",
      };
    } catch (error) {
      console.error("Failed to send verification email:", error);
      return {
        success: false,
        message: "Failed to send verification email. Please try again.",
      };
    }
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
      updatedAt: Date.now(),
      lastSyncAt: Date.now(),
    });

    return { success: true };
  },
});
