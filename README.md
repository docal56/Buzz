# Buzz

Buzz is a Next.js app with Convex set up for the backend.

The UI foundation uses shadcn/ui with Tailwind CSS.

Authentication and team accounts use Clerk.

## Local Development

Install dependencies:

```bash
npm install
```

Start Convex in one terminal:

```bash
npm run convex:dev
```

Start Next.js in another terminal:

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Convex

This repo currently uses a local Convex deployment. To connect it to your Convex account and create a cloud project, run:

```bash
npx convex login
npx convex dev
```

Convex stores local deployment details in `.env.local`, which is intentionally not committed.

Convex is configured to validate Clerk auth tokens in `convex/auth.config.ts`. The current local deployment has `CLERK_FRONTEND_API_URL` set for the Clerk development instance.

## Clerk

This project is linked to the Clerk app `Buzz New`.

Local Clerk keys are stored in `.env.local`, which is intentionally not committed.

The app uses:

- `@clerk/nextjs` for auth
- `@clerk/ui` for the shadcn theme
- Clerk Organizations for team accounts

## Vercel

For Vercel production deploys with Convex, use this build command:

```bash
npx convex deploy --cmd 'npm run build'
```

You will also need a `CONVEX_DEPLOY_KEY` environment variable in Vercel. Generate it from the Convex dashboard for the production deployment, then add it to the Vercel project settings.

Vercel also needs the production Clerk environment variables:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
```

## Scripts

```bash
npm run dev         # Start Next.js
npm run convex:dev  # Start Convex
npm run build       # Build for production
npm run lint        # Run lint checks
```

## Design System

shadcn/ui is set up in `src/components/ui`.

Add more shared UI components with:

```bash
npx shadcn@latest add component-name
```
