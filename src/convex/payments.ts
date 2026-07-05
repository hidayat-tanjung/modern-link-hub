import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// ── Payment Methods (Admin CRUD) ──────────────────────────────────

/** List all payment methods (public — users need to see available methods). */
export const listMethods = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("paymentMethods")
      .collect()
      .then((ms) => ms.filter((m) => m.isActive));
  },
});

/** List all payment methods including inactive (admin only). */
export const listAllMethods = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    const user = await ctx.db.get(userId);
    if (user?.role !== "admin") return [];
    return await ctx.db.query("paymentMethods").collect();
  },
});

/** Create a payment method (admin only). */
export const createMethod = mutation({
  args: {
    name: v.string(),
    type: v.union(v.literal("bank"), v.literal("ewallet"), v.literal("paypal")),
    provider: v.string(),
    accountNumber: v.optional(v.string()),
    accountName: v.string(),
    logo: v.optional(v.string()),
    instructions: v.optional(v.string()),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const user = await ctx.db.get(userId);
    if (user?.role !== "admin") throw new Error("Not authorized");
    return await ctx.db.insert("paymentMethods", args);
  },
});

/** Update a payment method (admin only). */
export const updateMethod = mutation({
  args: {
    id: v.id("paymentMethods"),
    name: v.optional(v.string()),
    type: v.optional(v.union(v.literal("bank"), v.literal("ewallet"), v.literal("paypal"))),
    provider: v.optional(v.string()),
    accountNumber: v.optional(v.string()),
    accountName: v.optional(v.string()),
    logo: v.optional(v.string()),
    instructions: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const user = await ctx.db.get(userId);
    if (user?.role !== "admin") throw new Error("Not authorized");
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
    return { success: true };
  },
});

/** Delete a payment method (admin only). */
export const deleteMethod = mutation({
  args: { id: v.id("paymentMethods") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const user = await ctx.db.get(userId);
    if (user?.role !== "admin") throw new Error("Not authorized");
    await ctx.db.delete(args.id);
    return { success: true };
  },
});

// ── Payments ──────────────────────────────────────────────────────

/** Submit a new payment (authenticated user). */
export const submitPayment = mutation({
  args: {
    paymentMethodId: v.id("paymentMethods"),
    amount: v.number(),
    currency: v.string(),
    description: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Verify payment method exists
    const method = await ctx.db.get(args.paymentMethodId);
    if (!method) throw new Error("Payment method not found");

    return await ctx.db.insert("payments", {
      userId,
      paymentMethodId: args.paymentMethodId,
      amount: args.amount,
      currency: args.currency,
      description: args.description,
      status: "pending",
      notes: args.notes,
    });
  },
});

/** Get current user's payments. */
export const myPayments = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("payments")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(20);
  },
});

/** Get all payments (admin only). */
export const listAllPayments = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    const user = await ctx.db.get(userId);
    if (user?.role !== "admin") return [];

    const payments = await ctx.db
      .query("payments")
      .order("desc")
      .take(100);

    return Promise.all(
      payments.map(async (p) => {
        const method = await ctx.db.get(p.paymentMethodId);
        const user = p.userId ? await ctx.db.get(p.userId) : null;
        return {
          ...p,
          methodName: method?.name ?? "Unknown",
          methodType: method?.type ?? "bank",
          userName: user?.name ?? user?.email ?? "Anonymous",
        };
      }),
    );
  },
});

/** Update payment status (admin only). */
export const updateStatus = mutation({
  args: {
    paymentId: v.id("payments"),
    status: v.union(v.literal("pending"), v.literal("completed"), v.literal("failed"), v.literal("cancelled")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const user = await ctx.db.get(userId);
    if (user?.role !== "admin") throw new Error("Not authorized");
    await ctx.db.patch(args.paymentId, { status: args.status });
    return { success: true };
  },
});
