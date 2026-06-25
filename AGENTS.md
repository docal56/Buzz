# Agent Instructions for Buzz

## Product Context

Buzz is a product-led app being built with Next.js for the frontend and Convex for the backend.

The high-level product brief and implementation tickets live in Linear:

https://linear.app/buzz-ai/project/buzz-app-9949ecfb91be/overview

Before starting any meaningful implementation work, read the relevant Linear ticket and the project brief. Treat Linear as the source of truth for what is being built and why.

## Working With the User

The user is non-technical but experienced in product and design.

Use plain English. Avoid assuming the user understands code, architecture patterns, infrastructure, or engineering jargon.

Keep the user in control of product and UX decisions. Explain technical tradeoffs clearly, then recommend a path when useful.

Do not silently invent requirements. If a product, UX, or scope decision is missing, flag it and ask before locking it in.

For complex work, give a short plan before making changes. Break work into clear steps and call out important risks early.

## How Agents Should Work

Work from Linear tickets whenever possible. A ticket should define the user need, intended outcome, and acceptance criteria.

If a ticket is ambiguous, identify what is unclear in plain English. Separate facts, assumptions, recommendations, and open questions.

Stay within the requested scope. Do not add extra features, broad refactors, or visual redesigns unless the ticket or user explicitly asks for them.

Make small, focused changes that another coding agent can easily understand later.

After implementation, summarize what changed, what was verified, and what still needs attention.

## Codebase Principles

This project uses:

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui for the design system
- Clerk for accounts, authentication, and organizations
- Convex backend functions
- Vercel hosting

Prefer established framework patterns over custom infrastructure.

Keep frontend UI code in `src/app` unless a clearer structure is introduced intentionally.

Use shadcn/ui components from `src/components/ui` as the default building blocks for interface work. Do not create one-off versions of common controls such as buttons, inputs, dialogs, tabs, menus, badges, cards, sheets, separators, or loading skeletons unless there is a clear product reason.

Use the shared `cn` helper from `src/lib/utils` for conditional class names.

Keep Convex backend functions in `convex`.

Do not edit generated Convex files in `convex/_generated` by hand. Regenerate them by running Convex commands.

Do not commit local secrets or environment files. `.env.local` is intentionally ignored.

## Next.js Notes

This repo uses a recent version of Next.js. APIs and conventions may differ from older examples or model training data.

Before making framework-level changes, check the current local docs or official docs for the installed version.

Prefer App Router patterns. Avoid adding a Pages Router unless there is a strong reason.

## Design System Notes

Buzz uses shadcn/ui with Tailwind CSS variables in `src/app/globals.css`.

Installed starter components include:

- `button`
- `card`
- `input`
- `label`
- `textarea`
- `dialog`
- `dropdown-menu`
- `tabs`
- `badge`
- `separator`
- `sheet`
- `skeleton`

When a ticket needs another standard component, add it with:

```bash
npx shadcn@latest add component-name
```

Respect the user's product and UX direction. shadcn/ui provides the component foundation, not the final product design.

## Convex Notes

Use Convex for backend data, server functions, and realtime behavior.

Convex is configured to validate Clerk auth tokens in `convex/auth.config.ts`. Clerk's Convex integration expects the JWT template/audience named `convex`.

Run Convex locally with:

```bash
npm run convex:dev
```

Convex local deployment settings are stored in `.env.local`.

The current local Convex deployment also needs `CLERK_FRONTEND_API_URL` set as a Convex backend environment variable. Production will need the equivalent production Clerk Frontend API URL set on the production Convex deployment.

For Vercel production deploys with Convex, the build command should be:

```bash
npx convex deploy --cmd 'npm run build'
```

Vercel also needs a `CONVEX_DEPLOY_KEY` environment variable generated from the Convex dashboard.

## Clerk Notes

Use Clerk for user accounts, sessions, and team/workspace organizations.

This project is linked to the Clerk application `Buzz New`.

Use Clerk's built-in components for the first version of auth UI unless a ticket explicitly asks for a custom auth experience.

ClerkProvider wraps the app in `src/app/layout.tsx`. Convex must stay inside ClerkProvider so Convex can access Clerk session context.

The project uses Clerk's shadcn theme from `@clerk/ui` so auth screens match the shadcn/ui design system.

Do not expose `CLERK_SECRET_KEY` in client code, logs, screenshots, or committed files.

For local development, Clerk keys are stored in `.env.local`, which is intentionally ignored.

For production on Vercel, add:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_CONVEX_URL`
- `CONVEX_DEPLOY_KEY`

## Verification

Before presenting work as complete, run the relevant checks:

```bash
npm run lint
npm run build
```

For visible UI changes, also run the app locally and inspect the screen in a browser:

```bash
npm run dev
```

If any check is skipped, explain why and what risk remains.
