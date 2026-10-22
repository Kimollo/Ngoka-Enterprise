import { NextRequest, NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  adminConfigured,
  clearFailures,
  clientKey,
  createSessionToken,
  passwordMatches,
  recordFailure,
  sameOrigin,
  tooManyAttempts,
} from "@/lib/auth";

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) {
    return NextResponse.json(
      { error: "Open this page on the website and try again." },
      { status: 403 },
    );
  }

  if (!adminConfigured()) {
    return NextResponse.json(
      { error: "Add ADMIN_PASSWORD to .env.local, then restart the site." },
      { status: 503 },
    );
  }

  const key = clientKey(request);
  if (tooManyAttempts(key)) {
    return NextResponse.json(
      { error: "Too many tries. Wait 15 minutes and try again." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Enter your password." }, { status: 400 });
  }

  const password =
    body && typeof body === "object" && "password" in body
      ? String((body as { password: unknown }).password)
      : "";

  if (password.length === 0 || password.length > 200 || !passwordMatches(password)) {
    recordFailure(key);
    return NextResponse.json({ error: "That password is not correct." }, { status: 401 });
  }

  clearFailures(key);
  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: SESSION_COOKIE,
    value: createSessionToken(),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return response;
}
