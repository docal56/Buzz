import { v } from "convex/values";
import type { Doc } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { requireUserAndOrg } from "./lib/auth";

const STATUSES = [
  "new",
  "in-progress",
  "contractor-scheduled",
  "awaiting-follow-up",
  "closed",
] as const;

const statusValidator = v.union(
  v.literal("new"),
  v.literal("in-progress"),
  v.literal("contractor-scheduled"),
  v.literal("awaiting-follow-up"),
  v.literal("closed"),
);

type Status = (typeof STATUSES)[number];

export const listByStatus = query({
  args: {},
  handler: async (ctx) => {
    const { org } = await requireUserAndOrg(ctx);
    const rows = await ctx.db
      .query("issues")
      .withIndex("by_org", (q) => q.eq("orgId", org._id))
      .collect();
    const grouped: Record<Status, Doc<"issues">[]> = {
      new: [],
      "in-progress": [],
      "contractor-scheduled": [],
      "awaiting-follow-up": [],
      closed: [],
    };
    for (const issue of rows) {
      if (issue.softDeleted) continue;
      grouped[issue.status].push(issue);
    }
    return grouped;
  },
});

export const get = query({
  args: { id: v.id("issues") },
  handler: async (ctx, args) => {
    const { org } = await requireUserAndOrg(ctx);
    const issue = await ctx.db.get(args.id);
    if (!issue || issue.orgId !== org._id || issue.softDeleted) {
      throw new Error("Not found");
    }
    const primaryConversation = await ctx.db.get(issue.primaryConversationId);
    const timeline = await ctx.db
      .query("issueUpdates")
      .withIndex("by_issue", (q) => q.eq("issueId", issue._id))
      .order("asc")
      .collect();
    const filteredTimeline = timeline.filter((t) => !t.softDeleted);
    return {
      ...issue,
      primaryConversation,
      timeline: filteredTimeline,
    };
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("issues"),
    status: statusValidator,
  },
  handler: async (ctx, args) => {
    const { user, org } = await requireUserAndOrg(ctx);
    const issue = await ctx.db.get(args.id);
    if (!issue || issue.orgId !== org._id || issue.softDeleted) {
      throw new Error("Not found");
    }
    if (issue.status === args.status) return;
    const previous = issue.status;
    await ctx.db.patch(args.id, { status: args.status });
    await ctx.db.insert("issueUpdates", {
      orgId: org._id,
      issueId: args.id,
      kind: "status_change",
      authorUserId: user._id,
      metadata: { from: previous, to: args.status },
      dedupeKey: null,
      softDeleted: false,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("issues"),
    address: v.optional(v.union(v.string(), v.null())),
    contactName: v.optional(v.union(v.string(), v.null())),
    contactPhone: v.optional(v.union(v.string(), v.null())),
    contactEmail: v.optional(v.union(v.string(), v.null())),
    summary: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { org } = await requireUserAndOrg(ctx);
    const issue = await ctx.db.get(args.id);
    if (!issue || issue.orgId !== org._id || issue.softDeleted) {
      throw new Error("Not found");
    }

    const patch: Partial<Doc<"issues">> = {};
    if (args.address !== undefined) patch.address = args.address;
    if (args.contactName !== undefined) patch.contactName = args.contactName;
    if (args.contactPhone !== undefined) patch.contactPhone = args.contactPhone;
    if (args.contactEmail !== undefined) patch.contactEmail = args.contactEmail;
    if (args.summary !== undefined) patch.summary = args.summary;
    await ctx.db.patch(args.id, patch);
  },
});
