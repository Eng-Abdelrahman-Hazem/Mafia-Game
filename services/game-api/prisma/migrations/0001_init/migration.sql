-- Initial schema for Shadow Districts game API
CREATE TYPE "Faction" AS ENUM ('DOCK_SERPENTS', 'VELVET_CIRCUIT', 'IRON_VOW');
CREATE TYPE "MissionStatus" AS ENUM ('RUNNING', 'COMPLETED', 'FAILED');

CREATE TABLE "Player" (
  "id" TEXT PRIMARY KEY,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL,
  "deviceId" TEXT NOT NULL UNIQUE,
  "handle" TEXT NOT NULL UNIQUE,
  "faction" "Faction" NOT NULL,
  "powerRating" INTEGER NOT NULL DEFAULT 100
);

CREATE TABLE "PlayerResource" (
  "playerId" TEXT PRIMARY KEY,
  "cash" INTEGER NOT NULL DEFAULT 0,
  "gems" INTEGER NOT NULL DEFAULT 0,
  "energy" INTEGER NOT NULL DEFAULT 0,
  "influence" INTEGER NOT NULL DEFAULT 0,
  "contraband" INTEGER NOT NULL DEFAULT 0,
  "loyalty" INTEGER NOT NULL DEFAULT 100,
  "heat" INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "PlayerResource_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE
);

CREATE TABLE "MissionTemplate" (
  "id" TEXT PRIMARY KEY,
  "key" TEXT NOT NULL UNIQUE,
  "title" TEXT NOT NULL,
  "energyCost" INTEGER NOT NULL,
  "durationSec" INTEGER NOT NULL,
  "cashReward" INTEGER NOT NULL,
  "influenceReward" INTEGER NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE "MissionRun" (
  "id" TEXT PRIMARY KEY,
  "playerId" TEXT NOT NULL,
  "missionTemplateId" TEXT NOT NULL,
  "status" "MissionStatus" NOT NULL,
  "startedAt" TIMESTAMP NOT NULL,
  "endsAt" TIMESTAMP NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "MissionRun_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE,
  CONSTRAINT "MissionRun_missionTemplateId_fkey" FOREIGN KEY ("missionTemplateId") REFERENCES "MissionTemplate"("id") ON DELETE RESTRICT
);

CREATE TABLE "PvPRaidLog" (
  "id" TEXT PRIMARY KEY,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "attackerId" TEXT NOT NULL,
  "defenderId" TEXT NOT NULL,
  "attackerPower" INTEGER NOT NULL,
  "defenderPower" INTEGER NOT NULL,
  "won" BOOLEAN NOT NULL,
  "stolenCash" INTEGER NOT NULL,
  CONSTRAINT "PvPRaidLog_attackerId_fkey" FOREIGN KEY ("attackerId") REFERENCES "Player"("id") ON DELETE CASCADE,
  CONSTRAINT "PvPRaidLog_defenderId_fkey" FOREIGN KEY ("defenderId") REFERENCES "Player"("id") ON DELETE CASCADE
);
