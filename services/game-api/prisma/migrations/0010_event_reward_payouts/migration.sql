-- CreateTable
CREATE TABLE "EventRewardPayout" (
    "id" TEXT NOT NULL,
    "liveEventId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "points" INTEGER NOT NULL,
    "reward" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventRewardPayout_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EventRewardPayout_liveEventId_playerId_key" ON "EventRewardPayout"("liveEventId", "playerId");

-- CreateIndex
CREATE INDEX "EventRewardPayout_liveEventId_createdAt_idx" ON "EventRewardPayout"("liveEventId", "createdAt");
