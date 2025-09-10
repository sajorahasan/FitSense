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
    // Basic auth fields
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    tokenIdentifier: v.string(),

    // Personal Information
    dateOfBirth: v.optional(v.number()), // timestamp
    gender: v.optional(
      v.union(
        v.literal("male"),
        v.literal("female"),
        v.literal("other"),
        v.literal("prefer-not-to-say"),
      ),
    ),
    height: v.optional(v.number()), // cm
    weight: v.optional(v.number()), // kg

    // Fitness Profile
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

    // Health Conditions & Preferences
    healthConditions: v.optional(v.array(v.string())),
    allergies: v.optional(v.array(v.string())),
    dietaryPreferences: v.optional(v.array(v.string())),

    // Privacy & Preferences
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

    // Technical
    lastSyncAt: v.optional(v.number()), // timestamp
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
  }).index("by_token", { fields: ["tokenIdentifier"] }),
  /**
   * add your own tables here
   */
});
