import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

/**
 * Get all users (admin only).
 */
export const listUsers = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    const user = await ctx.db.get(userId);
    if (user?.role !== "admin") return [];

    const users = await ctx.db.query("users").collect();
    return Promise.all(
      users.map(async (u) => {
        const quota = await ctx.db
          .query("userQuotas")
          .withIndex("by_user", (q) => q.eq("userId", u._id))
          .unique();
        const genCount = (
          await ctx.db
            .query("generations")
            .withIndex("by_user", (q) => q.eq("userId", u._id))
            .collect()
        ).length;
        return {
          _id: u._id,
          name: u.name,
          email: u.email,
          image: u.image,
          role: u.role,
          isAnonymous: u.isAnonymous,
          generations: genCount,
          quotaCount: quota?.count ?? 0,
          quotaLimit: 5,
        };
      }),
    );
  },
});

/**
 * Get global platform stats (admin only).
 */
export const globalStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const user = await ctx.db.get(userId);
    if (user?.role !== "admin") return null;

    const allUsers = await ctx.db.query("users").collect();
    const allGenerations = await ctx.db.query("generations").collect();
    const allQuotas = await ctx.db.query("userQuotas").collect();

    const totalUsers = allUsers.length;
    const totalGenerations = allGenerations.length;
    const activeQuotas = allQuotas.filter((q) => Date.now() < q.resetAt).length;

    // Today's generations
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const todayGenerations = allGenerations.filter(
      (g) => g._creationTime >= startOfDay.getTime(),
    ).length;

    // Recent generations (last 50)
    const recentGenerations = await ctx.db
      .query("generations")
      .order("desc")
      .take(50);

    return {
      totalUsers,
      totalGenerations,
      todayGenerations,
      activeQuotas,
      recentGenerations,
    };
  },
});

/**
 * Update a user's role (admin only).
 */
export const setUserRole = mutation({
  args: {
    userId: v.id("users"),
    role: v.union(v.literal("admin"), v.literal("user"), v.literal("member")),
  },
  handler: async (ctx, args) => {
    const callerId = await getAuthUserId(ctx);
    if (!callerId) throw new Error("Not authenticated");
    const caller = await ctx.db.get(callerId);
    if (caller?.role !== "admin") throw new Error("Not authorized");

    await ctx.db.patch(args.userId, { role: args.role });
    return { success: true };
  },
});
