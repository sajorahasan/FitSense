// Convex Schema Contract for FitSense
// This file defines the database schema and validation rules for Convex backend

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // User Profile Table
  users: defineTable({
    email: v.string(),
    displayName: v.optional(v.string()),
    avatar: v.optional(v.string()),
    createdAt: v.number(), // Date as timestamp
    updatedAt: v.number(),

    // Personal Information
    dateOfBirth: v.optional(v.number()),
    gender: v.optional(
      v.union(v.literal("male"), v.literal("female"), v.literal("other"), v.literal("prefer-not-to-say"))
    ),
    height: v.optional(v.number()), // cm
    weight: v.optional(v.number()), // kg

    // Fitness Profile
    fitnessLevel: v.union(v.literal("beginner"), v.literal("intermediate"), v.literal("advanced")),
    activityLevel: v.union(
      v.literal("sedentary"),
      v.literal("lightly_active"),
      v.literal("moderately_active"),
      v.literal("very_active"),
      v.literal("extremely_active")
    ),
    primaryGoal: v.union(
      v.literal("weight_loss"),
      v.literal("muscle_gain"),
      v.literal("maintenance"),
      v.literal("endurance"),
      v.literal("health_management")
    ),

    // Health Conditions & Preferences
    healthConditions: v.array(v.string()),
    allergies: v.array(v.string()),
    dietaryPreferences: v.array(v.string()),

    // Privacy & Preferences
    privacyLevel: v.union(v.literal("private"), v.literal("friends_only"), v.literal("public")),
    dataRetention: v.union(v.literal("1_year"), v.literal("2_years"), v.literal("forever")),
    notifications: v.object({
      workoutReminders: v.boolean(),
      mealReminders: v.boolean(),
      goalCelebrations: v.boolean(),
      aiInsights: v.boolean(),
      weeklyReports: v.boolean(),
    }),

    // Technical
    lastSyncAt: v.optional(v.number()),
    deviceId: v.string(),
    timezone: v.string(),
  })
    .index("by_email", ["email"])
    .index("by_device", ["deviceId"]),

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
      v.literal("other")
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
            })
          )
        ),
        duration: v.optional(v.number()),
        distance: v.optional(v.number()),
        notes: v.optional(v.string()),
        difficulty: v.optional(v.union(v.literal("easy"), v.literal("moderate"), v.literal("hard"))),
      })
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
      v.literal("excellent")
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
      v.literal(10)
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
      v.literal("drink")
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
      })
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
      v.union(v.literal("terrible"), v.literal("poor"), v.literal("okay"), v.literal("good"), v.literal("excellent"))
    ),

    // Media
    photoUrls: v.array(v.string()),

    // Technical
    syncedAt: v.optional(v.number()),
    source: v.union(v.literal("manual"), v.literal("photo_recognition"), v.literal("barcode_scan")),
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
      v.literal("stress_level")
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
    quality: v.optional(v.union(v.literal("poor"), v.literal("fair"), v.literal("good"), v.literal("excellent"))),

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

  // Goals Table
  goals: defineTable({
    userId: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),

    // Basic Info
    title: v.string(),
    description: v.optional(v.string()),
    category: v.union(
      v.literal("weight"),
      v.literal("fitness"),
      v.literal("nutrition"),
      v.literal("health"),
      v.literal("custom")
    ),

    // Target Definition
    targetValue: v.number(),
    targetUnit: v.string(),
    targetDate: v.number(),

    // Current Progress
    currentValue: v.number(),
    startValue: v.number(),
    startDate: v.number(),

    // Status
    status: v.union(v.literal("active"), v.literal("completed"), v.literal("paused"), v.literal("cancelled")),
    completedAt: v.optional(v.number()),

    // Milestones
    milestones: v.array(
      v.object({
        id: v.string(),
        title: v.string(),
        targetValue: v.number(),
        completedAt: v.optional(v.number()),
        reward: v.optional(v.string()),
      })
    ),

    // Technical
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    visibility: v.union(v.literal("private"), v.literal("friends"), v.literal("public")),
  })
    .index("by_user", ["userId"])
    .index("by_user_status", ["userId", "status"])
    .index("by_user_category", ["userId", "category"]),

  // AI Insights Table
  aiInsights: defineTable({
    userId: v.id("users"),
    createdAt: v.number(),

    // Analysis Context
    type: v.union(
      v.literal("workout_analysis"),
      v.literal("nutrition_review"),
      v.literal("trend_identification"),
      v.literal("goal_progress"),
      v.literal("health_correlation"),
      v.literal("recommendation")
    ),

    // Time Range
    startDate: v.number(),
    endDate: v.number(),

    // Content
    title: v.string(),
    summary: v.string(),
    detailedAnalysis: v.string(),

    // Recommendations
    recommendations: v.array(
      v.object({
        id: v.string(),
        type: v.union(v.literal("workout"), v.literal("meal"), v.literal("lifestyle"), v.literal("goal_adjustment")),
        title: v.string(),
        description: v.string(),
        priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
        actionableSteps: v.array(v.string()),
        expectedOutcome: v.string(),
        timeframe: v.string(),
      })
    ),

    // Supporting Data
    dataPoints: v.array(
      v.object({
        entityType: v.union(v.literal("workout"), v.literal("meal"), v.literal("metric")),
        entityId: v.string(),
        field: v.string(),
        value: v.any(),
      })
    ),
    correlations: v.array(
      v.object({
        factor1: v.string(),
        factor2: v.string(),
        strength: v.number(),
        direction: v.union(v.literal("positive"), v.literal("negative")),
        significance: v.number(),
      })
    ),

    // Quality Metrics
    confidence: v.number(),
    relevance: v.optional(v.number()),
    actionability: v.optional(v.number()),

    // User Interaction
    viewedAt: v.optional(v.number()),
    helpful: v.optional(v.boolean()),
    saved: v.boolean(),
  })
    .index("by_user", ["userId"])
    .index("by_user_type_date", ["userId", "type", "createdAt"])
    .index("by_user_date", ["userId", "createdAt"]),

  // Conversation Logs Table
  conversations: defineTable({
    userId: v.id("users"),
    createdAt: v.number(),

    // Conversation Context
    sessionId: v.string(),
    messageCount: v.number(),

    // Message History
    messages: v.array(
      v.object({
        id: v.string(),
        role: v.union(v.literal("user"), v.literal("assistant")),
        content: v.string(),
        timestamp: v.number(),

        // AI Processing
        intent: v.optional(v.string()),
        confidence: v.optional(v.number()),
        processingTime: v.optional(v.number()),

        // References
        referencedEntities: v.optional(
          v.array(
            v.object({
              type: v.union(
                v.literal("workout"),
                v.literal("meal"),
                v.literal("goal"),
                v.literal("metric"),
                v.literal("insight")
              ),
              id: v.string(),
              context: v.string(),
            })
          )
        ),
      })
    ),

    // Context Data
    activeGoals: v.array(v.string()),
    recentWorkouts: v.array(v.string()),
    recentMeals: v.array(v.string()),
    healthMetrics: v.object({
      recentWeight: v.optional(v.number()),
      recentSleepHours: v.optional(v.number()),
      activeGoalsCount: v.number(),
      streakDays: v.number(),
    }),

    // Quality Tracking
    userSatisfaction: v.optional(v.number()),
    helpfulness: v.optional(v.number()),
    topics: v.array(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_user_session", ["userId", "sessionId"])
    .index("by_session", ["sessionId"]),
});

// Type exports for use in queries and mutations
export type User = typeof schema.tables.users.validator._type;
export type Workout = typeof schema.tables.workouts.validator._type;
export type Meal = typeof schema.tables.meals.validator._type;
export type HealthMetric = typeof schema.tables.healthMetrics.validator._type;
export type Goal = typeof schema.tables.goals.validator._type;
export type AIInsight = typeof schema.tables.aiInsights.validator._type;
export type Conversation = typeof schema.tables.conversations.validator._type;
