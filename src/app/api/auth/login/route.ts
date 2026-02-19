/* ============================================================
   Meridian — Login API
   POST /api/auth/login
   Authenticates user with email/password, creates session.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail, createSession } from "@/lib/db";
import { verifyPassword, SESSION_COOKIE } from "@/lib/auth/config";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = body;

        // Validation
        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        // Find user
        const user = await findUserByEmail(email.toLowerCase().trim());
        if (!user) {
            return NextResponse.json(
                { error: "Invalid email or password" },
                { status: 401 }
            );
        }

        // Verify password
        const valid = await verifyPassword(password, user.passwordHash);
        if (!valid) {
            return NextResponse.json(
                { error: "Invalid email or password" },
                { status: 401 }
            );
        }

        // Create session
        const sessionToken = createSession(user.id);

        const response = NextResponse.json({
            user: {
                id: user.id,
                email: user.email,
                displayName: user.displayName,
            },
        });

        response.cookies.set(SESSION_COOKIE, sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        return response;
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
