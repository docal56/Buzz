import { httpRouter } from "convex/server";
import { handleClerkWebhook } from "./clerk/webhook";

const http = httpRouter();

http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: handleClerkWebhook,
});

export default http;
