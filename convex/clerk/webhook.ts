import type { WebhookEvent } from "@clerk/backend";
import { Webhook } from "svix";
import { internal } from "../_generated/api";
import { httpAction } from "../_generated/server";

function getPrimaryEmail(data: {
  email_addresses: { id: string; email_address: string }[];
  primary_email_address_id: string | null;
}): string {
  const primary = data.email_addresses.find(
    (e) => e.id === data.primary_email_address_id,
  );
  return primary?.email_address ?? data.email_addresses[0]?.email_address ?? "";
}

export const handleClerkWebhook = httpAction(async (ctx, request) => {
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) {
    console.error("CLERK_WEBHOOK_SECRET is not set on the Convex deployment");
    return new Response("Server misconfigured", { status: 500 });
  }

  const svixId = request.headers.get("svix-id");
  const svixTimestamp = request.headers.get("svix-timestamp");
  const svixSignature = request.headers.get("svix-signature");
  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Missing svix headers", { status: 401 });
  }

  const body = await request.text();
  let event: WebhookEvent;
  try {
    event = new Webhook(secret).verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Clerk webhook verification failed", err);
    return new Response("Invalid signature", { status: 401 });
  }

  switch (event.type) {
    case "user.created":
    case "user.updated": {
      await ctx.runMutation(internal.users.upsertFromClerk, {
        clerkId: event.data.id,
        email: getPrimaryEmail(event.data),
        firstName: event.data.first_name ?? null,
        lastName: event.data.last_name ?? null,
        imageUrl: event.data.image_url ?? null,
      });
      break;
    }
    case "user.deleted": {
      if (event.data.id) {
        await ctx.runMutation(internal.users.softDeleteFromClerk, {
          clerkId: event.data.id,
        });
      }
      break;
    }
    case "organization.created":
    case "organization.updated": {
      await ctx.runMutation(internal.orgs.upsertFromClerk, {
        clerkId: event.data.id,
        name: event.data.name ?? null,
        slug: event.data.slug ?? null,
        imageUrl: event.data.image_url ?? null,
      });
      break;
    }
    case "organization.deleted": {
      if (event.data.id) {
        await ctx.runMutation(internal.orgs.softDeleteFromClerk, {
          clerkId: event.data.id,
        });
      }
      break;
    }
    case "organizationMembership.created":
    case "organizationMembership.updated": {
      await ctx.runMutation(internal.orgs.upsertMembershipFromClerk, {
        clerkUserId: event.data.public_user_data.user_id,
        clerkOrgId: event.data.organization.id,
        role: event.data.role,
      });
      break;
    }
    case "organizationMembership.deleted": {
      await ctx.runMutation(internal.orgs.deleteMembershipFromClerk, {
        clerkUserId: event.data.public_user_data.user_id,
        clerkOrgId: event.data.organization.id,
      });
      break;
    }
    default:
      console.log(`Unhandled Clerk event: ${event.type}`);
  }

  return new Response(null, { status: 200 });
});
