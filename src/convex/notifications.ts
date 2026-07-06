import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// ── Queries ───────────────────────────────────────────────────────

/** Get unread notifications for the current user. */
export const unread = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("notifications")
      .withIndex("by_user_read", (q) => q.eq("userId", userId).eq("read", false))
      .order("desc")
      .take(50);
  },
});

/** Get recent notifications (read + unread) for the current user. */
export const recent = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(20);
  },
});

// ── Mutations ─────────────────────────────────────────────────────

/** Mark a single notification as read. */
export const markRead = mutation({
  args: { notificationId: v.id("notifications") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const notif = await ctx.db.get(args.notificationId);
    if (!notif || notif.userId !== userId) throw new Error("Not found");

    await ctx.db.patch(args.notificationId, { read: true });
    return { success: true };
  },
});

/** Mark all notifications as read for the current user. */
export const markAllRead = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const unreadNotifs = await ctx.db
      .query("notifications")
      .withIndex("by_user_read", (q) => q.eq("userId", userId).eq("read", false))
      .collect();

    await Promise.all(
      unreadNotifs.map((n) => ctx.db.patch(n._id, { read: true })),
    );
    return { success: true };
  },
});

// ── Helper (exported for use in other mutations) ──────────────────

type NotificationType = "payment_completed" | "payment_failed" | "payment_cancelled" | "info";

export async function createNotification(
  ctx: any,
  userId: string,
  type: NotificationType,
  title: string,
  message: string,
  link?: string,
) {
  await ctx.db.insert("notifications", {
    userId,
    type,
    title,
    message,
    link,
    read: false,
  });
}
