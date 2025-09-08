// AI-related types for FitSense

export interface AIInsight {
  id: string;
  userId: string;
  createdAt: Date;

  // Analysis Context
  type:
    | "workout_analysis"
    | "nutrition_review"
    | "trend_identification"
    | "goal_progress"
    | "health_correlation"
    | "recommendation";

  // Time Range
  startDate: Date;
  endDate: Date;

  // Content
  title: string;
  summary: string;
  detailedAnalysis: string;

  // Recommendations
  recommendations: Recommendation[];

  // Supporting Data
  dataPoints: DataReference[];
  correlations: Correlation[];

  // Quality Metrics
  confidence: number;
  relevance?: number;
  actionability?: number;

  // User Interaction
  viewedAt?: Date;
  helpful?: boolean;
  saved: boolean;
}

export interface Recommendation {
  id: string;
  type: "workout" | "meal" | "lifestyle" | "goal_adjustment";
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  actionableSteps: string[];
  expectedOutcome: string;
  timeframe: string;
}

export interface DataReference {
  entityType: "workout" | "meal" | "metric";
  entityId: string;
  field: string;
  value: any;
}

export interface Correlation {
  factor1: string;
  factor2: string;
  strength: number;
  direction: "positive" | "negative";
  significance: number;
}

export interface ConversationLog {
  id: string;
  userId: string;
  createdAt: Date;

  // Conversation Context
  sessionId: string;
  messageCount: number;

  // Message History
  messages: ChatMessage[];

  // Context Data
  activeGoals: string[];
  recentWorkouts: string[];
  recentMeals: string[];
  healthMetrics: HealthSnapshot;

  // Quality Tracking
  userSatisfaction?: number;
  helpfulness?: number;
  topics: string[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;

  // AI Processing
  intent?: string;
  confidence?: number;
  processingTime?: number;

  // References
  referencedEntities?: EntityReference[];
}

export interface EntityReference {
  type: "workout" | "meal" | "goal" | "metric" | "insight";
  id: string;
  context: string;
}

export interface ChatResponse {
  messageId: string;
  response: string;
  suggestions: string[];
  followUpQuestions: string[];
}

// Re-export HealthSnapshot from health types
export type { HealthSnapshot } from "./health";
