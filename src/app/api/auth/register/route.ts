/* ============================================================
   Meridian — Register API
   POST /api/auth/register
   Creates a new user account with conditions.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { createUser, createSession, createConditions } from "@/lib/db";
import { hashPassword, SESSION_COOKIE } from "@/lib/auth/config";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, password, conditions } = body;

        // Validation
        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        if (typeof password !== "string" || password.length < 8) {
            return NextResponse.json(
                { error: "Password must be at least 8 characters" },
                { status: 400 }
            );
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: "Invalid email format" },
                { status: 400 }
            );
        }

        // Hash password & create user
        const passwordHash = await hashPassword(password);

        let user;
        try {
            user = await createUser({
                email: email.toLowerCase().trim(),
                passwordHash,
                displayName: name || null,
                provider: "email",
            });
        } catch {
            return NextResponse.json(
                { error: "Email already registered" },
                { status: 409 }
            );
        }

        // Save conditions if provided
        if (conditions && Array.isArray(conditions) && conditions.length > 0) {
            await createConditions(user.id, conditions);
        }

        // Create session
        const sessionToken = createSession(user.id);

        // Set cookie
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
        console.error("Register error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
