// Health-related types for FitSense

export interface HealthMetric {
  id: string;
  userId: string;
  createdAt: Date;

  // Metric Type
  type:
    | "weight"
    | "heart_rate"
    | "blood_pressure"
    | "sleep"
    | "steps"
    | "body_fat"
    | "blood_sugar"
    | "temperature"
    | "oxygen_saturation"
    | "stress_level";

  // Value
  value: number;
  unit: string;

  // Context
  timestamp: Date;
  duration?: number;

  // Additional Data
  systolic?: number;
  diastolic?: number;
  quality?: "poor" | "fair" | "good" | "excellent";

  // Source
  deviceSource?: string;
  location?: string;

  // Technical
  syncedAt?: Date;
  accuracy?: number;
}

export interface HealthMetricCreate {
  type:
    | "weight"
    | "heart_rate"
    | "blood_pressure"
    | "sleep"
    | "steps"
    | "body_fat"
    | "blood_sugar"
    | "temperature"
    | "oxygen_saturation"
    | "stress_level";
  value: number;
  unit: string;
  timestamp: Date;
  duration?: number;
  systolic?: number;
  diastolic?: number;
  quality?: "poor" | "fair" | "good" | "excellent";
  deviceSource?: string;
}

// Health snapshot for AI context
export interface HealthSnapshot {
  recentWeight?: number;
  recentSleepHours?: number;
  activeGoalsCount: number;
  streakDays: number;
}
