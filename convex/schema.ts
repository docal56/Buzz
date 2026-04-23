import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    firstName: v.union(v.string(), v.null()),
    lastName: v.union(v.string(), v.null()),
    imageUrl: v.union(v.string(), v.null()),
    softDeleted: v.boolean(),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_email", ["email"]),

  orgs: defineTable({
    clerkId: v.string(),
    name: v.union(v.string(), v.null()),
    slug: v.union(v.string(), v.null()),
    imageUrl: v.union(v.string(), v.null()),
    softDeleted: v.boolean(),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_slug", ["slug"]),

  orgMembers: defineTable({
    userId: v.id("users"),
    orgId: v.id("orgs"),
    role: v.string(),
  })
    .index("by_user", ["userId"])
    .index("by_org", ["orgId"])
    .index("by_user_and_org", ["userId", "orgId"]),
});
