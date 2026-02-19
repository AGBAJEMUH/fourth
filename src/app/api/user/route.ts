/* ============================================================
   Meridian — User API
   PUT /api/user — Update user profile
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/config";
import { updateUser } from "@/lib/db";

export async function PUT(request: NextRequest) {
    try {
        const user = await getAuthUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { displayName } = body;

        const updated = await updateUser(user.id, {
            displayName: displayName || user.displayName,
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
