import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

export const log = internalMutation({
  args: {
    provider: v.string(),
    eventType: v.string(),
    providerConversationId: v.union(v.string(), v.null()),
    orgId: v.union(v.id("orgs"), v.null()),
    status: v.union(v.literal("ignored"), v.literal("error")),
    errorMessage: v.string(),
    rawPayloadStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("webhookEvents", args);
  },
});
