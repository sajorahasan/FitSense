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

  // Workout Sessions Table
  workouts: defineTable({
    userId: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),

    // Basic Info
    name: v.string(),
    type: v.union(
      v.literal("cardio"),
      v.literal("strength"),
      v.literal("flexibility"),
      v.literal("sports"),
      v.literal("other"),
    ),
    startTime: v.number(),
    endTime: v.optional(v.number()),
    duration: v.optional(v.number()),

    // Performance Metrics
    exercises: v.array(
      v.object({
        id: v.string(),
        name: v.string(),
        category: v.optional(v.string()),
        sets: v.optional(
          v.array(
            v.object({
              reps: v.optional(v.number()),
              weight: v.optional(v.number()),
              duration: v.optional(v.number()),
              restTime: v.optional(v.number()),
              completed: v.boolean(),
            }),
          ),
        ),
        duration: v.optional(v.number()),
        distance: v.optional(v.number()),
        notes: v.optional(v.string()),
        difficulty: v.optional(
          v.union(v.literal("easy"), v.literal("moderate"), v.literal("hard")),
        ),
      }),
    ),
    totalCalories: v.optional(v.number()),
    averageHeartRate: v.optional(v.number()),
    maxHeartRate: v.optional(v.number()),

    // Subjective Data
    mood: v.union(
      v.literal("terrible"),
      v.literal("poor"),
      v.literal("okay"),
      v.literal("good"),
      v.literal("excellent"),
    ),
    perceivedEffort: v.union(
      v.literal(1),
      v.literal(2),
      v.literal(3),
      v.literal(4),
      v.literal(5),
      v.literal(6),
      v.literal(7),
      v.literal(8),
      v.literal(9),
      v.literal(10),
    ),
    notes: v.optional(v.string()),

    // Environment
    location: v.optional(v.string()),
    weather: v.optional(v.string()),
    indoor: v.boolean(),

    // Technical
    syncedAt: v.optional(v.number()),
    deviceSource: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_user_type_date", ["userId", "type", "startTime"])
    .index("by_user_date", ["userId", "startTime"]),

  // Meal Entries Table
  meals: defineTable({
    userId: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),

    // Basic Info
    name: v.optional(v.string()),
    type: v.union(
      v.literal("breakfast"),
      v.literal("lunch"),
      v.literal("dinner"),
      v.literal("snack"),
      v.literal("drink"),
    ),
    mealTime: v.number(),

    // Food Items
    foods: v.array(
      v.object({
        id: v.string(),
        name: v.string(),
        brand: v.optional(v.string()),
        quantity: v.number(),
        unit: v.string(),
        nutrition: v.object({
          calories: v.number(),
          protein: v.number(),
          carbs: v.number(),
          fat: v.number(),
          fiber: v.optional(v.number()),
          sugar: v.optional(v.number()),
          sodium: v.optional(v.number()),
          cholesterol: v.optional(v.number()),
          vitamins: v.optional(v.record(v.string(), v.number())),
          minerals: v.optional(v.record(v.string(), v.number())),
        }),
        servingSize: v.optional(v.number()),
        servingUnit: v.optional(v.string()),
      }),
    ),

    // Nutrition Summary
    totalNutrition: v.object({
      calories: v.number(),
      protein: v.number(),
      carbs: v.number(),
      fat: v.number(),
      fiber: v.optional(v.number()),
      sugar: v.optional(v.number()),
      sodium: v.optional(v.number()),
      cholesterol: v.optional(v.number()),
      vitamins: v.optional(v.record(v.string(), v.number())),
      minerals: v.optional(v.record(v.string(), v.number())),
    }),

    // Additional Data
    location: v.optional(v.string()),
    withOthers: v.optional(v.boolean()),
    mood: v.optional(
      v.union(
        v.literal("terrible"),
        v.literal("poor"),
        v.literal("okay"),
        v.literal("good"),
        v.literal("excellent"),
      ),
    ),

    // Media
    photoUrls: v.array(v.string()),

    // Technical
    syncedAt: v.optional(v.number()),
    source: v.union(
      v.literal("manual"),
      v.literal("photo_recognition"),
      v.literal("barcode_scan"),
    ),
    confidence: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_user_type_date", ["userId", "type", "mealTime"])
    .index("by_user_date", ["userId", "mealTime"]),

  // Health Metrics Table
  healthMetrics: defineTable({
    userId: v.id("users"),
    createdAt: v.number(),

    // Metric Type
    type: v.union(
      v.literal("weight"),
      v.literal("heart_rate"),
      v.literal("blood_pressure"),
      v.literal("sleep"),
      v.literal("steps"),
      v.literal("body_fat"),
      v.literal("blood_sugar"),
      v.literal("temperature"),
      v.literal("oxygen_saturation"),
      v.literal("stress_level"),
    ),

    // Value
    value: v.number(),
    unit: v.string(),

    // Context
    timestamp: v.number(),
    duration: v.optional(v.number()),

    // Additional Data
    systolic: v.optional(v.number()),
    diastolic: v.optional(v.number()),
    quality: v.optional(
      v.union(
        v.literal("poor"),
        v.literal("fair"),
        v.literal("good"),
        v.literal("excellent"),
      ),
    ),

    // Source
    deviceSource: v.optional(v.string()),
    location: v.optional(v.string()),

    // Technical
    syncedAt: v.optional(v.number()),
    accuracy: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_user_type_date", ["userId", "type", "timestamp"])
    .index("by_user_date", ["userId", "timestamp"]),
});
