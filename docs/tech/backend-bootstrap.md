# Backend Bootstrap (Phase 2 Kickoff)

## Included in this commit
- NestJS game API scaffold with modules for health, auth, player, mission, and PvP.
- Prisma schema and initial SQL migration.
- Docker Compose stack for Postgres, Redis, and API dev container.

## Quick start
1. Copy env file:
   - `cp services/game-api/.env.example services/game-api/.env`
2. Install deps in API:
   - `cd services/game-api && npm install`
3. Generate Prisma client:
   - `npm run prisma:generate`
4. Run migration:
   - `npm run prisma:migrate`
5. Start API:
   - `npm run start:dev`
6. Seed playable content:
   - `npm run seed:playable`
7. Build and test:
   - `npm run build`
   - `npm run test`

## Initial endpoints
- `GET /health`
- `POST /auth/guest-login`
- `POST /auth/bind-email` (Bearer token required)
- `GET /players/me` (Bearer token required)
- `PATCH /players/grant-resource` (Admin key required via `x-admin-key`)
- `GET /missions/templates`
- `POST /missions/start` (Bearer token required)
- `POST /missions/:runId/claim` (Bearer token required)
- `GET /gameplay/home` (Bearer token required)
- `POST /gameplay/crime/instant` (Bearer token required)
- `GET /pvp/targets` (Bearer token required)
- `POST /pvp/raid` (Bearer token required)
- `GET /events/active` (Bearer token required)
- `POST /events/:eventId/score` (Bearer token required)
- `POST /events/:eventId/claim` (Bearer token required)
- `GET /events/:eventId/leaderboard` (Bearer token required)
- `POST /internal/events/:eventId/snapshot?top=100` (Admin key required via `x-admin-key`)
- `POST /internal/events/:eventId/settle-rewards?top=100` (Admin key required via `x-admin-key`)
- `GET /offers/active` (Bearer token required)
- `POST /internal/offers/upsert` (Admin key required via `x-admin-key`)
- `GET /internal/analytics/email-bind-funnel?days=14` (Admin key required via `x-admin-key`)
- `POST /internal/worker/process-missions?limit=50` (Admin key required via `x-admin-key`)

## Next coding slice
- Build Unity client shell against `/auth`, `/gameplay/home`, `/missions`, `/pvp`, `/events`, `/offers`.
- Expand FTUE and quest scripting for the full Phase 3 vertical slice.
- Add event season rollover automation job (snapshot + settle + close event + open next).
