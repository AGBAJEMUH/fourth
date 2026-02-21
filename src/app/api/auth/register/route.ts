/* ============================================================
   Meridian — Register API
   POST /api/auth/register
   Creates new user and signs them in.
   ============================================================ */

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createUser, findUserByEmail, createConditions } from "@/lib/db";
import { RegisterSchema } from "@/lib/schemas";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Validate input
        const validatedFields = RegisterSchema.safeParse(body);

        if (!validatedFields.success) {
            return NextResponse.json(
                { error: "Invalid fields" },
                { status: 400 }
            );
        }

        const { email, password, name } = validatedFields.data;
        const conditions = body.conditions || [];

        // Check if user already exists
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return NextResponse.json(
                { error: "Email already in use" },
                { status: 400 }
            );
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 12);

        // Create user with email verified (auto-verify for credentials signup)
        // To require email verification, remove emailVerified and implement email verification flow
        const user = await createUser({
            email,
            passwordHash,
            displayName: name,
            provider: "credentials",
            emailVerified: new Date(),
        });

        // Create conditions if any
        if (conditions.length > 0) {
            await createConditions(user.id, conditions);
        }

        // Sign in the user
        await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        // Force session refresh by calling auth() to ensure session is established
        const session = await import("@/auth").then(m => m.auth());

        // Return user data along with session info
        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                displayName: user.displayName,
            },
        });
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
