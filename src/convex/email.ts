import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";

/**
 * Send a payment notification email via Resend.
 * Requires RESEND_API_KEY to be set in the environment.
 * Falls back silently if not configured.
 */
export const sendPaymentEmail = action({
  args: {
    userId: v.id("users"),
    type: v.union(
      v.literal("payment_completed"),
      v.literal("payment_failed"),
      v.literal("payment_cancelled"),
    ),
    amount: v.number(),
    currency: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.log("Resend API key not configured — skipping email notification");
      return { sent: false, reason: "No API key" };
    }

    // Get user email
    const user = await ctx.runQuery(api.users.getUserById, {
      userId: args.userId,
    });
    if (!user?.email) {
      console.log("User has no email — skipping email notification");
      return { sent: false, reason: "No email" };
    }

    const subject =
      args.type === "payment_completed"
        ? "Payment Approved! ✅"
        : args.type === "payment_failed"
        ? "Payment Rejected ❌"
        : "Payment Cancelled";

    const statusLine =
      args.type === "payment_completed"
        ? "Your payment has been approved."
        : args.type === "payment_failed"
        ? "Your payment has been rejected."
        : "Your payment has been cancelled.";

    const amountFormatted = `${args.currency === "IDR" ? "Rp" : ""}${args.amount.toLocaleString("id-ID")}`;

    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "PixelForge <noreply@pixelforge.app>",
          to: user.email,
          subject,
          html: `
            <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
              <div style="text-align: center; margin-bottom: 24px;">
                <h1 style="font-size: 24px; margin: 0;">PixelForge</h1>
              </div>
              <div style="background: #f9fafb; border-radius: 12px; padding: 24px;">
                <h2 style="font-size: 18px; margin: 0 0 8px;">${subject}</h2>
                <p style="color: #6b7280; margin: 0 0 16px;">${statusLine}</p>
                <div style="background: white; border-radius: 8px; padding: 16px;">
                  <p style="margin: 0 0 4px; font-size: 14px; color: #6b7280;">Amount</p>
                  <p style="margin: 0 0 12px; font-size: 20px; font-weight: 700;">${amountFormatted}</p>
                  <p style="margin: 0 0 4px; font-size: 14px; color: #6b7280;">Description</p>
                  <p style="margin: 0 0 12px; font-size: 14px;">${args.description}</p>
                  <p style="margin: 0 0 4px; font-size: 14px; color: #6b7280;">Status</p>
                  <p style="margin: 0; font-size: 14px; font-weight: 600; color: ${
                    args.type === "payment_completed" ? "#059669" : "#dc2626"
                  };">
                    ${args.type === "payment_completed" ? "Approved" : args.type === "payment_failed" ? "Rejected" : "Cancelled"}
                  </p>
                </div>
              </div>
            </div>
          `,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        console.error("Resend API error:", err);
        return { sent: false, reason: err };
      }

      return { sent: true };
    } catch (err) {
      console.error("Failed to send email:", err);
      return { sent: false, reason: String(err) };
    }
  },
});
