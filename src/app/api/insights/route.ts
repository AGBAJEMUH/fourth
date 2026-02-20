/* ============================================================
   Meridian — Insights API
   GET /api/insights — List user insights
   ============================================================ */

import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/config";
import { getInsights } from "@/lib/db";

export async function GET() {
    try {
        const user = await getAuthUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const insights = await getInsights(user.id);

        return NextResponse.json({ insights });
    } catch (error) {
        console.error("GET insights error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
