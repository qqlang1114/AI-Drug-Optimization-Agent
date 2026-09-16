# AI Drug Optimization Agent — agent notes

## Stack
- Next.js App Router, React 19, TypeScript strict, Tailwind CSS v4

## Commands
- `npm run dev` — development server
- `npm run build` — production build
- `npm run typecheck` / `npm run lint`

## Layout
```
src/app/                 routes
src/components/sites/    product UI (home, login, chat, workflow)
src/lib/                 auth + helpers
public/sites/            static assets
```

## Rules
- Do not change visual design or workflow behavior unless the user asks
- Prefer mock service swaps over UI rewrites when integrating real APIs
- TypeScript strict; no `any`
