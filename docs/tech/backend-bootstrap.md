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

## Initial endpoints
- `GET /health`
- `POST /auth/guest-login`
- `GET /players/:id`
- `PATCH /players/grant-resource`
- `GET /missions/templates`
- `POST /missions/start`
- `POST /pvp/raid`

## Next coding slice
- Add JWT/session issuance for guest login.
- Add mission completion worker and rewards payout queue.
- Add PvP shield windows and daily steal cap tracking table.
- Add admin-only guards and audit logs for resource grants.
