/* ============================================================
   Meridian — Auth Middleware
   Extracts user from session cookie on API routes.
   ============================================================ */

import { cookies } from "next/headers";
import { getUserIdFromSession, findUserById } from "@/lib/db";
import type { DbUser } from "@/lib/db";

const SESSION_COOKIE = "meridian_session";

/**
 * Get the authenticated user from the request cookies.
 * Returns null if not authenticated.
 */
export async function getAuthUser(): Promise<DbUser | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    if (!token) return null;

    const userId = getUserIdFromSession(token);
    if (!userId) return null;

    const user = await findUserById(userId);
    return user || null;
}

/**
 * Simple password hasher using Web Crypto (bcrypt-like but demo-safe).
 * In production, use bcrypt or argon2.
 */
export async function hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + "meridian_salt_v1");
    const hash = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hash))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
}

/**
 * Verify password against stored hash.
 */
export async function verifyPassword(
    password: string,
    hash: string
): Promise<boolean> {
    const computed = await hashPassword(password);
    return computed === hash;
}

export { SESSION_COOKIE };
