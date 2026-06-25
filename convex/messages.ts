import { query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async () => {
    return [
      {
        id: "welcome",
        text: "Buzz is connected to Convex.",
      },
    ];
  },
});
