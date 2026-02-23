"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import BodyMap from "@/components/body-map/BodyMap";
import { cn } from "@/lib/utils/helpers";
import {
    EXERCISE_TYPES,
    MEAL_TYPES,
    MOOD_LABELS,
    ENERGY_LABELS,
    STRESS_LABELS,
    SLEEP_LABELS,
} from "@/lib/utils/constants";
import type { BodyMarker, JournalEntry } from "@/types";
function ScaleSlider({
    label,
    value,
    onChange,
    labels,
    icon,
}: {
    label: string;
    value: number;
    onChange: (v: number) => void;
    labels: readonly string[];
    icon: string;
}) {
    return (
        <div className="bg-white rounded-xl border border-neutral-200/50 p-4">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <span className="text-lg">{icon}</span>
                    <span className="text-sm font-semibold text-neutral-700">{label}</span>
                </div>
                <span
                    className={cn(
                        "text-sm font-bold",
                        value <= 2
                            ? "text-danger-500"
                            : value === 3
                                ? "text-warning-500"
                                : "text-success-500"
                    )}
                >
                    {labels[value - 1]}
                </span>
            </div>

            <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((v) => (
                    <button
                        key={v}
                        type="button"
                        onClick={() => onChange(v)}
                        className={cn(
                            "flex-1 py-2 rounded-lg text-xs font-semibold transition-all duration-200",
                            value === v
                                ? v <= 2
                                    ? "bg-danger-500 text-white shadow-md"
                                    : v === 3
                                        ? "bg-warning-500 text-white shadow-md"
                                        : "bg-success-500 text-white shadow-md"
                                : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
                        )}
                    >
                        {v}
                    </button>
                ))}
            </div>
        </div>
    );
}
interface MealEntry {
    mealType: string;
    description: string;
}

