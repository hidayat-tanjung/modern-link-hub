import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

/**
 * Record a new image generation.
 */
export const record = mutation({
  args: {
    prompt: v.string(),
    style: v.string(),
    styleValue: v.string(),
    imageUrl: v.string(),
    metadata: v.object({
      categories: v.array(v.string()),
      description: v.string(),
      stockCategories: v.array(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    return await ctx.db.insert("generations", {
      userId: userId ?? undefined,
      prompt: args.prompt,
      style: args.style,
      styleValue: args.styleValue,
      imageUrl: args.imageUrl,
      metadata: args.metadata,
    });
  },
});

/**
 * Get recent generations for the current user (or all if admin).
 */
export const recent = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const user = await ctx.db.get(userId);
    const isAdmin = user?.role === "admin";

    if (isAdmin) {
      return await ctx.db
        .query("generations")
        .order("desc")
        .take(20);
    }

    return await ctx.db
      .query("generations")
      .withIndex("by_user_created", (q) => q.eq("userId", userId))
      .order("desc")
      .take(20);
  },
});

/**
 * Get stats for the current user's dashboard.
 */
export const stats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return { totalGenerations: 0, todayGenerations: 0, storageEstimate: "0 MB" };
    }

    const user = await ctx.db.get(userId);
    const isAdmin = user?.role === "admin";

    const allGenerations = isAdmin
      ? await ctx.db.query("generations").collect()
      : await ctx.db
          .query("generations")
          .withIndex("by_user", (q) => q.eq("userId", userId))
          .collect();

    const totalGenerations = allGenerations.length;

    // Today's generations
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const startOfDayMs = startOfDay.getTime();

    const todayGenerations = allGenerations.filter(
      (g) => g._creationTime >= startOfDayMs,
    ).length;

    // Rough storage estimate (each image ~200KB avg for Pollinations URLs)
    const storageBytes = totalGenerations * 200 * 1024;
    const storageEstimate =
      storageBytes < 1024 * 1024
        ? `${Math.round(storageBytes / 1024)} KB`
        : `${(storageBytes / (1024 * 1024)).toFixed(1)} MB`;

    return { totalGenerations, todayGenerations, storageEstimate };
  },
});
