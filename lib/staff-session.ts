import { createHash, timingSafeEqual } from "node:crypto";
import { sealData, unsealData } from "iron-session";
export const SESSION_SECONDS = 8 * 60 * 60;
export const COOKIE_NAME = "revenueos_staff";
export function staffPassword() {
  const password = process.env.STAFF_PASSWORD;
  return password && password.length >= 32 ? password : null;
}
export function passwordMatches(candidate: string, expected: string) {
  return timingSafeEqual(
    createHash("sha256").update(candidate).digest(),
    createHash("sha256").update(expected).digest(),
  );
}
export async function createStaffToken(password: string) {
  return sealData(
    { role: "owner", expiresAt: Date.now() + SESSION_SECONDS * 1000 },
    { password, ttl: SESSION_SECONDS },
  );
}
export async function validStaffToken(
  token: string | undefined,
  password: string | null,
) {
  if (!token || !password) return false;
  try {
    const session = await unsealData<{ role?: string; expiresAt?: number }>(
      token,
      { password, ttl: SESSION_SECONDS },
    );
    return (
      session.role === "owner" &&
      typeof session.expiresAt === "number" &&
      session.expiresAt > Date.now()
    );
  } catch {
    return false;
  }
}
export function sameOrigin(request: Request) {
  return request.headers.get("origin") === new URL(request.url).origin;
}
