# Claude Instructions for Buzz

Follow the full project guidance in `AGENTS.md`.

## Key Context

The user is non-technical but highly experienced in product and design. Explain technical choices in plain English and keep product and UX decisions with the user.

Use the Linear project as the source of truth for product context, tickets, and acceptance criteria:

https://linear.app/buzz-ai/project/buzz-app-9949ecfb91be/overview

Do not begin substantial implementation work without checking the relevant Linear ticket and project brief.

## Build Approach

This project uses Next.js, TypeScript, Tailwind CSS, shadcn/ui, Clerk, Convex, and Vercel.

Keep changes small, scoped, and easy for other coding agents to continue.

Use shadcn/ui components from `src/components/ui` as the default interface building blocks. Do not invent custom buttons, inputs, dialogs, cards, menus, tabs, sheets, badges, separators, or skeleton loaders when an existing shadcn component fits.

Use Clerk for authentication, accounts, and organizations. Keep `ClerkProvider` above the Convex provider. Never expose Clerk secret keys.

Do not invent missing requirements. If something is unclear, state the assumption or ask a concise question.

Before calling work complete, run:

```bash
npm run lint
npm run build
```

For UI changes, also verify the app in a browser.
