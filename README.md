# Buzz

Buzz is a Next.js app with Convex set up for the backend.

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

## Vercel

For Vercel production deploys with Convex, use this build command:

```bash
npx convex deploy --cmd 'npm run build'
```

You will also need a `CONVEX_DEPLOY_KEY` environment variable in Vercel. Generate it from the Convex dashboard for the production deployment, then add it to the Vercel project settings.

## Scripts

```bash
npm run dev         # Start Next.js
npm run convex:dev  # Start Convex
npm run build       # Build for production
npm run lint        # Run lint checks
```
