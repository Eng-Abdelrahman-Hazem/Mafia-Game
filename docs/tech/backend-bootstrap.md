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
- `POST /internal/worker/process-missions?limit=50` (Admin key required via `x-admin-key`)

## Next coding slice
- Add event leaderboard snapshots for ranking rewards and season reset.
- Add admin dashboard controls for event scheduling and reward tuning.
- Add offer/pricing config endpoints for no-client-patch monetization tests.
