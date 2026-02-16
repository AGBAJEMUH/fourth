/* ============================================================
   Meridian — Insight Feedback API
   POST /api/insights/[id]/feedback
   Records whether a user found an insight helpful.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/config";
import { updateInsightStatus } from "@/lib/db";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getAuthUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();
        const { helpful } = body;

        // In a full implementation, store feedback and use for ML training
        if (helpful === false) {
            updateInsightStatus(id, "dismissed");
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Insight feedback error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
