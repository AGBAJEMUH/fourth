/* ============================================================
   Meridian — User API
   PUT /api/user — Update user profile
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { updateUser } from "@/lib/db";

export async function PUT(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { displayName } = body;

        const updated = await updateUser(session.user.id, {
            displayName: displayName || session.user.name,
        });

        if (!updated) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            user: {
                id: updated.id,
                email: updated.email,
                displayName: updated.displayName,
            },
        });
    } catch (error) {
        console.error("Update user error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
