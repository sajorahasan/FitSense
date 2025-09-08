// Workout-related types for FitSense

export interface WorkoutSession {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;

  // Basic Info
  name: string;
  type: "cardio" | "strength" | "flexibility" | "sports" | "other";
  startTime: Date;
  endTime?: Date;
  duration?: number;

  // Performance Metrics
  exercises: ExerciseEntry[];
  totalCalories?: number;
  averageHeartRate?: number;
  maxHeartRate?: number;

  // Subjective Data
  mood: "terrible" | "poor" | "okay" | "good" | "excellent";
  perceivedEffort: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  notes?: string;

  // Environment
  location?: string;
  weather?: string;
  indoor: boolean;

  // Technical
  syncedAt?: Date;
  deviceSource?: string;
}

export interface ExerciseEntry {
  id: string;
  name: string;
  category?: string;
  sets?: SetEntry[];
  duration?: number;
  distance?: number;
  notes?: string;
  difficulty?: "easy" | "moderate" | "hard";
}

export interface SetEntry {
  reps?: number;
  weight?: number;
  duration?: number;
  restTime?: number;
  completed: boolean;
}

export interface WorkoutSessionCreate {
  name: string;
  type: "cardio" | "strength" | "flexibility" | "sports" | "other";
  startTime: Date;
  exercises?: ExerciseEntry[];
  mood?: "terrible" | "poor" | "okay" | "good" | "excellent";
  notes?: string;
  location?: string;
  indoor?: boolean;
}

export interface WorkoutSessionUpdate {
  name?: string;
  endTime?: Date;
  exercises?: ExerciseEntry[];
  mood?: "terrible" | "poor" | "okay" | "good" | "excellent";
  notes?: string;
}
