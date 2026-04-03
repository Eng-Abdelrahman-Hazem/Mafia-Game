# Run Shadow Districts Locally (Beginner Friendly)

This guide is for people with little/no coding experience.

---

## What you will run
You will run two things:
1. **Backend server** (game logic/API)
2. **Visual prototype** (simple playable graphics page)

---

## Step 0 — Install required apps (one-time)

### Install Git
- Download: https://git-scm.com/downloads
- Install with default options.

### Install Node.js (LTS)
- Download: https://nodejs.org/
- Install the **LTS** version.

### Install Docker Desktop
- Download: https://www.docker.com/products/docker-desktop/
- Install and open it once.

### (Windows only) Install Python
- Download: https://www.python.org/downloads/
- During install, check **"Add Python to PATH"**.

---

## Step 1 — Open terminal in the project folder

If you already have this repository on your machine:
- Open terminal (Command Prompt/PowerShell on Windows, Terminal on Mac/Linux).
- Navigate to the project folder.

Example:
```bash
cd path/to/Mafia-Game
```

---

## Step 2 — Start database services (Postgres + Redis)

Make sure Docker Desktop is running, then run:

```bash
docker compose -f infra/docker/docker-compose.yml up -d postgres redis
```

Wait 10–20 seconds.

---

## Step 3 — Configure environment file

Create a local environment file by copying the example:

```bash
cp services/game-api/.env.example services/game-api/.env
```

On **Windows PowerShell**, use:

```powershell
Copy-Item services/game-api/.env.example services/game-api/.env
```

---

## Step 4 — Install backend dependencies

```bash
cd services/game-api
npm install
```

---

## Step 5 — Prepare database and seed data

Run these 3 commands in `services/game-api`:

```bash
npm run prisma:generate
npm run prisma:migrate
npm run seed:playable
```

This creates tables and sample game data.

---

## Step 6 — Verify backend builds and tests

```bash
npm run build
npm run test
```

You should see tests passing.

---

## Step 7 — Start backend server

```bash
npm run start:dev
```

Keep this terminal open.

You should have backend on:
- `http://localhost:3000`

Quick health check in browser:
- `http://localhost:3000/health`

---

## Step 8 — Open visual prototype (new terminal window)

Open a **new terminal window**, go to project root, and run:

```bash
cd clients/prototype-web
python3 -m http.server 8080
```

On some Windows setups, use:

```bash
py -m http.server 8080
```

Open in browser:
- `http://localhost:8080`

Use buttons:
- **Run Crime Sequence**
- **Run Raid Sequence**

---

## Step 9 — Stop everything when done

- Stop backend server with `Ctrl + C` in backend terminal.
- Stop prototype server with `Ctrl + C` in prototype terminal.
- Stop Docker services from project root:

```bash
docker compose -f infra/docker/docker-compose.yml down
```

---

## Common errors and easy fixes

### "docker: command not found"
Docker is not installed or not running.

### "npm: command not found"
Node.js is not installed correctly.

### Port already in use (3000 or 8080)
Close other apps using those ports, or restart your PC.

### `cp` command fails on Windows
Use `Copy-Item` in PowerShell.

---

## Minimal success checklist

- [ ] `http://localhost:3000/health` shows status ok.
- [ ] `npm run test` passes.
- [ ] `http://localhost:8080` loads and buttons animate actions.
