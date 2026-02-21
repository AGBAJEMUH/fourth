/* ============================================================
   Meridian — Logout API
   POST /api/auth/logout
   Signs out the user via NextAuth.
   ============================================================ */

import { NextResponse } from "next/server";
import { signOut } from "@/auth";

export async function POST() {
    try {
        await signOut({ redirect: false });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Logout error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
