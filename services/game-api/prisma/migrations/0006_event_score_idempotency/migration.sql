-- CreateTable
CREATE TABLE "EventScoreActionLog" (
    "id" TEXT NOT NULL,
    "liveEventId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "actionType" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "appliedPoints" INTEGER NOT NULL,
    "idempotencyKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventScoreActionLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EventScoreActionLog_liveEventId_playerId_idempotencyKey_key" ON "EventScoreActionLog"("liveEventId", "playerId", "idempotencyKey");

-- CreateIndex
CREATE INDEX "EventScoreActionLog_playerId_createdAt_idx" ON "EventScoreActionLog"("playerId", "createdAt");
