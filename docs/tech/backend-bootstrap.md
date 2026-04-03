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
- `POST /internal/worker/process-missions?limit=50` (Admin key required via `x-admin-key`)

## Next coding slice
- Wire `process-missions` endpoint to scheduled cron/BullMQ recurring job.
- Expand PvP shield windows with decay rules and anti-farm cooldown resets.
- Add admin dashboard views for audit logs and player protection state.
