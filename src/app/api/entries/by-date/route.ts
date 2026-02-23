/* ============================================================
   Meridian — Entry Lookup By Date API
   GET /api/entries/by-date?date=YYYY-MM-DD
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/config";
import { getEntryByUserAndDate } from "@/lib/db";

export async function GET(request: NextRequest) {
    try {
        const user = await getAuthUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const date = searchParams.get("date");

        if (!date) {
            return NextResponse.json(
                { error: "Missing date parameter" },
                { status: 400 }
            );
        }

        const entry = await getEntryByUserAndDate(user.id, date);

        if (!entry) {
            return NextResponse.json({ entry: null });
        }

        return NextResponse.json({
            entry: {
                id: entry.id,
                entryDate: entry.entryDate,
            },
        });
    } catch (error) {
        console.error("GET by-date error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}