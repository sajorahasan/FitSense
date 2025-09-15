import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createHealthMetric = mutation({
  args: {
    type: v.union(
      v.literal("weight"),
      v.literal("heart_rate"),
      v.literal("blood_pressure"),
      v.literal("sleep"),
      v.literal("steps"),
      v.literal("body_fat"),
      v.literal("blood_sugar"),
      v.literal("temperature"),
      v.literal("oxygen_saturation"),
      v.literal("stress_level"),
    ),
    value: v.number(),
    unit: v.string(),
    timestamp: v.number(),
    duration: v.optional(v.number()),
    systolic: v.optional(v.number()),
    diastolic: v.optional(v.number()),
    quality: v.optional(
      v.union(
        v.literal("poor"),
        v.literal("fair"),
        v.literal("good"),
        v.literal("excellent"),
      ),
    ),
    deviceSource: v.optional(v.string()),
    location: v.optional(v.string()),
    accuracy: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  returns: v.id("healthMetrics"),
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
    return await ctx.db.insert("healthMetrics", {
      userId: user._id,
      createdAt: now,
      type: args.type,
      value: args.value,
      unit: args.unit,
      timestamp: args.timestamp,
      duration: args.duration,
      systolic: args.systolic,
      diastolic: args.diastolic,
      quality: args.quality,
      deviceSource: args.deviceSource,
      location: args.location,
      accuracy: args.accuracy,
    });
  },
});

export const getUserHealthMetrics = query({
  args: {
    limit: v.optional(v.number()),
    type: v.optional(
      v.union(
        v.literal("weight"),
        v.literal("heart_rate"),
        v.literal("blood_pressure"),
        v.literal("sleep"),
        v.literal("steps"),
        v.literal("body_fat"),
        v.literal("blood_sugar"),
        v.literal("temperature"),
        v.literal("oxygen_saturation"),
        v.literal("stress_level"),
      ),
    ),
  },
  returns: v.array(
    v.object({
      _id: v.id("healthMetrics"),
      _creationTime: v.number(),
      type: v.string(),
      value: v.number(),
      unit: v.string(),
      timestamp: v.number(),
      duration: v.optional(v.number()),
      systolic: v.optional(v.number()),
      diastolic: v.optional(v.number()),
      quality: v.optional(v.string()),
      location: v.optional(v.string()),
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
    let query = ctx.db
      .query("healthMetrics")
      .withIndex("by_user_date", (q) => q.eq("userId", user._id));

    if (args.type) {
      query = ctx.db
        .query("healthMetrics")
        .withIndex("by_user_type_date", (q) =>
          q.eq("userId", user._id).eq("type", args.type),
        );
    }

    const metrics = await query.order("desc").take(limit);

    return metrics.map((metric) => ({
      _id: metric._id,
      _creationTime: metric._creationTime,
      type: metric.type,
      value: metric.value,
      unit: metric.unit,
      timestamp: metric.timestamp,
      duration: metric.duration,
      systolic: metric.systolic,
      diastolic: metric.diastolic,
      quality: metric.quality,
      location: metric.location,
    }));
  },
});

export const getHealthMetricById = query({
  args: {
    metricId: v.id("healthMetrics"),
  },
  returns: v.union(
    v.object({
      _id: v.id("healthMetrics"),
      _creationTime: v.number(),
      type: v.string(),
      value: v.number(),
      unit: v.string(),
      timestamp: v.number(),
      duration: v.optional(v.number()),
      systolic: v.optional(v.number()),
      diastolic: v.optional(v.number()),
      quality: v.optional(v.string()),
      deviceSource: v.optional(v.string()),
      location: v.optional(v.string()),
      accuracy: v.optional(v.number()),
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

    const metric = await ctx.db.get(args.metricId);
    if (!metric || metric.userId !== user._id) {
      return null;
    }

    return metric;
  },
});

