CREATE TYPE "JobStatus" AS ENUM ('PENDING', 'PROCESSING', 'DONE', 'FAILED');

CREATE TABLE "MissionPayoutJob" (
  "id" TEXT PRIMARY KEY,
  "missionRunId" TEXT NOT NULL,
  "playerId" TEXT NOT NULL,
  "dueAt" TIMESTAMP NOT NULL,
  "status" "JobStatus" NOT NULL DEFAULT 'PENDING',
  "attempts" INTEGER NOT NULL DEFAULT 0,
  "lastError" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL,
  CONSTRAINT "MissionPayoutJob_missionRunId_fkey" FOREIGN KEY ("missionRunId") REFERENCES "MissionRun"("id") ON DELETE CASCADE
);

CREATE INDEX "MissionPayoutJob_status_dueAt_idx" ON "MissionPayoutJob"("status", "dueAt");
CREATE INDEX "MissionPayoutJob_playerId_idx" ON "MissionPayoutJob"("playerId");
