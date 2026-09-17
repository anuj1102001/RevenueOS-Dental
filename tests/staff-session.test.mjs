import test from "node:test";
import assert from "node:assert/strict";
import { sealData } from "iron-session";
import {
  createStaffToken,
  validStaffToken,
  passwordMatches,
  sameOrigin,
  staffPassword,
} from "../lib/staff-session.ts";
const secret = "test-only-secret-with-more-than-thirty-two-characters";
test("valid session works, tampered session fails, key rotation revokes it", async () => {
  const token = await createStaffToken(secret);
  assert.equal(await validStaffToken(token, secret), true);
  assert.equal(
    await validStaffToken(
      token.slice(0, 40) + "tampered" + token.slice(48),
      secret,
    ),
    false,
  );
  assert.equal(await validStaffToken(token, secret + "rotated"), false);
});
test("missing, expired and wrong-role sessions fail closed", async () => {
  assert.equal(await validStaffToken(undefined, secret), false);
  assert.equal(await validStaffToken("bad", null), false);
  const expired = await sealData(
    { role: "owner", expiresAt: Date.now() - 1 },
    { password: secret, ttl: 1000 },
  );
  const visitor = await sealData(
    { role: "visitor", expiresAt: Date.now() + 10000 },
    { password: secret, ttl: 1000 },
  );
  assert.equal(await validStaffToken(expired, secret), false);
  assert.equal(await validStaffToken(visitor, secret), false);
});
test("password checks compare the full value", () => {
  assert.equal(passwordMatches(secret, secret), true);
  assert.equal(passwordMatches(secret + "x", secret), false);
  assert.equal(passwordMatches("", secret), false);
});
test("missing or short configuration disables sign-in", () => {
  const old = process.env.STAFF_PASSWORD;
  delete process.env.STAFF_PASSWORD;
  assert.equal(staffPassword(), null);
  process.env.STAFF_PASSWORD = "short";
  assert.equal(staffPassword(), null);
  process.env.STAFF_PASSWORD = secret;
  assert.equal(staffPassword(), secret);
  if (old === undefined) delete process.env.STAFF_PASSWORD;
  else process.env.STAFF_PASSWORD = old;
});
test("state-changing requests require exact origin", () => {
  const url = "https://clinic.example/api/staff/login";
  assert.equal(
    sameOrigin(
      new Request(url, { headers: { origin: "https://clinic.example" } }),
    ),
    true,
  );
  assert.equal(
    sameOrigin(
      new Request(url, { headers: { origin: "https://evil.example" } }),
    ),
    false,
  );
  assert.equal(sameOrigin(new Request(url)), false);
});
