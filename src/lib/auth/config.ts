/* ============================================================
   Meridian — Auth Middleware
   Extracts user from session cookie on API routes.
   ============================================================ */

import { auth } from "@/auth";
import { getUserIdFromSession, findUserById } from "@/lib/db";
import type { DbUser } from "@/lib/db";

/**
 * NextAuth v5 session cookie name.
 * This is the default cookie used for JWT sessions.
 */
export const SESSION_COOKIE = "next-auth.session-token";

/**
 * Get the authenticated user from the NextAuth session.
 * Returns null if not authenticated.
 */
export async function getAuthUser(): Promise<DbUser | null> {
    const session = await auth();
    if (!session?.user?.id) return null;

    const user = await findUserById(session.user.id);
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

