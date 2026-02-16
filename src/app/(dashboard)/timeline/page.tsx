/* ============================================================
   Meridian — Timeline Page
   Historical view with trend charts and entry history.
   ============================================================ */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn, formatDate, getScaleLabel, getScaleColor } from "@/lib/utils/helpers";
import type { JournalEntry } from "@/types";

/** Simple trend sparkline using SVG */
function Sparkline({ data, color }: { data: number[]; color: string }) {
    if (data.length < 2) return null;
    const max = Math.max(...data, 5);
    const min = Math.min(...data, 1);
    const range = max - min || 1;
    const width = 200;
    const height = 40;
    const points = data.map((v, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((v - min) / range) * height;
        return `${x},${y}`;
    }).join(" ");

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-10">
            <polyline
                points={points}
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            {/* Gradient fill under line */}
            <defs>
                <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.2" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <polygon
                points={`0,${height} ${points} ${width},${height}`}
                fill={`url(#grad-${color})`}
            />
        </svg>
    );
}

export default function TimelinePage() {
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchEntries() {
            try {
                const res = await fetch("/api/entries?limit=30");
                if (res.ok) {
                    const data = await res.json();
                    setEntries(data.entries || []);
                }
            } catch (err) {
                console.error("Failed to fetch entries:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchEntries();
    }, []);

    if (loading) {
        return (
            <div className="space-y-6 animate-fade-in">
                <div className="h-8 w-48 skeleton" />
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-24 skeleton" />
                    ))}
                </div>
                <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-20 skeleton" />
                    ))}
                </div>
            </div>
        );
    }

    // Extract trend data (reverse so oldest first)
    const reversed = [...entries].reverse();
    const moodData = reversed.map((e) => e.moodScore || 3);
    const sleepData = reversed.map((e) => e.sleepHours || 7);
    const energyData = reversed.map((e) => e.energyLevel || 3);
    const stressData = reversed.map((e) => e.stressLevel || 3);

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-neutral-900">Timeline</h1>
                <p className="text-neutral-500 text-sm mt-0.5">
                    Your health story across time
                </p>
            </div>

            {entries.length === 0 ? (
                <div className="text-center py-20">
                    <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">📊</span>
                    </div>
                    <h2 className="text-lg font-semibold text-neutral-700 mb-2">No entries yet</h2>
                    <p className="text-neutral-500 text-sm mb-4">Start journaling to see your trends here.</p>
                    <Link href="/journal" className="text-sm font-semibold text-primary-600 hover:text-primary-700">
                        Create First Entry →
                    </Link>
                </div>
            ) : (
                <>
                    {/* Trend Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger-children">
                        <div className="bg-white rounded-2xl border border-neutral-200/50 p-4 shadow-sm">
                            <div className="flex items-center gap-2 mb-2">
                                <span>😊</span>
                                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Mood</span>
                            </div>
                            <Sparkline data={moodData} color="#14b8a6" />
                        </div>
                        <div className="bg-white rounded-2xl border border-neutral-200/50 p-4 shadow-sm">
                            <div className="flex items-center gap-2 mb-2">
                                <span>😴</span>
                                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Sleep</span>
                            </div>
                            <Sparkline data={sleepData} color="#8b5cf6" />
                        </div>
                        <div className="bg-white rounded-2xl border border-neutral-200/50 p-4 shadow-sm">
                            <div className="flex items-center gap-2 mb-2">
                                <span>⚡</span>
                                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Energy</span>
                            </div>
                            <Sparkline data={energyData} color="#f59e0b" />
                        </div>
                        <div className="bg-white rounded-2xl border border-neutral-200/50 p-4 shadow-sm">
                            <div className="flex items-center gap-2 mb-2">
                                <span>🧠</span>
                                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Stress</span>
                            </div>
                            <Sparkline data={stressData} color="#ef4444" />
                        </div>
                    </div>

                    {/* Entry History */}
                    <h2 className="text-lg font-semibold text-neutral-800 mb-4">All Entries</h2>
                    <div className="space-y-3">
                        {entries.map((entry) => (
                            <Link
                                key={entry.id}
                                href={`/journal/${entry.id}`}
                                className="block bg-white rounded-xl border border-neutral-200/50 p-4 hover:border-primary-200 hover:shadow-sm transition-all duration-200"
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <span className="text-sm font-semibold text-neutral-700 block">
                                            {formatDate(entry.entryDate)}
                                        </span>
                                        <div className="flex items-center gap-3 mt-1.5 text-sm">
                                            {entry.moodScore && (
                                                <span className={cn("font-medium", getScaleColor(entry.moodScore))}>
                                                    😊 {getScaleLabel(entry.moodScore, "mood")}
                                                </span>
                                            )}
                                            {entry.sleepHours && (
                                                <span className="text-neutral-500">😴 {entry.sleepHours}h</span>
                                            )}
                                            {entry.energyLevel && (
                                                <span className="text-neutral-500">⚡ {getScaleLabel(entry.energyLevel, "energy")}</span>
                                            )}
                                            {entry.stressLevel && (
                                                <span className={cn("font-medium", getScaleColor(entry.stressLevel, true))}>
                                                    🧠 {getScaleLabel(entry.stressLevel, "stress")}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <svg className="w-4 h-4 text-neutral-300 mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                        <path d="M9 18l6-6-6-6" />
                                    </svg>
                                </div>
                                {entry.notes && (
                                    <p className="text-xs text-neutral-400 mt-2 line-clamp-1">{entry.notes}</p>
                                )}
                            </Link>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
