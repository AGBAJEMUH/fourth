/* ============================================================
   Meridian — Entries API
   GET /api/entries — List entries (paginated)
   POST /api/entries — Create a new journal entry
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/config";
import {
    createEntry,
    getEntries,
    createBodyMarker,
    createMeal,
    getMarkersForEntry,
    getMealsForEntry,
} from "@/lib/db";

export async function GET(request: NextRequest) {
    try {
        const user = await getAuthUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get("limit") || "10", 10);

        const data = await getEntries(user.id, limit);

        // Attach body markers and meals to each entry
        const enrichedEntries = await Promise.all(
            data.entries.map(async (entry) => ({
                ...entry,
                bodyMarkers: await getMarkersForEntry(entry.id),
                meals: await getMealsForEntry(entry.id),
            }))
        );

        return NextResponse.json({
            entries: enrichedEntries,
            totalCount: data.totalCount,
        });
    } catch (error) {
        console.error("GET entries error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const user = await getAuthUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();

        // Validate required fields
        if (!body.entryDate) {
            return NextResponse.json(
                { error: "Entry date is required" },
                { status: 400 }
            );
        }

        // Create entry
        const entry = await createEntry({
            userId: user.id,
            entryDate: body.entryDate,
            sleepHours: body.sleepHours ?? null,
            sleepQuality: body.sleepQuality ?? null,
            stressLevel: body.stressLevel ?? null,
            energyLevel: body.energyLevel ?? null,
            moodScore: body.moodScore ?? null,
            exerciseMins: body.exerciseMins ?? null,
            exerciseType: body.exerciseType ?? null,
            waterIntakeMl: body.waterIntakeMl ?? null,
            notes: body.notes ?? null,
            weatherTemp: body.weatherTemp ?? null,
            weatherCond: body.weatherCond ?? null,
        });

        // Create body markers
        if (body.bodyMarkers && Array.isArray(body.bodyMarkers)) {
            for (const marker of body.bodyMarkers) {
                await createBodyMarker({
                    entryId: entry.id,
                    userId: user.id,
                    bodyRegion: marker.bodyRegion,
                    xPos: marker.xPos,
                    yPos: marker.yPos,
                    symptom: marker.symptom,
                    intensity: marker.intensity,
                });
            }
        }

        // Create meals
        if (body.meals && Array.isArray(body.meals)) {
            for (const meal of body.meals) {
                await createMeal({
                    entryId: entry.id,
                    userId: user.id,
                    mealType: meal.mealType,
                    description: meal.description,
                    foods: null,
                });
            }
        }

        return NextResponse.json({ entry }, { status: 201 });
    } catch (error) {
        console.error("POST entry error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
