# Playable Today (API Loop)

This gives a first playable semblance today using API endpoints.

## 1) Boot services
```bash
cp services/game-api/.env.example services/game-api/.env
docker compose -f infra/docker/docker-compose.yml up -d postgres redis
cd services/game-api
npm install
npm run prisma:generate
npm run prisma:migrate
npm run seed:playable
npm run start:dev
```

## 2) Login (guest)
```bash
curl -s -X POST http://localhost:3000/auth/guest-login \
  -H 'Content-Type: application/json' \
  -d '{"deviceId":"my-test-device-001","preferredHandle":"BossTest"}'
```
Copy `accessToken` from response.

## 3) Open home state
```bash
curl -s http://localhost:3000/gameplay/home \
  -H "Authorization: Bearer <accessToken>"
```

## 4) Run an instant crime
Use a `missionTemplateId` from `/gameplay/home`:
```bash
curl -s -X POST http://localhost:3000/gameplay/crime/instant \
  -H "Authorization: Bearer <accessToken>" \
  -H 'Content-Type: application/json' \
  -d '{"missionTemplateId":"<id-from-home>"}'
```

## 5) Find PvP targets and raid
```bash
curl -s http://localhost:3000/pvp/targets \
  -H "Authorization: Bearer <accessToken>"
```
Use a `defenderId` from targets:
```bash
curl -s -X POST http://localhost:3000/pvp/raid \
  -H "Authorization: Bearer <accessToken>" \
  -H 'Content-Type: application/json' \
  -d '{"defenderId":"<target-id>"}'
```

This loop (login -> crime -> raid -> home refresh) is the first playable vertical behavior.

## 6) Process finished mission payouts (worker simulation)
When timed missions are due, trigger worker processing:
```bash
curl -s -X POST 'http://localhost:3000/internal/worker/process-missions?limit=50' \
  -H 'x-admin-key: <ADMIN_API_KEY>'
```
