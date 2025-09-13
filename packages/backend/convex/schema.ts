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
    // Basic auth fields (Better Auth integration)
    tokenIdentifier: v.string(),

    // User Profile fields (matching contract specification)
    email: v.string(),
    displayName: v.optional(v.string()),
    avatar: v.optional(v.string()),
    createdAt: v.number(), // Date as timestamp
    updatedAt: v.number(),

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

    // Fitness Profile (required fields as per contract)
    fitnessLevel: v.union(
      v.literal("beginner"),
      v.literal("intermediate"),
      v.literal("advanced"),
    ),
    activityLevel: v.union(
      v.literal("sedentary"),
      v.literal("lightly_active"),
      v.literal("moderately_active"),
      v.literal("very_active"),
      v.literal("extremely_active"),
    ),
    primaryGoal: v.union(
      v.literal("weight_loss"),
      v.literal("muscle_gain"),
      v.literal("maintenance"),
      v.literal("endurance"),
      v.literal("health_management"),
    ),

    // Health Conditions & Preferences (required arrays as per contract)
    healthConditions: v.array(v.string()),
    allergies: v.array(v.string()),
    dietaryPreferences: v.array(v.string()),

    // Privacy & Preferences (required fields as per contract)
    privacyLevel: v.union(
      v.literal("private"),
      v.literal("friends_only"),
      v.literal("public"),
    ),
    dataRetention: v.union(
      v.literal("1_year"),
      v.literal("2_years"),
      v.literal("forever"),
    ),
    notifications: v.object({
      workoutReminders: v.boolean(),
      mealReminders: v.boolean(),
      goalCelebrations: v.boolean(),
      aiInsights: v.boolean(),
      weeklyReports: v.boolean(),
    }),

    // Technical (required fields as per contract)
    lastSyncAt: v.optional(v.number()), // timestamp
    deviceId: v.string(),
    timezone: v.string(),

    // Onboarding status (additional fields for app functionality)
    onboardingCompleted: v.optional(v.boolean()),
    onboardingStep: v.optional(v.number()),

    // Theme preference (additional field for app functionality)
    themeId: v.optional(
      v.union(
        v.literal("default"),
        v.literal("lavender"),
        v.literal("mint"),
        v.literal("sky"),
      ),
    ),
  })
    .index("by_token", { fields: ["tokenIdentifier"] })
    .index("by_email", { fields: ["email"] })
    .index("by_device", { fields: ["deviceId"] }),
  /**
   * add your own tables here
   */
});
