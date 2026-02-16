/* ============================================================
   Meridian — Dashboard (Main Page)
   Displays overview metrics, recent entries, quick-log CTA,
   and latest AI insights.
   ============================================================ */
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { cn, formatRelativeDate, getScaleLabel, getScaleColor } from "@/lib/utils/helpers";
import type { JournalEntry, Insight } from "@/types";

/** Metric card with label, value, and trend indicator */
function MetricCard({
    label,
    value,
    sublabel,
    color,
    icon,
}: {
    label: string;
    value: string;
    sublabel: string;
    color: string;
    icon: string;
}) {
    return (
        <div className="bg-white rounded-2xl border border-neutral-200/50 p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between mb-3">
                <span className="text-sm font-medium text-neutral-500">{label}</span>
                <span className="text-xl">{icon}</span>
            </div>
            <div className={cn("text-2xl font-bold", color)}>{value}</div>
            <span className="text-xs text-neutral-400 mt-1">{sublabel}</span>
        </div>
    );
}

/** Empty state when user has no entries */
function EmptyDashboard() {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-primary-50 flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-primary-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M12 2L12 22M2 12L22 12" opacity="0.3" />
                    <circle cx="12" cy="12" r="3" />
                    <circle cx="12" cy="4" r="1.5" opacity="0.5" />
                    <circle cx="12" cy="20" r="1.5" opacity="0.5" />
                    <circle cx="4" cy="12" r="1.5" opacity="0.5" />
                    <circle cx="20" cy="12" r="1.5" opacity="0.5" />
                </svg>
            </div>
            <h2 className="text-xl font-bold text-neutral-800 mb-2">Your journey starts here</h2>
            <p className="text-neutral-500 mb-6 max-w-md">
                Log your first entry to begin tracking patterns. Meridian gets smarter with every day you journal.
            </p>
            <Link
                href="/journal"
                className="inline-flex items-center px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl shadow-md hover:shadow-lg transition-all"
            >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Create First Entry
            </Link>
        </div>
    );
}

