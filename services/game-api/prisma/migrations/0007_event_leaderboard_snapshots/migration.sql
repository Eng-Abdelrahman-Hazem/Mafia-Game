-- CreateTable
CREATE TABLE "EventLeaderboardSnapshot" (
    "id" TEXT NOT NULL,
    "liveEventId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "points" INTEGER NOT NULL,
    "snapshotAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventLeaderboardSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EventLeaderboardSnapshot_liveEventId_snapshotAt_rank_idx" ON "EventLeaderboardSnapshot"("liveEventId", "snapshotAt", "rank");

-- CreateIndex
CREATE INDEX "EventLeaderboardSnapshot_playerId_snapshotAt_idx" ON "EventLeaderboardSnapshot"("playerId", "snapshotAt");
