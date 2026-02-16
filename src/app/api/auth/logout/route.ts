/* ============================================================
   Meridian — Logout API
   POST /api/auth/logout
   Clears session and removes auth cookie.
   ============================================================ */

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { deleteSession, getUserIdFromSession } from "@/lib/db";
import { SESSION_COOKIE } from "@/lib/auth/config";

export async function POST() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(SESSION_COOKIE)?.value;
        if (token) {
            deleteSession(token);
        }

        const response = NextResponse.json({ success: true });
        response.cookies.set(SESSION_COOKIE, "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 0,
        });

        return response;
    } catch (error) {
        console.error("Logout error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
