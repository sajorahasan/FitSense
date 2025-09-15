import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createWorkout = mutation({
  args: {
    name: v.string(),
    type: v.union(
      v.literal("cardio"),
      v.literal("strength"),
      v.literal("flexibility"),
      v.literal("sports"),
      v.literal("other")
    ),
    startTime: v.number(),
    endTime: v.number(),
    duration: v.optional(v.number()),
    mood: v.union(
      v.literal("terrible"),
      v.literal("poor"),
      v.literal("okay"),
      v.literal("good"),
      v.literal("excellent")
    ),
    perceivedEffort: v.union(
      v.literal(1),
      v.literal(2),
      v.literal(3),
      v.literal(4),
      v.literal(5),
      v.literal(6),
      v.literal(7),
      v.literal(8),
      v.literal(9),
      v.literal(10)
    ),
    notes: v.optional(v.string()),
    location: v.optional(v.string()),
    indoor: v.boolean(),
    exercises: v.optional(v.array(v.object({
      id: v.string(),
      name: v.string(),
      category: v.optional(v.string()),
      sets: v.optional(v.array(v.object({
        reps: v.optional(v.number()),
        weight: v.optional(v.number()),
        duration: v.optional(v.number()),
        restTime: v.optional(v.number()),
        completed: v.boolean(),
      }))),
      duration: v.optional(v.number()),
      distance: v.optional(v.number()),
      notes: v.optional(v.string()),
      difficulty: v.optional(v.union(
        v.literal("easy"),
        v.literal("moderate"),
        v.literal("hard")
      )),
    }))),
    totalCalories: v.optional(v.number()),
    averageHeartRate: v.optional(v.number()),
    maxHeartRate: v.optional(v.number()),
    weather: v.optional(v.string()),
  },
  returns: v.id("workouts"),
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
    return await ctx.db.insert("workouts", {
      userId: user._id,
      createdAt: now,
      updatedAt: now,
      name: args.name,
      type: args.type,
      startTime: args.startTime,
      endTime: args.endTime,
      duration: args.duration,
      mood: args.mood,
      perceivedEffort: args.perceivedEffort,
      notes: args.notes,
      location: args.location,
      indoor: args.indoor,
      exercises: args.exercises || [],
      totalCalories: args.totalCalories,
      averageHeartRate: args.averageHeartRate,
      maxHeartRate: args.maxHeartRate,
      weather: args.weather,
    });
  },
});

export const getUserWorkouts = query({
  args: {
    limit: v.optional(v.number()),
  },
  returns: v.array(v.object({
    _id: v.id("workouts"),
    _creationTime: v.number(),
    name: v.string(),
    type: v.string(),
    startTime: v.number(),
    endTime: v.optional(v.number()),
    duration: v.optional(v.number()),
    mood: v.string(),
    perceivedEffort: v.number(),
    notes: v.optional(v.string()),
    location: v.optional(v.string()),
    indoor: v.boolean(),
    totalCalories: v.optional(v.number()),
  })),
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
    const workouts = await ctx.db
      .query("workouts")
      .withIndex("by_user_date", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(limit);

    return workouts.map(workout => ({
      _id: workout._id,
      _creationTime: workout._creationTime,
      name: workout.name,
      type: workout.type,
      startTime: workout.startTime,
      endTime: workout.endTime,
      duration: workout.duration,
      mood: workout.mood,
      perceivedEffort: workout.perceivedEffort,
      notes: workout.notes,
      location: workout.location,
      indoor: workout.indoor,
      totalCalories: workout.totalCalories,
    }));
  },
});

export const getWorkoutById = query({
  args: {
    workoutId: v.id("workouts"),
  },
  returns: v.union(
    v.object({
      _id: v.id("workouts"),
      _creationTime: v.number(),
      name: v.string(),
      type: v.string(),
      startTime: v.number(),
      endTime: v.optional(v.number()),
      duration: v.optional(v.number()),
      mood: v.string(),
      perceivedEffort: v.number(),
      notes: v.optional(v.string()),
      location: v.optional(v.string()),
      indoor: v.boolean(),
      exercises: v.array(v.object({
        id: v.string(),
        name: v.string(),
        category: v.optional(v.string()),
        sets: v.optional(v.array(v.object({
          reps: v.optional(v.number()),
          weight: v.optional(v.number()),
          duration: v.optional(v.number()),
          restTime: v.optional(v.number()),
          completed: v.boolean(),
        }))),
        duration: v.optional(v.number()),
        distance: v.optional(v.number()),
        notes: v.optional(v.string()),
        difficulty: v.optional(v.union(
          v.literal("easy"),
          v.literal("moderate"),
          v.literal("hard")
        )),
      })),
      totalCalories: v.optional(v.number()),
      averageHeartRate: v.optional(v.number()),
      maxHeartRate: v.optional(v.number()),
      weather: v.optional(v.string()),
    }),
    v.null()
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

    const workout = await ctx.db.get(args.workoutId);
    if (!workout || workout.userId !== user._id) {
      return null;
    }

    return workout;
  },
});
