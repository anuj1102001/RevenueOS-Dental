import { prisma } from "./prisma";
// One shared bucket for this single-owner demo. Atomic and persistent across instances.
export async function allowLoginAttempt() {
  const rows = await prisma.$queryRaw<{ attempts: number }[]>`
    INSERT INTO "AuthThrottle" ("key", "attempts", "resetAt")
    VALUES ('owner-login', 1, NOW() + INTERVAL '15 minutes')
    ON CONFLICT ("key") DO UPDATE SET
      "attempts" = CASE WHEN "AuthThrottle"."resetAt" <= NOW() THEN 1 ELSE "AuthThrottle"."attempts" + 1 END,
      "resetAt" = CASE WHEN "AuthThrottle"."resetAt" <= NOW() THEN NOW() + INTERVAL '15 minutes' ELSE "AuthThrottle"."resetAt" END
    WHERE "AuthThrottle"."resetAt" <= NOW() OR "AuthThrottle"."attempts" < 30
    RETURNING "attempts"`;
  return rows.length === 1;
}
