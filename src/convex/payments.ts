import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { createNotification } from "./notifications";
import { api } from "./_generated/api";

// Simple number formatting that works in all Convex runtimes
function formatAmount(amount: number): string {
  const s = String(amount);
  return "Rp" + s.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

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

// ── File Upload ───────────────────────────────────────────────────

/** Generate a one-time upload URL for proof-of-payment images. */
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    return await ctx.storage.generateUploadUrl();
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
    proofStorageId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Verify payment method exists
    const method = await ctx.db.get(args.paymentMethodId);
    if (!method) throw new Error("Payment method not found");

    // Convert storage ID to URL if provided
    let proofUrl: string | undefined;
    if (args.proofStorageId) {
      const storageId = args.proofStorageId as any;
      proofUrl = (await ctx.storage.getUrl(storageId)) ?? undefined;
    }

    return await ctx.db.insert("payments", {
      userId,
      paymentMethodId: args.paymentMethodId,
      amount: args.amount,
      currency: args.currency,
      description: args.description,
      status: "pending",
      proofUrl,
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

/** Update payment status (admin only) — also creates a notification for the user. */
export const updateStatus = mutation({
  args: {
    paymentId: v.id("payments"),
    status: v.union(v.literal("pending"), v.literal("completed"), v.literal("failed"), v.literal("cancelled")),
  },
  handler: async (ctx, args) => {
    const adminId = await getAuthUserId(ctx);
    if (!adminId) throw new Error("Not authenticated");
    const admin = await ctx.db.get(adminId);
    if (admin?.role !== "admin") throw new Error("Not authorized");

    // Update payment status
    await ctx.db.patch(args.paymentId, { status: args.status });

    // Fetch payment details for the notification
    const payment = await ctx.db.get(args.paymentId);
    if (payment?.userId) {
      const method = payment.paymentMethodId ? await ctx.db.get(payment.paymentMethodId) : null;
      const amountFormatted = formatAmount(payment.amount);

      const notificationType =
        args.status === "completed" ? "payment_completed" :
        args.status === "failed" ? "payment_failed" :
        args.status === "cancelled" ? "payment_cancelled" :
        "info";

      const title =
        args.status === "completed" ? "Payment Approved! 🎉" :
        args.status === "failed" ? "Payment Rejected" :
        "Payment Cancelled";

      const message =
        args.status === "completed"
          ? `Your payment of ${amountFormatted} for "${payment.description}" has been approved.`
          : args.status === "failed"
          ? `Your payment of ${amountFormatted} for "${payment.description}" has been rejected. Please contact support.`
          : `Your payment of ${amountFormatted} for "${payment.description}" has been cancelled.`;

      await createNotification(ctx, payment.userId, notificationType, title, message, "/payment");

      // Also attempt to send email notification (fire-and-forget)
      ctx.scheduler.runAfter(0, api.email.sendPaymentEmail as any, {
        userId: payment.userId,
        type: notificationType,
        amount: payment.amount,
        currency: payment.currency ?? "IDR",
        description: payment.description,
      });
    }

    return { success: true };
  },
});
