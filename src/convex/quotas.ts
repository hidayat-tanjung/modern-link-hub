import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

const QUOTA_LIMIT = 5;
const RESET_MS = 3 * 24 * 60 * 60 * 1000; // 3 days

/**
 * Get the current user's quota status.
 * Returns { remaining, resetAt, count, limit, isAdmin }.
 */
export const status = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return { remaining: 0, resetAt: 0, count: 0, limit: QUOTA_LIMIT, isAdmin: false };
    }

    const user = await ctx.db.get(userId);
    const isAdmin = user?.role === "admin";
    if (isAdmin) {
      return { remaining: QUOTA_LIMIT, resetAt: 0, count: 0, limit: QUOTA_LIMIT, isAdmin: true };
    }

    const existing = await ctx.db
      .query("userQuotas")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (!existing) {
      return { remaining: QUOTA_LIMIT, resetAt: Date.now() + RESET_MS, count: 0, limit: QUOTA_LIMIT, isAdmin: false };
    }

    // Check if quota has reset
    if (Date.now() >= existing.resetAt) {
      return { remaining: QUOTA_LIMIT, resetAt: Date.now() + RESET_MS, count: 0, limit: QUOTA_LIMIT, isAdmin: false };
    }

    return {
      remaining: Math.max(0, QUOTA_LIMIT - existing.count),
      resetAt: existing.resetAt,
      count: existing.count,
      limit: QUOTA_LIMIT,
      isAdmin: false,
    };
  },
});
