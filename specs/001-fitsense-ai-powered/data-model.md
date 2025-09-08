# Data Model: FitSense AI-Powered Wellness App

**Date**: $(date +%Y-%m-%d) | **Source**: `/Users/Hasan/Desktop/Hasan/Workspace/FitSense/specs/001-fitsense-ai-powered/spec.md`

## Overview
FitSense data model supports comprehensive health tracking across workouts, meals, vitals, and AI-driven insights. Designed for offline-first architecture with Convex backend and MMKV local storage.

## Core Entities

### User Profile
Primary entity for user management and personalization.

```typescript
interface UserProfile {
  id: string; // Convex ID
  email: string;
  displayName: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;

  // Personal Information
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  height?: number; // cm
  weight?: number; // kg

  // Fitness Profile
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';
  primaryGoal: 'weight_loss' | 'muscle_gain' | 'maintenance' | 'endurance' | 'health_management';

  // Health Conditions
  healthConditions: string[]; // ['diabetes', 'hypertension', etc.]
  allergies: string[]; // ['nuts', 'dairy', etc.]
  dietaryPreferences: string[]; // ['vegetarian', 'vegan', 'keto', etc.]

  // Privacy & Preferences
  privacyLevel: 'private' | 'friends_only' | 'public';
  dataRetention: '1_year' | '2_years' | 'forever';
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
```

**Relationships**: One-to-many with WorkoutSession, MealEntry, HealthMetric, Goal, ConversationLog

### Workout Session
Tracks exercise activities with performance metrics.

```typescript
interface WorkoutSession {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;

  // Basic Info
  name: string; // "Morning Run", "Upper Body Strength"
  type: 'cardio' | 'strength' | 'flexibility' | 'sports' | 'other';
  startTime: Date;
  endTime?: Date;
  duration?: number; // minutes

  // Performance Metrics
  exercises: ExerciseEntry[];
  totalCalories?: number;
  averageHeartRate?: number;
  maxHeartRate?: number;

  // Subjective Data
  mood: 'terrible' | 'poor' | 'okay' | 'good' | 'excellent';
  perceivedEffort: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10; // RPE scale
  notes?: string;

  // Environment
  location?: string;
  weather?: string;
  indoor: boolean;

  // Technical
  syncedAt?: Date;
  deviceSource?: string; // 'manual', 'apple_watch', 'fitbit', etc.
}

interface ExerciseEntry {
  id: string;
  name: string; // "Push-ups", "Running", "Bench Press"
  category: string; // "chest", "cardio", "legs", etc.

  // Performance Data
  sets?: SetEntry[];
  duration?: number; // minutes for cardio
  distance?: number; // km for cardio

  // Notes
  notes?: string;
  difficulty?: 'easy' | 'moderate' | 'hard';
}

interface SetEntry {
  reps?: number;
  weight?: number; // kg or lbs
  duration?: number; // seconds for timed exercises
  restTime?: number; // seconds
  completed: boolean;
}
```

**Relationships**: Belongs to UserProfile, referenced by AI Insight analyses

### Meal Entry
Tracks nutritional intake with detailed breakdown.

```typescript
interface MealEntry {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;

  // Basic Info
  name: string; // "Breakfast", "Post-workout meal"
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'drink';
  mealTime: Date;

  // Food Items
  foods: FoodItem[];

  // Nutrition Summary
  totalNutrition: NutritionalInfo;

  // Additional Data
  location?: string;
  withOthers?: boolean;
  mood?: 'terrible' | 'poor' | 'okay' | 'good' | 'excellent';

  // Media
  photoUrls: string[]; // References to uploaded images

  // Technical
  syncedAt?: Date;
  source: 'manual' | 'photo_recognition' | 'barcode_scan';
  confidence?: number; // AI recognition confidence (0-1)
}

interface FoodItem {
  id: string;
  name: string; // "Banana", "Grilled Chicken Breast"
  brand?: string;
  quantity: number;
  unit: 'grams' | 'cups' | 'pieces' | 'tablespoons' | 'ounces';

  // Nutrition per serving
  nutrition: NutritionalInfo;

  // Serving info
  servingSize?: number;
  servingUnit?: string;
}

interface NutritionalInfo {
  calories: number;
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
  fiber?: number; // grams
  sugar?: number; // grams
  sodium?: number; // mg
  cholesterol?: number; // mg

  // Micronutrients
  vitamins?: Record<string, number>; // vitamin_a: 10, vitamin_c: 5, etc.
  minerals?: Record<string, number>; // calcium: 100, iron: 2, etc.
}
```

**Relationships**: Belongs to UserProfile, referenced by AI nutrition analyses

### Health Metric
Tracks vital signs and biometric data.

```typescript
interface HealthMetric {
  id: string;
  userId: string;
  createdAt: Date;

  // Metric Type
  type: 'weight' | 'heart_rate' | 'blood_pressure' | 'sleep' | 'steps' | 'body_fat' | 'blood_sugar' | 'temperature' | 'oxygen_saturation' | 'stress_level';

  // Value
  value: number;
  unit: string; // 'kg', 'bpm', 'mmHg', 'hours', 'steps', '%', 'mg/dL', '°C', etc.

  // Context
  timestamp: Date;
  duration?: number; // for sleep, exercise duration

  // Additional Data
  systolic?: number; // for blood pressure
  diastolic?: number; // for blood pressure
  quality?: 'poor' | 'fair' | 'good' | 'excellent'; // for sleep, measurements

  // Source
  deviceSource?: string; // 'manual', 'apple_watch', 'fitbit', 'scale', etc.
  location?: string; // 'wrist', 'finger', 'arm', etc.

  // Technical
  syncedAt?: Date;
  accuracy?: number; // device-reported accuracy (0-1)
}
```

