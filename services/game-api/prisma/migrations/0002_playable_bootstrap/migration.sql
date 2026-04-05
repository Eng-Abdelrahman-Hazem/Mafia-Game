ALTER TABLE "Player" ADD COLUMN "isBot" BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX "Player_isBot_idx" ON "Player"("isBot");
CREATE INDEX "MissionRun_playerId_status_endsAt_idx" ON "MissionRun"("playerId", "status", "endsAt");
