ALTER TABLE "Lead" ADD COLUMN "followUpAt" TIMESTAMP(3);
CREATE TABLE "AuthThrottle" (
  "key" TEXT NOT NULL,
  "attempts" INTEGER NOT NULL,
  "resetAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "AuthThrottle_pkey" PRIMARY KEY ("key")
);
