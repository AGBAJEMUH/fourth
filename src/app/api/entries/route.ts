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
    getEntryByDate,
    updateEntry,
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

        console.log("Upserting entry for date:", body.entryDate);
        console.log("Body markers:", body.bodyMarkers);
        console.log("Meals:", body.meals);

        // Check if entry already exists for this date (upsert logic)
        let entry = await getEntryByDate(user.id, body.entryDate);

        if (entry) {
            // Entry exists - update it
            console.log("Entry exists, updating ID:", entry.id);
            entry = await updateEntry(entry.id, {
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
            console.log("Entry updated with ID:", entry?.id);
        } else {
            // Entry doesn't exist - create new one
            console.log("Creating new entry");
            entry = await createEntry({
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
            console.log("Entry created with ID:", entry.id);
        }

        if (!entry) {
            return NextResponse.json(
                { error: "Failed to save entry" },
                { status: 500 }
            );
        }

        // Create body markers (always add new ones, since we're not deleting existing)
        if (body.bodyMarkers && Array.isArray(body.bodyMarkers) && body.bodyMarkers.length > 0) {
            console.log("Creating body markers:", body.bodyMarkers.length);
            for (const marker of body.bodyMarkers) {
                try {
                    const createdMarker = await createBodyMarker({
                        entryId: entry.id,
                        userId: user.id,
                        bodyRegion: marker.bodyRegion,
                        xPos: marker.xPos,
                        yPos: marker.yPos,
                        symptom: marker.symptom,
                        intensity: marker.intensity,
                    });
                    console.log("Body marker created:", createdMarker.id);
                } catch (markerError) {
                    console.error("Error creating body marker:", markerError);
                }
            }
        } else {
            console.log("No body markers to create");
        }

        // Create meals
        if (body.meals && Array.isArray(body.meals) && body.meals.length > 0) {
            console.log("Creating meals:", body.meals.length);
            for (const meal of body.meals) {
                try {
                    const createdMeal = await createMeal({
                        entryId: entry.id,
                        userId: user.id,
                        mealType: meal.mealType,
                        description: meal.description,
                        foods: null,
                    });
                    console.log("Meal created:", createdMeal.id);
                } catch (mealError) {
                    console.error("Error creating meal:", mealError);
                }
            }
        } else {
            console.log("No meals to create");
        }

        return NextResponse.json({ entry }, { status: 201 });
    } catch (error) {
        console.error("POST entry error:", error);
        return NextResponse.json(
            { error: "Internal server error", details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}
