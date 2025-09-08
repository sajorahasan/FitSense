// Goal-related types for FitSense

export interface Goal {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;

  // Basic Info
  title: string;
  description?: string;
  category: "weight" | "fitness" | "nutrition" | "health" | "custom";

  // Target Definition
  targetValue: number;
  targetUnit: string;
  targetDate: Date;

  // Current Progress
  currentValue: number;
  startValue: number;
  startDate: Date;

  // Status
  status: "active" | "completed" | "paused" | "cancelled";
  completedAt?: Date;

  // Milestones
  milestones: Milestone[];

  // Technical
  priority: "low" | "medium" | "high";
  visibility: "private" | "friends" | "public";
}

export interface Milestone {
  id: string;
  title: string;
  targetValue: number;
  completedAt?: Date;
  reward?: string;
}

export interface GoalCreate {
  title: string;
  description?: string;
  category: "weight" | "fitness" | "nutrition" | "health" | "custom";
  targetValue: number;
  targetUnit: string;
  targetDate: Date;
}

export interface GoalProgress {
  currentValue: number;
  notes?: string;
}
