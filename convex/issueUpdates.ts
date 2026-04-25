import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { requireUserAndOrg } from "./lib/auth";

export const addComment = mutation({
  args: {
    issueId: v.id("issues"),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    const { user, org } = await requireUserAndOrg(ctx);
    const issue = await ctx.db.get(args.issueId);
    if (!issue || issue.orgId !== org._id || issue.softDeleted) {
      throw new Error("Not found");
    }
    const trimmed = args.body.trim();
    if (trimmed.length === 0) throw new Error("Empty comment");
    await ctx.db.insert("issueUpdates", {
      orgId: org._id,
      issueId: args.issueId,
      kind: "comment",
      authorUserId: user._id,
      body: trimmed,
      dedupeKey: null,
      softDeleted: false,
    });
  },
});
