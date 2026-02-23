/* ============================================================
   Meridian — Single Entry API
   GET /api/entries/[id] — Get entry detail
   DELETE /api/entries/[id] — Delete entry
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/config";
import { getEntryById, deleteEntry, getMarkersForEntry, getMealsForEntry } from "@/lib/db";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getAuthUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        console.log("Fetching entry with ID:", id);

        const entry = await getEntryById(id, user.id);
        console.log("Entry found:", entry ? "yes" : "no");

        if (!entry) {
            return NextResponse.json({ error: "Entry not found" }, { status: 404 });
        }

        const markers = await getMarkersForEntry(entry.id);
        const meals = await getMealsForEntry(entry.id);

        console.log("Markers found:", markers.length);
        console.log("Meals found:", meals.length);

        return NextResponse.json({
            entry: {
                ...entry,
                bodyMarkers: markers,
                meals: meals,
            },
        });
    } catch (error) {
        console.error("GET entry error:", error);
        return NextResponse.json(
            { error: "Internal server error", details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getAuthUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const deleted = await deleteEntry(id, user.id);
        if (!deleted) {
            return NextResponse.json({ error: "Entry not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE entry error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
