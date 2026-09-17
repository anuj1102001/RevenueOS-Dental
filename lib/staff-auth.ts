import { cookies } from "next/headers";
import { COOKIE_NAME, staffPassword, validStaffToken } from "./staff-session";
export async function isStaff() {
  return validStaffToken(
    (await cookies()).get(COOKIE_NAME)?.value,
    staffPassword(),
  );
}
