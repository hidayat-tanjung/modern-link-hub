import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove

      role: v.optional(roleValidator), // role of the user. do not remove
    }).index("email", ["email"]), // index for the email. do not remove or modify

    userQuotas: defineTable({
      userId: v.id("users"),
      count: v.number(),
      resetAt: v.number(),
    }).index("by_user", ["userId"]),

    generations: defineTable({
      userId: v.optional(v.id("users")),
      prompt: v.string(),
      style: v.string(),
      styleValue: v.string(),
      imageUrl: v.string(),
      metadata: v.object({
        categories: v.array(v.string()),
        description: v.string(),
        stockCategories: v.array(v.string()),
      }),
    }).index("by_user", ["userId"]).index("by_user_created", ["userId", "_creationTime"]),

    paymentMethods: defineTable({
      name: v.string(),
      type: v.union(v.literal("bank"), v.literal("ewallet"), v.literal("paypal")),
      provider: v.string(),
      accountNumber: v.optional(v.string()),
      accountName: v.string(),
      logo: v.optional(v.string()),
      instructions: v.optional(v.string()),
      isActive: v.boolean(),
    }),

    payments: defineTable({
      userId: v.optional(v.id("users")),
      paymentMethodId: v.id("paymentMethods"),
      amount: v.number(),
      currency: v.string(),
      description: v.string(),
      status: v.union(v.literal("pending"), v.literal("completed"), v.literal("failed"), v.literal("cancelled")),
      proofUrl: v.optional(v.string()),
      notes: v.optional(v.string()),
    }).index("by_user", ["userId"]).index("by_status", ["status"]),

    notifications: defineTable({
      userId: v.id("users"),
      type: v.union(v.literal("payment_completed"), v.literal("payment_failed"), v.literal("payment_cancelled"), v.literal("info")),
      title: v.string(),
      message: v.string(),
      link: v.optional(v.string()),
      read: v.boolean(),
    }).index("by_user", ["userId"]).index("by_user_read", ["userId", "read"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;
