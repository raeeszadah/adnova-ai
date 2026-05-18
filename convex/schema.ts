import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.optional(v.string()),
    name: v.optional(v.string()),
    email: v.string(),
    credits: v.number(),
    plan: v.optional(v.string()),
    picture: v.optional(v.string()),
    role: v.optional(v.union(v.literal("user"), v.literal("admin"))),
    suspended: v.optional(v.boolean()),
  })
    .index("by_clerkId", ["clerkId"])
    .index("by_email", ["email"])
    .index("by_role", ["role"]),

  videos: defineTable({
    userId: v.id("users"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    script: v.optional(v.string()),
    productImageUrl: v.optional(v.string()),
    productStorageId: v.optional(v.id("_storage")),
    avatarVideoUrl: v.optional(v.string()),
    finalVideoUrl: v.optional(v.string()),
    finalStorageId: v.optional(v.id("_storage")),
    avatarId: v.optional(v.string()),
    voiceId: v.optional(v.string()),
    heygenVideoId: v.optional(v.string()),
    status: v.string(),
    errorMessage: v.optional(v.string()),
  })
    .index("by_userId", ["userId"])
    .index("by_status", ["status"]),

  payments: defineTable({
    userId: v.id("users"),
    stripeId: v.optional(v.string()),
    plan: v.string(),
    status: v.string(),
    amount: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_stripeId", ["stripeId"]),

  apiLogs: defineTable({
    requestId: v.string(),
    apiType: v.string(),
    status: v.string(),
    processingTime: v.number(),
    userId: v.optional(v.id("users")),
    videoId: v.optional(v.id("videos")),
    message: v.optional(v.string()),
  })
    .index("by_apiType", ["apiType"])
    .index("by_status", ["status"]),

  adminAuditLog: defineTable({
    adminClerkId: v.string(),
    action: v.string(),
    targetUserId: v.optional(v.id("users")),
    details: v.optional(v.string()),
  }).index("by_adminClerkId", ["adminClerkId"]),
});
