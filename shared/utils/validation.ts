// Validation utility functions for FitSense

import type { ValidationError } from "../types/common";

/**
 * Email validation
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Password validation (minimum 8 characters)
 */
export function isValidPassword(password: string): boolean {
  return password.length >= 8;
}

/**
 * Required field validation
 */
export function isRequired(value: any, fieldName: string): ValidationError | null {
  if (!value || (typeof value === "string" && value.trim() === "")) {
    return { field: fieldName, message: `${fieldName} is required` };
  }
  return null;
}

/**
 * Numeric range validation
 */
export function isInRange(value: number, min: number, max: number, fieldName: string): ValidationError | null {
  if (value < min || value > max) {
    return {
      field: fieldName,
      message: `${fieldName} must be between ${min} and ${max}`,
    };
  }
  return null;
}

/**
 * Positive number validation
 */
export function isPositive(value: number, fieldName: string): ValidationError | null {
  if (value <= 0) {
    return { field: fieldName, message: `${fieldName} must be positive` };
  }
  return null;
}

/**
 * Future date validation
 */
export function isFutureDate(date: Date, fieldName: string): ValidationError | null {
  if (date <= new Date()) {
    return { field: fieldName, message: `${fieldName} must be in the future` };
  }
  return null;
}

/**
 * Validate workout session data
 */
export function validateWorkoutSession(data: any): ValidationError[] {
  const errors: ValidationError[] = [];

  // Required fields
  const nameError = isRequired(data.name, "Workout name");
  if (nameError) errors.push(nameError);

  const typeError = isRequired(data.type, "Workout type");
  if (typeError) errors.push(typeError);

  // Date validation
  if (data.startTime) {
    if (data.endTime && data.startTime > data.endTime) {
      errors.push({
        field: "endTime",
        message: "End time must be after start time",
      });
    }
  }

  // Perceived effort validation
  if (data.perceivedEffort !== undefined) {
    const effortError = isInRange(data.perceivedEffort, 1, 10, "Perceived effort");
    if (effortError) errors.push(effortError);
  }

  return errors;
}

/**
 * Validate meal entry data
 */
export function validateMealEntry(data: any): ValidationError[] {
  const errors: ValidationError[] = [];

  // Required fields
  const typeError = isRequired(data.type, "Meal type");
  if (typeError) errors.push(typeError);

  const mealTimeError = isRequired(data.mealTime, "Meal time");
  if (mealTimeError) errors.push(mealTimeError);

  // Foods validation
  if (!data.foods || data.foods.length === 0) {
    errors.push({
      field: "foods",
      message: "At least one food item is required",
    });
  } else {
    data.foods.forEach((food: any, index: number) => {
      if (!food.name) {
        errors.push({
          field: `foods[${index}].name`,
          message: "Food name is required",
        });
      }
      if (!food.quantity || food.quantity <= 0) {
        errors.push({
          field: `foods[${index}].quantity`,
          message: "Food quantity must be positive",
        });
      }
    });
  }

  return errors;
}

/**
 * Validate health metric data
 */
export function validateHealthMetric(data: any): ValidationError[] {
  const errors: ValidationError[] = [];

  // Required fields
  const typeError = isRequired(data.type, "Metric type");
  if (typeError) errors.push(typeError);

  const valueError = isRequired(data.value, "Metric value");
  if (valueError) errors.push(valueError);

  const unitError = isRequired(data.unit, "Metric unit");
  if (unitError) errors.push(unitError);

  // Value range validation based on type
  if (data.type && data.value) {
    switch (data.type) {
      case "weight":
        if (data.value < 30 || data.value > 300) {
          errors.push({
            field: "value",
            message: "Weight must be between 30-300 kg",
          });
        }
        break;
      case "heart_rate":
        if (data.value < 40 || data.value > 200) {
          errors.push({
            field: "value",
            message: "Heart rate must be between 40-200 bpm",
          });
        }
        break;
      case "blood_sugar":
        if (data.value < 20 || data.value > 500) {
          errors.push({
            field: "value",
            message: "Blood sugar must be between 20-500 mg/dL",
          });
        }
        break;
    }
  }

  return errors;
}

/**
 * Validate goal data
 */
export function validateGoal(data: any): ValidationError[] {
  const errors: ValidationError[] = [];

  // Required fields
  const titleError = isRequired(data.title, "Goal title");
  if (titleError) errors.push(titleError);

  const categoryError = isRequired(data.category, "Goal category");
  if (categoryError) errors.push(categoryError);

  const targetValueError = isRequired(data.targetValue, "Target value");
  if (targetValueError) errors.push(targetValueError);

  const targetDateError = isRequired(data.targetDate, "Target date");
  if (targetDateError) errors.push(targetDateError);

  // Target value validation
  if (data.targetValue && data.targetValue <= 0) {
    errors.push({
      field: "targetValue",
      message: "Target value must be positive",
    });
  }

  // Target date validation
  if (data.targetDate) {
    const futureDateError = isFutureDate(new Date(data.targetDate), "Target date");
    if (futureDateError) errors.push(futureDateError);
  }

  return errors;
}
