// User-related types for FitSense

export interface UserProfile {
  id: string;
  email: string;
  displayName?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;

  // Personal Information
  dateOfBirth?: Date;
  gender?: "male" | "female" | "other" | "prefer-not-to-say";
  height?: number; // cm
  weight?: number; // kg

  // Fitness Profile
  fitnessLevel: "beginner" | "intermediate" | "advanced";
  activityLevel: "sedentary" | "lightly_active" | "moderately_active" | "very_active" | "extremely_active";
  primaryGoal: "weight_loss" | "muscle_gain" | "maintenance" | "endurance" | "health_management";

  // Health Conditions & Preferences
  healthConditions: string[];
  allergies: string[];
  dietaryPreferences: string[];

  // Privacy & Preferences
  privacyLevel: "private" | "friends_only" | "public";
  dataRetention: "1_year" | "2_years" | "forever";
  notifications: {
    workoutReminders: boolean;
    mealReminders: boolean;
    goalCelebrations: boolean;
    aiInsights: boolean;
    weeklyReports: boolean;
  };

  // Technical
  lastSyncAt?: Date;
  deviceId: string;
  timezone: string;
}

export interface UserProfileUpdate {
  displayName?: string;
  fitnessLevel?: "beginner" | "intermediate" | "advanced";
  primaryGoal?: "weight_loss" | "muscle_gain" | "maintenance" | "endurance" | "health_management";
  healthConditions?: string[];
  privacyLevel?: "private" | "friends_only" | "public";
  notifications?: Partial<UserProfile["notifications"]>;
}
