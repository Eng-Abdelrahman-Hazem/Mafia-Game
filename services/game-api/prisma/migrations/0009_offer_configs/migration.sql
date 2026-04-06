-- CreateTable
CREATE TABLE "OfferConfig" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "priceUsd" DOUBLE PRECISION NOT NULL,
    "gemAmount" INTEGER NOT NULL,
    "bonusPct" INTEGER NOT NULL DEFAULT 0,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "targeting" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OfferConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OfferConfig_key_key" ON "OfferConfig"("key");

-- CreateIndex
CREATE INDEX "OfferConfig_isActive_startsAt_endsAt_idx" ON "OfferConfig"("isActive", "startsAt", "endsAt");
