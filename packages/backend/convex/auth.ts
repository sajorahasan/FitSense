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
       * Create a comprehensive user profile for FitSense
       * with default values for onboarding flow
       */
      const userId = await ctx.db.insert("users", {
        // Basic auth fields (Better Auth integration)
        tokenIdentifier: user.email, // Use email as tokenIdentifier

        // User Profile fields (matching contract specification)
        email: user.email,
        displayName: user.name ?? "new user",
        ...(user.image && { avatar: user.image }),
        createdAt: Date.now(),
        updatedAt: Date.now(),

        // Fitness Profile (required fields with defaults)
        fitnessLevel: "beginner",
        activityLevel: "sedentary",
        primaryGoal: "health_management",

        // Health Conditions & Preferences (required arrays with defaults)
        healthConditions: [],
        allergies: [],
        dietaryPreferences: [],

        // Privacy & Preferences (required fields with defaults)
        privacyLevel: "private",
        dataRetention: "forever",
        notifications: {
          workoutReminders: true,
          mealReminders: true,
          goalCelebrations: true,
          aiInsights: true,
          weeklyReports: true,
        },

        // Technical (required fields)
        deviceId: `device_${Date.now()}`, // Generate a unique device ID
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,

        // Onboarding defaults
        onboardingCompleted: false,
        onboardingStep: 1,
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
