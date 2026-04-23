import { v } from "convex/values";
import type { Doc } from "./_generated/dataModel";
import {
  internalMutation,
  type MutationCtx,
  type QueryCtx,
} from "./_generated/server";

async function findByClerkId(
  ctx: QueryCtx,
  clerkId: string,
): Promise<Doc<"orgs"> | null> {
  return await ctx.db
    .query("orgs")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
    .unique();
}

export const upsertFromClerk = internalMutation({
  args: {
    clerkId: v.string(),
    name: v.union(v.string(), v.null()),
    slug: v.union(v.string(), v.null()),
    imageUrl: v.union(v.string(), v.null()),
  },
  handler: async (ctx, args) => {
    const existing = await findByClerkId(ctx, args.clerkId);
    if (existing) {
      await ctx.db.patch(existing._id, { ...args, softDeleted: false });
      return existing._id;
    }
    return await ctx.db.insert("orgs", { ...args, softDeleted: false });
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

async function resolveMembership(
  ctx: MutationCtx,
  clerkUserId: string,
  clerkOrgId: string,
) {
  const user = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkUserId))
    .unique();
  const org = await ctx.db
    .query("orgs")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkOrgId))
    .unique();
  if (!user || !org) return null;

  const membership = await ctx.db
    .query("orgMembers")
    .withIndex("by_user_and_org", (q) =>
      q.eq("userId", user._id).eq("orgId", org._id),
    )
    .unique();
  return { user, org, membership };
}

export const upsertMembershipFromClerk = internalMutation({
  args: {
    clerkUserId: v.string(),
    clerkOrgId: v.string(),
    role: v.string(),
  },
  handler: async (ctx, { clerkUserId, clerkOrgId, role }) => {
    const resolved = await resolveMembership(ctx, clerkUserId, clerkOrgId);
    if (!resolved) {
      console.warn(
        `Skipping membership upsert; user or org not yet synced (user=${clerkUserId}, org=${clerkOrgId})`,
      );
      return;
    }
    const { user, org, membership } = resolved;
    if (membership) {
      if (membership.role !== role)
        await ctx.db.patch(membership._id, { role });
      return membership._id;
    }
    return await ctx.db.insert("orgMembers", {
      userId: user._id,
      orgId: org._id,
      role,
    });
  },
});

export const deleteMembershipFromClerk = internalMutation({
  args: { clerkUserId: v.string(), clerkOrgId: v.string() },
  handler: async (ctx, { clerkUserId, clerkOrgId }) => {
    const resolved = await resolveMembership(ctx, clerkUserId, clerkOrgId);
    if (!resolved?.membership) return;
    await ctx.db.delete(resolved.membership._id);
  },
});
