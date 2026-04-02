CREATE TABLE "PvPProtectionState" (
  "playerId" TEXT PRIMARY KEY,
  "shieldUntil" TIMESTAMP,
  "lastRaidedAt" TIMESTAMP,
  "raidsAgainstWindow" INTEGER NOT NULL DEFAULT 0,
  "updatedAt" TIMESTAMP NOT NULL,
  CONSTRAINT "PvPProtectionState_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE
);

CREATE TABLE "AdminAuditLog" (
  "id" TEXT PRIMARY KEY,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "actor" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "playerId" TEXT NOT NULL,
  "payload" JSONB
);

CREATE INDEX "AdminAuditLog_playerId_idx" ON "AdminAuditLog"("playerId");
CREATE INDEX "PvPProtectionState_shieldUntil_idx" ON "PvPProtectionState"("shieldUntil");
