import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createMeal = mutation({
  args: {
    name: v.optional(v.string()),
    type: v.union(
      v.literal("breakfast"),
      v.literal("lunch"),
      v.literal("dinner"),
      v.literal("snack"),
      v.literal("drink"),
    ),
    mealTime: v.number(),
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
      }),
    ),
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
    location: v.optional(v.string()),
    withOthers: v.optional(v.boolean()),
    mood: v.optional(
      v.union(
        v.literal("terrible"),
        v.literal("poor"),
        v.literal("okay"),
        v.literal("good"),
        v.literal("excellent"),
      ),
    ),
    photoUrls: v.optional(v.array(v.string())),
    source: v.union(
      v.literal("manual"),
      v.literal("photo_recognition"),
      v.literal("barcode_scan"),
    ),
    confidence: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  returns: v.id("meals"),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email || ""))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    const now = Date.now();
    return await ctx.db.insert("meals", {
      userId: user._id,
      createdAt: now,
      updatedAt: now,
      name: args.name,
      type: args.type,
      mealTime: args.mealTime,
      foods: args.foods,
      totalNutrition: args.totalNutrition,
      location: args.location,
      withOthers: args.withOthers,
      mood: args.mood,
      photoUrls: args.photoUrls || [],
      source: args.source,
      confidence: args.confidence,
    });
  },
});

export const getUserMeals = query({
  args: {
    limit: v.optional(v.number()),
  },
  returns: v.array(
    v.object({
      _id: v.id("meals"),
      _creationTime: v.number(),
      name: v.optional(v.string()),
      type: v.string(),
      mealTime: v.number(),
      totalNutrition: v.object({
        calories: v.number(),
        protein: v.number(),
        carbs: v.number(),
        fat: v.number(),
      }),
      location: v.optional(v.string()),
      withOthers: v.optional(v.boolean()),
      mood: v.optional(v.string()),
      source: v.string(),
    }),
  ),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email || ""))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    const limit = args.limit || 10;
    const meals = await ctx.db
      .query("meals")
      .withIndex("by_user_date", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(limit);

    return meals.map((meal) => ({
      _id: meal._id,
      _creationTime: meal._creationTime,
      name: meal.name,
      type: meal.type,
      mealTime: meal.mealTime,
      totalNutrition: {
        calories: meal.totalNutrition.calories,
        protein: meal.totalNutrition.protein,
        carbs: meal.totalNutrition.carbs,
        fat: meal.totalNutrition.fat,
      },
      location: meal.location,
      withOthers: meal.withOthers,
      mood: meal.mood,
      source: meal.source,
    }));
  },
});

export const getMealById = query({
  args: {
    mealId: v.id("meals"),
  },
  returns: v.union(
    v.object({
      _id: v.id("meals"),
      _creationTime: v.number(),
      name: v.optional(v.string()),
      type: v.string(),
      mealTime: v.number(),
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
        }),
      ),
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
      location: v.optional(v.string()),
      withOthers: v.optional(v.boolean()),
      mood: v.optional(v.string()),
      photoUrls: v.array(v.string()),
      source: v.string(),
      confidence: v.optional(v.number()),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email || ""))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    const meal = await ctx.db.get(args.mealId);
    if (!meal || meal.userId !== user._id) {
      return null;
    }

    return meal;
  },
});
