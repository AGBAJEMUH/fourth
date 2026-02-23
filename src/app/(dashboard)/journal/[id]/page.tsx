/* ============================================================
   Meridian — Journal Entry Detail Page
   View a single journal entry with all details including
   body markers, meals, and other data.
   ============================================================ */
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import BodyMap from "@/components/body-map/BodyMap";
import { cn, formatDate, getScaleLabel, getScaleColor } from "@/lib/utils/helpers";
import {
    EXERCISE_TYPES,
    MEAL_TYPES,
    MOOD_LABELS,
    ENERGY_LABELS,
    STRESS_LABELS,
    SLEEP_LABELS,
} from "@/lib/utils/constants";
import type { JournalEntry, BodyMarker, Meal } from "@/types";

export default function JournalEntryPage() {
    const params = useParams();
    const router = useRouter();
    // Handle both string and array cases for params.id
    const entryId = params?.id as string | undefined;
    const [entry, setEntry] = useState<JournalEntry | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchEntry() {
            // Ensure we have a valid entryId
            if (!entryId || Array.isArray(entryId)) {
                setError("Invalid entry ID");
                setLoading(false);
                return;
            }

            try {
                console.log("Fetching entry with ID:", entryId);
                const res = await fetch(`/api/entries/${entryId}`);

                if (!res.ok) {
                    const errorData = await res.json().catch(() => ({}));
                    console.error("API error:", res.status, errorData);
                    if (res.status === 404) {
                        setError("Entry not found - it may have been deleted or you don't have permission to view it");
                    } else if (res.status === 401) {
                        setError("You are not authorized to view this entry");
                    } else {
                        setError(`Failed to load entry (${res.status})`);
                    }
                    return;
                }

                const data = await res.json();
                console.log("Entry loaded:", data.entry?.id);
                setEntry(data.entry);
            } catch (err) {
                console.error("Fetch error:", err);
                setError("Failed to load entry - network error");
            } finally {
                setLoading(false);
            }
        }

        fetchEntry();
    }, [entryId]);

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto animate-fade-in">
                <div className="h-8 w-32 skeleton mb-6" />
                <div className="h-64 skeleton rounded-2xl" />
            </div>
        );
    }

    if (error || !entry) {
        return (
            <div className="max-w-4xl mx-auto animate-fade-in">
                <div className="text-center py-20">
                    <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">🔍</span>
                    </div>
                    <h2 className="text-lg font-semibold text-neutral-700 mb-2">
                        {error || "Entry not found"}
                    </h2>
                    <p className="text-neutral-500 text-sm mb-4">
                        The journal entry you're looking for doesn't exist or has been deleted.
                    </p>
                    <div className="text-xs text-neutral-400 mb-4">
                        ID: {entryId}
                    </div>
                    <Link href="/dashboard" className="text-sm font-semibold text-primary-600 hover:text-primary-700">
                        ← Back to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    // Prepare body markers in the format BodyMap expects
    const bodyMarkers: Omit<BodyMarker, "id" | "entryId" | "userId" | "createdAt">[] =
        (entry.bodyMarkers || []).map(marker => ({
            bodyRegion: marker.bodyRegion,
            xPos: marker.xPos,
            yPos: marker.yPos,
            symptom: marker.symptom,
            intensity: marker.intensity,
        }));

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <Link href="/dashboard" className="text-sm text-neutral-500 hover:text-neutral-700 mb-1 inline-flex items-center gap-1">
                        ← Back to Dashboard
                    </Link>
                    <h1 className="text-2xl font-bold text-neutral-900">
                        {formatDate(entry.entryDate)}
                    </h1>
                    <p className="text-neutral-500 text-sm mt-0.5">
                        {new Date(entry.entryDate).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                    </p>
                </div>
                <button
                    onClick={() => router.push(`/journal/edit/${entryId}`)}
                    className="inline-flex items-center px-4 py-2 text-sm font-semibold text-primary-600 hover:text-primary-700"
                >
                    Edit Entry
                </button>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* ---- Left Column: Body Map ---- */}
                <div>
                    <BodyMap
                        markers={bodyMarkers}
                        onAddMarker={() => { }}
                        onRemoveMarker={() => { }}
                        readonly={true}
                    />
                </div>

                {/* ---- Right Column: Factor Scales ---- */}
                <div className="space-y-4">
                    {/* Sleep */}
                    {entry.sleepHours && (
                        <div className="bg-white rounded-xl border border-neutral-200/50 p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-lg">🛌</span>
                                <span className="text-sm font-semibold text-neutral-700">Sleep</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-2xl font-bold text-neutral-800">{entry.sleepHours}h</span>
                                {entry.sleepQuality && (
                                    <span className={cn("text-sm font-medium", getScaleColor(entry.sleepQuality))}>
                                        {SLEEP_LABELS[entry.sleepQuality - 1]}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Mood */}
                    {entry.moodScore && (
                        <div className="bg-white rounded-xl border border-neutral-200/50 p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-lg">😊</span>
                                <span className="text-sm font-semibold text-neutral-700">Mood</span>
                            </div>
                            <span className={cn("text-2xl font-bold", getScaleColor(entry.moodScore))}>
                                {getScaleLabel(entry.moodScore, "mood")}
                            </span>
                        </div>
                    )}

                    {/* Energy */}
                    {entry.energyLevel && (
                        <div className="bg-white rounded-xl border border-neutral-200/50 p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-lg">⚡</span>
                                <span className="text-sm font-semibold text-neutral-700">Energy</span>
                            </div>
                            <span className={cn("text-2xl font-bold", getScaleColor(entry.energyLevel))}>
                                {getScaleLabel(entry.energyLevel, "energy")}
                            </span>
                        </div>
                    )}

                    {/* Stress */}
                    {entry.stressLevel && (
                        <div className="bg-white rounded-xl border border-neutral-200/50 p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-lg">🧠</span>
                                <span className="text-sm font-semibold text-neutral-700">Stress</span>
                            </div>
                            <span className={cn("text-2xl font-bold", getScaleColor(entry.stressLevel, true))}>
                                {getScaleLabel(entry.stressLevel, "stress")}
                            </span>
                        </div>
                    )}

                    {/* Water */}
                    {entry.waterIntakeMl && (
                        <div className="bg-white rounded-xl border border-neutral-200/50 p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-lg">💧</span>
                                <span className="text-sm font-semibold text-neutral-700">Water Intake</span>
                            </div>
                            <span className="text-2xl font-bold text-primary-600">
                                {Math.round(entry.waterIntakeMl / 250)} glasses
                            </span>
                        </div>
                    )}

                    {/* Exercise */}
                    {(entry.exerciseMins || entry.exerciseType) && (
                        <div className="bg-white rounded-xl border border-neutral-200/50 p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-lg">🏃</span>
                                <span className="text-sm font-semibold text-neutral-700">Exercise</span>
                            </div>
                            <div className="flex items-center gap-4">
                                {entry.exerciseType && (
                                    <span className="text-neutral-700">{entry.exerciseType}</span>
                                )}
                                {entry.exerciseMins && (
                                    <span className="text-neutral-500">{entry.exerciseMins} minutes</span>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ---- Meals ---- */}
            {entry.meals && entry.meals.length > 0 && (
                <div className="mt-6 bg-white rounded-xl border border-neutral-200/50 p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg">🍽️</span>
                        <span className="text-sm font-semibold text-neutral-700">Meals</span>
                    </div>
                    <div className="space-y-2">
                        {entry.meals.map((meal, i) => {
                            const mealInfo = MEAL_TYPES.find((m) => m.id === meal.mealType);
                            return (
                                <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-neutral-50">
                                    <span>{mealInfo?.icon || "🍽️"}</span>
                                    <span className="font-medium text-neutral-700">{mealInfo?.label || meal.mealType}</span>
                                    <span className="text-neutral-400">·</span>
                                    <span className="text-neutral-500">{meal.description}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ---- Notes ---- */}
            {entry.notes && (
                <div className="mt-6 bg-white rounded-xl border border-neutral-200/50 p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg">📝</span>
                        <span className="text-sm font-semibold text-neutral-700">Notes</span>
                    </div>
                    <p className="text-neutral-600 text-sm whitespace-pre-wrap">{entry.notes}</p>
                </div>
            )}
        </div>
    );
}