**Relationships**: Belongs to UserProfile, aggregated for trends and AI insights

### Goal
Manages user objectives and progress tracking.

```typescript
interface Goal {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;

  // Basic Info
  title: string; // "Lose 5kg", "Run 5k in 30 minutes"
  description?: string;
  category: 'weight' | 'fitness' | 'nutrition' | 'health' | 'custom';

  // Target Definition
  targetValue: number;
  targetUnit: string; // 'kg', 'minutes', 'calories', 'mg/dL', etc.
  targetDate: Date;

  // Current Progress
  currentValue: number;
  startValue: number;
  startDate: Date;

  // Status
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  completedAt?: Date;

  // Milestones
  milestones: Milestone[];

  // Technical
  priority: 'low' | 'medium' | 'high';
  visibility: 'private' | 'friends' | 'public';
}

interface Milestone {
  id: string;
  title: string;
  targetValue: number;
  completedAt?: Date;
  reward?: string; // "New workout playlist", "Achievement badge"
}
```

**Relationships**: Belongs to UserProfile, triggers notifications and AI recommendations

### AI Insight
Stores AI-generated analysis and recommendations.

```typescript
interface AIInsight {
  id: string;
  userId: string;
  createdAt: Date;

  // Analysis Context
  type: 'workout_analysis' | 'nutrition_review' | 'trend_identification' | 'goal_progress' | 'health_correlation' | 'recommendation';

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
  confidence: number; // 0-1
  relevance: number; // 0-1, user feedback
  actionability: number; // 0-1

  // User Interaction
  viewedAt?: Date;
  helpful?: boolean;
  saved: boolean;
}

interface Recommendation {
  id: string;
  type: 'workout' | 'meal' | 'lifestyle' | 'goal_adjustment';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';

  // Actionable details
  actionableSteps: string[];
  expectedOutcome: string;
  timeframe: string;
}

interface DataReference {
  entityType: 'workout' | 'meal' | 'metric';
  entityId: string;
  field: string;
  value: any;
}

interface Correlation {
  factor1: string; // "sleep_quality"
  factor2: string; // "energy_level"
  strength: number; // correlation coefficient
  direction: 'positive' | 'negative';
  significance: number; // p-value
}
```

**Relationships**: Belongs to UserProfile, references other entities for analysis

### Conversation Log
Preserves chat history with AI assistant.

```typescript
interface ConversationLog {
  id: string;
  userId: string;
  createdAt: Date;

  // Conversation Context
  sessionId: string;
  messageCount: number;

  // Message History
  messages: ChatMessage[];

  // Context Data
  activeGoals: string[]; // Goal IDs
  recentWorkouts: string[]; // Workout IDs
  recentMeals: string[]; // Meal IDs
  healthMetrics: HealthSnapshot;

  // Quality Tracking
  userSatisfaction?: number; // 1-5 rating
  helpfulness?: number; // 0-1 score
  topics: string[]; // ['nutrition', 'workout', 'motivation']
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;

  // AI Processing
  intent?: string; // 'question', 'request', 'feedback'
  confidence?: number;
  processingTime?: number; // ms

  // References
  referencedEntities?: EntityReference[];
}

interface EntityReference {
  type: 'workout' | 'meal' | 'goal' | 'metric' | 'insight';
  id: string;
  context: string; // "your last workout", "breakfast today"
}

interface HealthSnapshot {
  recentWeight?: number;
  recentSleepHours?: number;
  activeGoalsCount: number;
  streakDays: number;
}
```

**Relationships**: Belongs to UserProfile, references other entities for context

## Data Relationships Diagram

```
UserProfile (1) ──── (M) WorkoutSession
    │                      │
    ├── (M) MealEntry      ├── (M) ExerciseEntry
    │                      │
    ├── (M) HealthMetric   └── (M) SetEntry
    │
    ├── (M) Goal
    │      └── (M) Milestone
    │
    ├── (M) AIInsight
    │      ├── (M) Recommendation
    │      ├── (M) DataReference
    │      └── (M) Correlation
    │
    └── (M) ConversationLog
           ├── (M) ChatMessage
           └── (1) HealthSnapshot
```

## Validation Rules

### Business Logic Constraints
- **User Profile**: Age must be 13+ for data collection compliance
- **Workout Session**: End time must be after start time, duration must be positive
- **Meal Entry**: Total nutrition must equal sum of food item nutrition
- **Health Metric**: Values must be within medically reasonable ranges
- **Goal**: Target date must be in the future, progress must be logical
- **AI Insight**: Confidence scores must be between 0 and 1

### Data Integrity Rules
- **Required Fields**: ID, userId, createdAt for all entities
- **Foreign Keys**: All userId fields must reference valid UserProfile
- **Unique Constraints**: Email addresses must be unique
- **Enum Values**: All enumerated fields must use predefined values
- **Date Logic**: UpdatedAt must be >= createdAt

## Indexing Strategy

### Primary Indexes
- UserProfile: id, email
- All entities: id, userId + createdAt

### Secondary Indexes
- WorkoutSession: userId + type + startTime
- MealEntry: userId + mealTime + type
- HealthMetric: userId + type + timestamp
- Goal: userId + status + targetDate
- AIInsight: userId + type + createdAt
- ConversationLog: userId + sessionId + createdAt

## Migration Strategy

### Version 1.0 (MVP)
- Core entities: UserProfile, WorkoutSession, MealEntry, HealthMetric
- Basic relationships and validations
- Essential indexes for performance

### Version 1.1 (AI Features)
- Add AIInsight and ConversationLog entities
- Enhanced Goal entity with milestones
- AI-related indexes and validations

### Version 2.0 (Advanced Features)
- Enhanced HealthMetric with additional types
- Social features and sharing capabilities
- Advanced analytics data structures
