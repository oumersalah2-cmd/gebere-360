-- Migration: Gebere 360 Platform Upgrade
-- Adds Farm planting/harvesting dates, FarmActivity, LandRecord valuation/GPS metadata,
-- CropDiagnosisLog user isolation/details, and Notification persistence.

ALTER TABLE "farms"
  ADD COLUMN IF NOT EXISTS "plantingDate" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "harvestingDate" TIMESTAMP(3);

ALTER TABLE "land_records"
  ADD COLUMN IF NOT EXISTS "measurementSource" TEXT NOT NULL DEFAULT 'manual',
  ADD COLUMN IF NOT EXISTS "gpsAccuracyMeters" DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS "pricePerSquareMeter" DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS "pricePerHectare" DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS "estimatedValueETB" DOUBLE PRECISION;

ALTER TABLE "crop_diagnosis_logs"
  ADD COLUMN IF NOT EXISTS "userId" TEXT,
  ADD COLUMN IF NOT EXISTS "scientificName" TEXT,
  ADD COLUMN IF NOT EXISTS "severity" TEXT,
  ADD COLUMN IF NOT EXISTS "managementAdvice" TEXT[] DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN IF NOT EXISTS "imageUrl" TEXT,
  ADD COLUMN IF NOT EXISTS "disclaimer" TEXT;

CREATE INDEX IF NOT EXISTS "crop_diagnosis_logs_userId_idx" ON "crop_diagnosis_logs"("userId");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'crop_diagnosis_logs_userId_fkey'
  ) THEN
    ALTER TABLE "crop_diagnosis_logs"
      ADD CONSTRAINT "crop_diagnosis_logs_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "user_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "farm_activities" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "farmId" TEXT NOT NULL,
  "activityType" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "activityDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "status" TEXT NOT NULL DEFAULT 'planned',
  "costETB" DOUBLE PRECISION,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "farm_activities_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "farm_activities_userId_idx" ON "farm_activities"("userId");
CREATE INDEX IF NOT EXISTS "farm_activities_farmId_idx" ON "farm_activities"("farmId");
CREATE INDEX IF NOT EXISTS "farm_activities_activityDate_idx" ON "farm_activities"("activityDate");

ALTER TABLE "farm_activities"
  ADD CONSTRAINT "farm_activities_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "user_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "farm_activities"
  ADD CONSTRAINT "farm_activities_farmId_fkey"
  FOREIGN KEY ("farmId") REFERENCES "farms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE IF NOT EXISTS "notifications" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "type" TEXT NOT NULL DEFAULT 'system',
  "read" BOOLEAN NOT NULL DEFAULT false,
  "link" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "notifications_userId_idx" ON "notifications"("userId");
CREATE INDEX IF NOT EXISTS "notifications_read_idx" ON "notifications"("read");

ALTER TABLE "notifications"
  ADD CONSTRAINT "notifications_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "user_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
