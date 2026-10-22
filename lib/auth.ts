import { createHmac, timingSafeEqual } from "crypto";
import type { NextRequest } from "next/server";

export const SESSION_COOKIE = "ngoka_admin";
export const SESSION_MAX_AGE = 60 * 60 * 12;

const failures = new Map<string, { count: number; resetAt: number }>();

function secret() {
  return process.env.ADMIN_PASSWORD ?? "";
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("base64url");
}

function safeEqual(a: string, b: string) {
  const left = createHmac("sha256", "compare").update(a).digest();
  const right = createHmac("sha256", "compare").update(b).digest();
  return timingSafeEqual(left, right);
}

export function adminConfigured() {
  return secret().length >= 8;
}

export function passwordMatches(password: string) {
  if (!adminConfigured()) return false;
  return safeEqual(password, secret());
}

export function createSessionToken() {
  const exp = String(Date.now() + SESSION_MAX_AGE * 1000);
  return `${exp}.${sign(exp)}`;
}

export function verifyToken(token: string | undefined) {
  if (!adminConfigured() || !token) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig || !/^\d+$/.test(exp)) return false;
  if (!safeEqual(sig, sign(exp))) return false;
  return Number(exp) > Date.now();
}

export function isAuthed(request: NextRequest) {
  return verifyToken(request.cookies.get(SESSION_COOKIE)?.value);
}

export function sameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export function clientKey(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "local";
}

export function tooManyAttempts(key: string) {
  const entry = failures.get(key);
  if (!entry || entry.resetAt < Date.now()) return false;
  return entry.count >= 8;
}

export function recordFailure(key: string) {
  const now = Date.now();
  const entry = failures.get(key);
  if (!entry || entry.resetAt < now) {
    failures.set(key, { count: 1, resetAt: now + 15 * 60 * 1000 });
    return;
  }
  entry.count += 1;
}

export function clearFailures(key: string) {
  failures.delete(key);
}
