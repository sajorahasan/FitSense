// Meal-related types for FitSense

export interface MealEntry {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;

  // Basic Info
  name?: string;
  type: "breakfast" | "lunch" | "dinner" | "snack" | "drink";
  mealTime: Date;

  // Food Items
  foods: FoodItem[];

  // Nutrition Summary
  totalNutrition: NutritionalInfo;

  // Additional Data
  location?: string;
  withOthers?: boolean;
  mood?: "terrible" | "poor" | "okay" | "good" | "excellent";

  // Media
  photoUrls: string[];

  // Technical
  syncedAt?: Date;
  source: "manual" | "photo_recognition" | "barcode_scan";
  confidence?: number;
}

export interface FoodItem {
  id: string;
  name: string;
  brand?: string;
  quantity: number;
  unit: string;
  nutrition: NutritionalInfo;
  servingSize?: number;
  servingUnit?: string;
}

export interface NutritionalInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  cholesterol?: number;
  vitamins?: Record<string, number>;
  minerals?: Record<string, number>;
}

export interface MealEntryCreate {
  name?: string;
  type: "breakfast" | "lunch" | "dinner" | "snack" | "drink";
  mealTime: Date;
  foods: FoodItem[];
  photoUrls?: string[];
  location?: string;
  withOthers?: boolean;
}
