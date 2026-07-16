import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "seka_admin_session";

function sessionSecret() {
  return process.env.ADMIN_SESSION_SECRET ?? process.env.ADMIN_PASSWORD ?? "development";
}

export function adminEmail() {
  return process.env.ADMIN_EMAIL ?? "niktimas696@gmail.com";
}

export function adminPassword() {
  return process.env.ADMIN_PASSWORD ?? "";
}

export function adminSessionToken() {
  return createHash("sha256").update(`${adminEmail()}:${adminPassword()}:${sessionSecret()}`).digest("hex");
}

export function verifyAdminCredentials(email: string, password: string) {
  const expectedEmail = Buffer.from(adminEmail());
  const actualEmail = Buffer.from(email);
  const expectedPassword = Buffer.from(adminPassword());
  const actualPassword = Buffer.from(password);

  if (expectedEmail.length !== actualEmail.length || expectedPassword.length !== actualPassword.length) {
    return false;
  }

  return timingSafeEqual(expectedEmail, actualEmail) && timingSafeEqual(expectedPassword, actualPassword);
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value === adminSessionToken();
}

export async function setAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, adminSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
