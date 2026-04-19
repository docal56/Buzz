# property-management

Next.js 16 + Convex + Clerk + Tailwind v4 + Radix Primitives.

## Quick start

```bash
pnpm install
cp .env.example .env.local   # then fill in the values

# In two separate terminals:
pnpm exec convex dev         # Convex backend (keeps types synced)
pnpm dev                     # Next.js (http://localhost:3000)
```

## Stack

| Piece | Purpose |
|---|---|
| Next.js 16 (App Router) | UI framework |
| React 19 | UI library |
| Tailwind v4 | Styling — config lives in `app/globals.css` (no `tailwind.config.js`) |
| Radix Primitives | Unstyled accessible UI primitives, used as the base of the design system in `components/` |
| Convex | Backend: database + serverless functions + realtime |
| Clerk | Authentication; passes JWTs to Convex |
| Vercel | Hosting |

## Dashboards

- Convex: https://dashboard.convex.dev
- Clerk: https://dashboard.clerk.com
- Vercel: https://vercel.com/dashboard

## Folder layout

- `app/` — routes and layouts
- `app/(app)/` — authenticated routes (auth-gated by `proxy.ts`)
- `components/{ui,composed,features}/` — design system (drop your `theme.css` tokens into `app/globals.css`)
- `convex/` — schema, queries, mutations, auth config
- `lib/` — utilities
- `proxy.ts` — Clerk middleware (Next 16 renamed `middleware.ts` → `proxy.ts`)

## Notes

- Use Node 22 LTS or higher.
- `convex/_generated/` is committed so CI type checks work without running `convex dev`.
- Vercel build runs `pnpm dlx convex deploy --cmd 'pnpm build'` (defined in `vercel.json`) — this deploys Convex functions before the Next build.