export default function DashboardPage() {
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [insights, setInsights] = useState<Insight[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [entriesRes, insightsRes] = await Promise.all([
                    fetch("/api/entries?limit=5"),
                    fetch("/api/insights"),
                ]);
                if (entriesRes.ok) {
                    const data = await entriesRes.json();
                    setEntries(data.entries || []);
                }
                if (insightsRes.ok) {
                    const data = await insightsRes.json();
                    setInsights(data.insights || []);
                }
            } catch (err) {
                console.error("Failed to fetch dashboard data:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="space-y-6 animate-fade-in">
                <div className="h-8 w-48 skeleton" />
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-28 skeleton" />
                    ))}
                </div>
                <div className="h-64 skeleton" />
            </div>
        );
    }

    if (entries.length === 0) {
        return <EmptyDashboard />;
    }

    // Calculate dashboard metrics from recent entries
    const latestEntry = entries[0];
    const avgMood = entries.filter((e) => e.moodScore).reduce((acc, e) => acc + (e.moodScore || 0), 0) / entries.filter((e) => e.moodScore).length || 0;
    const avgSleep = entries.filter((e) => e.sleepHours).reduce((acc, e) => acc + (e.sleepHours || 0), 0) / entries.filter((e) => e.sleepHours).length || 0;
    const avgEnergy = entries.filter((e) => e.energyLevel).reduce((acc, e) => acc + (e.energyLevel || 0), 0) / entries.filter((e) => e.energyLevel).length || 0;

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
                    <p className="text-neutral-500 text-sm mt-0.5">
                        Your health intelligence at a glance
                    </p>
                </div>
                <Link
                    href="/journal"
                    className="inline-flex items-center px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl shadow-md hover:shadow-lg transition-all self-start"
                >
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    New Entry
                </Link>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
                <MetricCard
                    label="Avg Mood"
                    value={avgMood > 0 ? avgMood.toFixed(1) : "—"}
                    sublabel={avgMood > 0 ? getScaleLabel(Math.round(avgMood), "mood") : "No data"}
                    color={getScaleColor(Math.round(avgMood))}
                    icon="😊"
                />
                <MetricCard
                    label="Avg Sleep"
                    value={avgSleep > 0 ? `${avgSleep.toFixed(1)}h` : "—"}
                    sublabel={avgSleep >= 7 ? "On target" : avgSleep > 0 ? "Below target" : "No data"}
                    color={avgSleep >= 7 ? "text-success-500" : avgSleep > 0 ? "text-warning-500" : "text-neutral-400"}
                    icon="😴"
                />
                <MetricCard
                    label="Avg Energy"
                    value={avgEnergy > 0 ? avgEnergy.toFixed(1) : "—"}
                    sublabel={avgEnergy > 0 ? getScaleLabel(Math.round(avgEnergy), "energy") : "No data"}
                    color={getScaleColor(Math.round(avgEnergy))}
                    icon="⚡"
                />
                <MetricCard
                    label="Total Entries"
                    value={entries.length.toString()}
                    sublabel={entries.length >= 7 ? "Insights ready!" : `${7 - entries.length} more for insights`}
                    color="text-accent-500"
                    icon="📊"
                />
            </div>

            {/* Two-column: Recent Entries + AI Insights */}
            <div className="grid lg:grid-cols-5 gap-6">
                {/* Recent Entries */}
                <div className="lg:col-span-3">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-neutral-800">Recent Entries</h2>
                        <Link href="/timeline" className="text-sm text-primary-600 font-medium hover:text-primary-700 transition-colors">
                            View All →
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {entries.map((entry) => (
                            <Link
                                key={entry.id}
                                href={`/journal/${entry.id}`}
                                className="block bg-white rounded-xl border border-neutral-200/50 p-4 hover:border-primary-200 hover:shadow-sm transition-all duration-200"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-semibold text-neutral-700">
                                        {formatRelativeDate(entry.entryDate)}
                                    </span>
                                    <span className="text-xs text-neutral-400">
                                        {new Date(entry.entryDate).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 text-sm">
                                    {entry.moodScore && (
                                        <span className={cn("font-medium", getScaleColor(entry.moodScore))}>
                                            Mood: {getScaleLabel(entry.moodScore, "mood")}
                                        </span>
                                    )}
                                    {entry.sleepHours && (
                                        <span className="text-neutral-500">
                                            Sleep: {entry.sleepHours}h
                                        </span>
                                    )}
                                    {entry.energyLevel && (
                                        <span className="text-neutral-500">
                                            Energy: {getScaleLabel(entry.energyLevel, "energy")}
                                        </span>
                                    )}
                                </div>
                                {entry.notes && (
                                    <p className="text-xs text-neutral-400 mt-2 line-clamp-1">
                                        {entry.notes}
                                    </p>
                                )}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* AI Insights */}
                <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-neutral-800">AI Insights</h2>
                        <Link href="/insights" className="text-sm text-primary-600 font-medium hover:text-primary-700 transition-colors">
                            View All →
                        </Link>
                    </div>
                    {insights.length === 0 ? (
                        <div className="bg-white rounded-xl border border-neutral-200/50 p-6 text-center">
                            <div className="w-12 h-12 rounded-full bg-accent-50 flex items-center justify-center mx-auto mb-3">
                                <span className="text-xl">🧠</span>
                            </div>
                            <h3 className="text-sm font-semibold text-neutral-700 mb-1">
                                Collecting data...
                            </h3>
                            <p className="text-xs text-neutral-400">
                                {entries.length < 7
                                    ? `${7 - entries.length} more entries needed for AI insights`
                                    : "Generating your first insights..."}
                            </p>
                            {/* Progress bar */}
                            <div className="mt-4 h-2 bg-neutral-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-accent-400 to-primary-400 rounded-full transition-all duration-500"
                                    style={{ width: `${Math.min(100, (entries.length / 7) * 100)}%` }}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {insights.slice(0, 3).map((insight) => (
                                <div
                                    key={insight.id}
                                    className="bg-gradient-to-br from-white to-accent-50/30 rounded-xl border border-accent-100/50 p-4 hover:shadow-sm transition-all"
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse" />
                                        <span className="text-xs font-semibold uppercase tracking-wider text-accent-600">
                                            {insight.insightType}
                                        </span>
                                        <span className="ml-auto text-xs text-neutral-400 font-medium">
                                            {Math.round(insight.confidence * 100)}%
                                        </span>
                                    </div>
                                    <h3 className="text-sm font-semibold text-neutral-800 mb-1">
                                        {insight.title}
                                    </h3>
                                    <p className="text-xs text-neutral-500 leading-relaxed line-clamp-2">
                                        {insight.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
