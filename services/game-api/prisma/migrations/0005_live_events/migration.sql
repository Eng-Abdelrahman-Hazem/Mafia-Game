-- CreateEnum
CREATE TYPE "LiveEventType" AS ENUM ('DISTRICT_SKIRMISH', 'CREW_SURGE', 'BLACK_MARKET_RUSH', 'SYNDICATE_DONATION');

-- CreateTable
CREATE TABLE "EventTemplate" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "LiveEventType" NOT NULL,
    "durationHours" INTEGER NOT NULL,
    "scoringRule" JSONB NOT NULL,
    "rewards" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LiveEvent" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LiveEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerEventScore" (
    "id" TEXT NOT NULL,
    "liveEventId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,
    "claimedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlayerEventScore_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EventTemplate_key_key" ON "EventTemplate"("key");

-- CreateIndex
CREATE INDEX "LiveEvent_startsAt_endsAt_idx" ON "LiveEvent"("startsAt", "endsAt");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerEventScore_liveEventId_playerId_key" ON "PlayerEventScore"("liveEventId", "playerId");

-- CreateIndex
CREATE INDEX "PlayerEventScore_playerId_idx" ON "PlayerEventScore"("playerId");

-- AddForeignKey
ALTER TABLE "LiveEvent" ADD CONSTRAINT "LiveEvent_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "EventTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerEventScore" ADD CONSTRAINT "PlayerEventScore_liveEventId_fkey" FOREIGN KEY ("liveEventId") REFERENCES "LiveEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerEventScore" ADD CONSTRAINT "PlayerEventScore_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;