export default function EditJournalPage() {
    const router = useRouter();
    const params = useParams();
    const entryId = params?.id as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const [entryDate, setEntryDate] = useState("");
    const [sleepHours, setSleepHours] = useState(7);
    const [sleepQuality, setSleepQuality] = useState(3);
    const [moodScore, setMoodScore] = useState(3);
    const [energyLevel, setEnergyLevel] = useState(3);
    const [stressLevel, setStressLevel] = useState(3);
    const [exerciseMins, setExerciseMins] = useState(0);
    const [exerciseType, setExerciseType] = useState("");
    const [waterIntake, setWaterIntake] = useState(8);
    const [notes, setNotes] = useState("");

    const [bodyMarkers, setBodyMarkers] = useState<
        Omit<BodyMarker, "id" | "entryId" | "userId" | "createdAt">[]
    >([]);

    const [meals, setMeals] = useState<MealEntry[]>([]);
    const [activeMealType, setActiveMealType] = useState("");
    const [mealDescription, setMealDescription] = useState("");

    function addMeal() {
        if (!activeMealType || !mealDescription.trim()) return;

        setMeals((prev) => [
            ...prev,
            {
                mealType: activeMealType,
                description: mealDescription.trim(),
            },
        ]);

        setMealDescription("");
        setActiveMealType("");
    }

    function removeMeal(index: number) {
        setMeals((prev) => prev.filter((_, i) => i !== index));
    }
    // Fetch existing entry
    useEffect(() => {
        async function fetchEntry() {
            try {
                const res = await fetch(`/api/entries/${entryId}`);
                if (!res.ok) throw new Error("Failed to load entry");

                const data = await res.json();
                const entry: JournalEntry = data.entry;

                setEntryDate(entry.entryDate);
                setSleepHours(entry.sleepHours || 0);
                setSleepQuality(entry.sleepQuality || 3);
                setMoodScore(entry.moodScore || 3);
                setEnergyLevel(entry.energyLevel || 3);
                setStressLevel(entry.stressLevel || 3);
                setExerciseMins(entry.exerciseMins || 0);
                setExerciseType(entry.exerciseType || "");
                setWaterIntake(Math.round((entry.waterIntakeMl || 0) / 250));
                setNotes(entry.notes || "");

                setBodyMarkers(
                    (entry.bodyMarkers || []).map((marker) => ({
                        bodyRegion: marker.bodyRegion,
                        xPos: marker.xPos,
                        yPos: marker.yPos,
                        symptom: marker.symptom,
                        intensity: marker.intensity,
                    }))
                );

                setMeals(
                    (entry.meals || []).map((meal) => ({
                        mealType: meal.mealType,
                        description: meal.description,
                    }))
                );
            } catch (err) {
                setError("Failed to load entry");
            } finally {
                setLoading(false);
            }
        }

        fetchEntry();
    }, [entryId]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (saving) return;

        setSaving(true);
        setError("");

        try {
            const res = await fetch(`/api/entries`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    entryDate,
                    sleepHours,
                    sleepQuality,
                    moodScore,
                    energyLevel,
                    stressLevel,
                    exerciseMins,
                    exerciseType: exerciseType || null,
                    waterIntakeMl: waterIntake * 250,
                    notes: notes || null,
                    bodyMarkers,
                    meals,
                }),
            });

            if (!res.ok) throw new Error("Failed to update entry");

            router.push(`/journal/${entryId}`);
        } catch (err) {
            setError("Failed to update entry");
        } finally {
            setSaving(false);
        }
    }

    if (loading) return <div className="max-w-4xl mx-auto">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            <h1 className="text-2xl font-bold mb-6">Edit Journal Entry</h1>

            {error && (
                <div className="mb-4 p-3 bg-danger-100 text-danger-600 rounded-xl text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="grid lg:grid-cols-2 gap-6">
                    {/* ---- Left Column: Body Map ---- */}
                    <div>
                        <BodyMap
                            markers={bodyMarkers}
                            onAddMarker={(marker) => setBodyMarkers((prev) => [...prev, marker])}
                            onRemoveMarker={(i) => setBodyMarkers((prev) => prev.filter((_, idx) => idx !== i))}
                        />
                    </div>

                    {/* ---- Right Column: Factor Scales ---- */}
                    <div className="space-y-4">
                        {/* Sleep hours */}
                        <div className="bg-white rounded-xl border border-neutral-200/50 p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">🛌</span>
                                    <span className="text-sm font-semibold text-neutral-700">Sleep Hours</span>
                                </div>
                                <span className="text-sm font-bold text-neutral-800">{sleepHours}h</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="14"
                                step="0.5"
                                value={sleepHours}
                                onChange={(e) => setSleepHours(Number(e.target.value))}
                                className="w-full accent-primary-500"
                            />
                            <div className="flex justify-between text-xs text-neutral-400 mt-1">
                                <span>0h</span>
                                <span>14h</span>
                            </div>
                        </div>

                        <ScaleSlider label="Sleep Quality" value={sleepQuality} onChange={setSleepQuality} labels={SLEEP_LABELS} icon="😴" />
                        <ScaleSlider label="Mood" value={moodScore} onChange={setMoodScore} labels={MOOD_LABELS} icon="😊" />
                        <ScaleSlider label="Energy" value={energyLevel} onChange={setEnergyLevel} labels={ENERGY_LABELS} icon="⚡" />
                        <ScaleSlider label="Stress" value={stressLevel} onChange={setStressLevel} labels={STRESS_LABELS} icon="🧠" />

                        {/* Water intake */}
                        <div className="bg-white rounded-xl border border-neutral-200/50 p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">💧</span>
                                    <span className="text-sm font-semibold text-neutral-700">Water Intake</span>
                                </div>
                                <span className="text-sm font-bold text-primary-600">{waterIntake} glasses</span>
                            </div>
                            <div className="flex gap-1">
                                {[...Array(12)].map((_, i) => (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() => setWaterIntake(i + 1)}
                                        className={cn(
                                            "flex-1 h-6 rounded-md transition-all",
                                            i < waterIntake
                                                ? "bg-primary-400"
                                                : "bg-neutral-100"
                                        )}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ---- Exercise ---- */}
                <div className="mt-6 bg-white rounded-xl border border-neutral-200/50 p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg">🏃</span>
                        <span className="text-sm font-semibold text-neutral-700">Exercise</span>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-medium text-neutral-500 mb-1.5 block">Type</label>
                            <select
                                value={exerciseType}
                                onChange={(e) => setExerciseType(e.target.value)}
                                className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50/50 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                            >
                                <option value="">None</option>
                                {EXERCISE_TYPES.map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-neutral-500 mb-1.5 block">Duration (minutes)</label>
                            <input
                                type="number"
                                min={0}
                                max={300}
                                value={exerciseMins}
                                onChange={(e) => setExerciseMins(Number(e.target.value))}
                                className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50/50 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                            />
                        </div>
                    </div>
                </div>

                {/* ---- Meals ---- */}
                <div className="mt-6 bg-white rounded-xl border border-neutral-200/50 p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg">🍽️</span>
                        <span className="text-sm font-semibold text-neutral-700">Meals</span>
                    </div>
                    {/* Logged meals */}
                    {meals.length > 0 && (
                        <div className="space-y-2 mb-4">
                            {meals.map((meal, i) => {
                                const mealInfo = MEAL_TYPES.find((m) => m.id === meal.mealType);
                                return (
                                    <div key={i} className="flex items-center justify-between px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-100">
                                        <div className="flex items-center gap-2 text-sm">
                                            <span>{mealInfo?.icon || "🍽️"}</span>
                                            <span className="font-medium text-neutral-700">{mealInfo?.label || meal.mealType}</span>
                                            <span className="text-neutral-400">·</span>
                                            <span className="text-neutral-500">{meal.description}</span>
                                        </div>
                                        <button type="button" onClick={() => removeMeal(i)} className="text-xs text-neutral-400 hover:text-danger-500 transition-colors">
                                            ✕
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    {/* Add meal */}
                    <div className="flex flex-col sm:flex-row gap-2">
                        <div className="flex gap-1.5">
                            {MEAL_TYPES.map((mt) => (
                                <button
                                    key={mt.id}
                                    type="button"
                                    onClick={() => setActiveMealType(activeMealType === mt.id ? "" : mt.id)}
                                    className={cn(
                                        "px-3 py-2 rounded-xl text-xs font-medium transition-all",
                                        activeMealType === mt.id
                                            ? "bg-primary-500 text-white"
                                            : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                                    )}
                                >
                                    {mt.icon} {mt.label}
                                </button>
                            ))}
                        </div>
                        {activeMealType && (
                            <div className="flex gap-2 flex-1">
                                <input
                                    type="text"
                                    value={mealDescription}
                                    onChange={(e) => setMealDescription(e.target.value)}
                                    placeholder="What did you eat?"
                                    className="flex-1 px-3 py-2 rounded-xl border border-neutral-200 bg-neutral-50/50 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addMeal())}
                                />
                                <button
                                    type="button"
                                    onClick={addMeal}
                                    className="px-3 py-2 rounded-xl bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 transition-all"
                                >
                                    Add
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* ---- Notes ---- */}
                <div className="mt-6 bg-white rounded-xl border border-neutral-200/50 p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg">📝</span>
                        <span className="text-sm font-semibold text-neutral-700">Notes</span>
                    </div>
                    <textarea
                        rows={4}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Any other observations about your day? How did you feel overall?"
                        className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50/50 text-sm text-neutral-700 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 resize-none"
                    />
                </div>

                {/* ---- Submit ---- */}
                <div className="mt-8 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-5 py-2.5 rounded-xl border border-neutral-200 text-neutral-600 text-sm font-medium hover:bg-neutral-50 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-semibold shadow-md hover:shadow-lg disabled:opacity-50 transition-all"
                    >
                        {saving ? (
                            <span className="flex items-center gap-2">
                                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                                    <path d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" fill="currentColor" className="opacity-75" />
                                </svg>
                                Updating...
                            </span>
                        ) : (
                            "Update Entry"
                        )}
                    </button>
                </div>
                {/* 🔥 PASTE EVERYTHING from your journal/page.tsx form here */}
                {/* IMPORTANT: Replace Save button text with: */}
                {/* {saving ? "Updating..." : "Update Entry"} */}
            </form>
        </div>
    );
}