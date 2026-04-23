import { v } from "convex/values";
import type { Doc } from "./_generated/dataModel";
import {
  internalMutation,
  mutation,
  type QueryCtx,
  query,
} from "./_generated/server";

async function findByClerkId(
  ctx: QueryCtx,
  clerkId: string,
): Promise<Doc<"users"> | null> {
  return await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
    .unique();
}

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    return await findByClerkId(ctx, identity.subject);
  },
});

export const store = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const data = {
      clerkId: identity.subject,
      email: identity.email ?? "",
      firstName: identity.givenName ?? null,
      lastName: identity.familyName ?? null,
      imageUrl: identity.pictureUrl ?? null,
    };

    const existing = await findByClerkId(ctx, identity.subject);
    if (existing) {
      if (
        existing.email !== data.email ||
        existing.firstName !== data.firstName ||
        existing.lastName !== data.lastName ||
        existing.imageUrl !== data.imageUrl
      ) {
        await ctx.db.patch(existing._id, data);
      }
      return existing._id;
    }

    return await ctx.db.insert("users", { ...data, softDeleted: false });
  },
});

export const upsertFromClerk = internalMutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    firstName: v.union(v.string(), v.null()),
    lastName: v.union(v.string(), v.null()),
    imageUrl: v.union(v.string(), v.null()),
  },
  handler: async (ctx, args) => {
    const existing = await findByClerkId(ctx, args.clerkId);
    if (existing) {
      await ctx.db.patch(existing._id, { ...args, softDeleted: false });
      return existing._id;
    }
    return await ctx.db.insert("users", { ...args, softDeleted: false });
  },
});

export const softDeleteFromClerk = internalMutation({
  args: { clerkId: v.string() },
  handler: async (ctx, { clerkId }) => {
    const existing = await findByClerkId(ctx, clerkId);
    if (!existing) return;
    await ctx.db.patch(existing._id, { softDeleted: true });
  },
});
