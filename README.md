# Kollektiv app

En app som gjør samarbeidet i et kollektiv enklere og mer oversiktlig.

## Hva appen inneholder
- Handleliste
- Kalender
- Vaskeliste
- Beholdning

## Mål
- Mindre misforståelser
- Enklere planlegging
- Bedre oversikt over fellesoppgaver

## Tech stack (planlagt)
- Runtime: Bun
- Backend: Elysia
- Database: PostgreSQL
- ORM: Drizzle
- Frontend: React + Vite
- Styling: Tailwind (eller CSS Modules)
- Auth: Lucia (valgfritt)
- Testing: Bun test

## Prosjektstruktur (monorepo)
- `apps/api`: Elysia API
- `apps/web`: React + Vite frontend
- `packages/db`: Drizzle schema og migrasjoner

## Kom i gang
1. Installer avhengigheter: `bun install`
2. Kopier miljøfil: `cp apps/api/.env.example apps/api/.env`
3. Start utvikling:
   - `bun run dev` (starter både web + api)
   - `bun run dev:web`
   - `bun run dev:api`
