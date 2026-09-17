import { NextResponse } from "next/server";
import {
  COOKIE_NAME,
  SESSION_SECONDS,
  staffPassword,
  passwordMatches,
  createStaffToken,
  sameOrigin,
} from "@/lib/staff-session";
import { allowLoginAttempt } from "@/lib/login-limit";
export async function POST(request: Request) {
  if (!sameOrigin(request))
    return NextResponse.json(
      { error: "Request not allowed." },
      { status: 403 },
    );
  const password = staffPassword();
  if (!password)
    return NextResponse.json(
      { error: "Staff access is not configured yet." },
      { status: 503 },
    );
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (typeof body?.password !== "string" || body.password.length > 256)
    return NextResponse.json({ error: "Invalid password." }, { status: 400 });
  try {
    if (!(await allowLoginAttempt()))
      return NextResponse.json(
        { error: "Too many sign-in attempts. Try again in 15 minutes." },
        { status: 429, headers: { "Retry-After": "900" } },
      );
    if (!passwordMatches(body.password, password))
      return NextResponse.json(
        { error: "Incorrect password." },
        { status: 401 },
      );
    const response = NextResponse.json(
      { ok: true },
      { headers: { "Cache-Control": "no-store" } },
    );
    response.cookies.set(COOKIE_NAME, await createStaffToken(password), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: SESSION_SECONDS,
    });
    return response;
  } catch {
    return NextResponse.json(
      { error: "Sign-in is temporarily unavailable. Please try again." },
      { status: 503 },
    );
  }
}
