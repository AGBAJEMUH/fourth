/* ============================================================
   Meridian — Insights Page
   AI-generated health insights with correlation cards,
   confidence bars, and feedback mechanisms.
   ============================================================ */
"use client";

import { useState, useEffect } from "react";
import { cn, formatConfidence, formatDate } from "@/lib/utils/helpers";
import type { Insight } from "@/types";
import { MIN_ENTRIES_FOR_INSIGHTS } from "@/lib/utils/constants";

function InsightCard({ insight, onFeedback }: { insight: Insight; onFeedback: (id: string, helpful: boolean) => void }) {
    const typeConfig = {
        correlation: { color: "from-primary-500 to-primary-600", badge: "Correlation", icon: "🔗" },
        prediction: { color: "from-accent-500 to-accent-600", badge: "Prediction", icon: "🔮" },
        trend: { color: "from-warning-500 to-orange-500", badge: "Trend", icon: "📈" },
    };
    const config = typeConfig[insight.insightType];

    return (
        <div className="bg-white rounded-2xl border border-neutral-200/50 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
            {/* Gradient top bar */}
            <div className={cn("h-1.5 bg-gradient-to-r", config.color)} />
            <div className="p-5">
                {/* Badge + confidence */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <span className="text-lg">{config.icon}</span>
                        <span className={cn("text-xs font-semibold uppercase tracking-wider bg-gradient-to-r bg-clip-text text-transparent", config.color)}>
                            {config.badge}
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="h-1.5 w-16 bg-neutral-100 rounded-full overflow-hidden">
                            <div
                                className={cn("h-full rounded-full bg-gradient-to-r", config.color)}
                                style={{ width: `${insight.confidence * 100}%` }}
                            />
                        </div>
                        <span className="text-xs text-neutral-500 font-medium">
                            {Math.round(insight.confidence * 100)}%
                        </span>
                    </div>
                </div>

                {/* Title + description */}
                <h3 className="text-base font-bold text-neutral-800 mb-2">{insight.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed mb-4">{insight.description}</p>

                {/* Factors */}
                {insight.factors && insight.factors.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                        {insight.factors.map((factor, i) => (
                            <span
                                key={i}
                                className={cn(
                                    "px-2.5 py-1 rounded-lg text-xs font-medium",
                                    factor.direction === "positive"
                                        ? "bg-success-500/10 text-success-500"
                                        : factor.direction === "negative"
                                            ? "bg-danger-500/10 text-danger-500"
                                            : "bg-neutral-100 text-neutral-600"
                                )}
                            >
                                {factor.name}
                            </span>
                        ))}
                    </div>
                )}

                {/* Feedback */}
                <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                    <span className="text-xs text-neutral-400">{formatConfidence(insight.confidence)}</span>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onFeedback(insight.id, true)}
                            className="p-1.5 rounded-lg hover:bg-success-500/10 text-neutral-400 hover:text-success-500 transition-all"
                            title="Helpful"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z" />
                                <path d="M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" />
                            </svg>
                        </button>
                        <button
                            onClick={() => onFeedback(insight.id, false)}
                            className="p-1.5 rounded-lg hover:bg-danger-500/10 text-neutral-400 hover:text-danger-500 transition-all"
                            title="Not helpful"
                        >
                            <svg className="w-4 h-4 rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z" />
                                <path d="M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function InsightsPage() {
    const [insights, setInsights] = useState<Insight[]>([]);
    const [entryCount, setEntryCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const [insightsRes, entriesRes] = await Promise.all([
                    fetch("/api/insights"),
                    fetch("/api/entries?limit=1"),
                ]);
                if (insightsRes.ok) {
                    const data = await insightsRes.json();
                    setInsights(data.insights || []);
                }
                if (entriesRes.ok) {
                    const data = await entriesRes.json();
                    setEntryCount(data.totalCount || 0);
                }
            } catch (err) {
                console.error("Failed to fetch insights:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    async function generateInsights() {
        setGenerating(true);
        try {
            const res = await fetch("/api/insights/generate", { method: "POST" });
            if (res.ok) {
                const data = await res.json();
                setInsights(data.insights || []);
            }
        } catch (err) {
            console.error("Failed to generate insights:", err);
        } finally {
            setGenerating(false);
        }
    }

    async function handleFeedback(insightId: string, helpful: boolean) {
        try {
            await fetch(`/api/insights/${insightId}/feedback`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ helpful }),
            });
            // Visual feedback (could update state)
        } catch (err) {
            console.error("Failed to submit feedback:", err);
        }
    }

    if (loading) {
        return (
            <div className="space-y-6 animate-fade-in">
                <div className="h-8 w-48 skeleton" />
                <div className="grid md:grid-cols-2 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-48 skeleton" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900">AI Insights</h1>
                    <p className="text-neutral-500 text-sm mt-0.5">
                        Patterns and correlations discovered from your data
                    </p>
                </div>
                {entryCount >= MIN_ENTRIES_FOR_INSIGHTS && (
                    <button
                        onClick={generateInsights}
                        disabled={generating}
                        className="inline-flex items-center px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-accent-500 to-accent-600 rounded-xl shadow-md hover:shadow-lg disabled:opacity-50 transition-all self-start"
                    >
                        {generating ? (
                            <span className="flex items-center gap-2">
                                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                                    <path d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" fill="currentColor" className="opacity-75" />
                                </svg>
                                Analyzing...
                            </span>
                        ) : (
                            <>
                                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                    <path d="M12 2L2 7 12 12 22 7 12 2z" />
                                    <path d="M2 17L12 22 22 17" />
                                    <path d="M2 12L12 17 22 12" />
                                </svg>
                                Generate Insights
                            </>
                        )}
                    </button>
                )}
            </div>

            {entryCount < MIN_ENTRIES_FOR_INSIGHTS ? (
                /* Not enough data */
                <div className="max-w-md mx-auto text-center py-16">
                    <div className="w-24 h-24 rounded-full bg-accent-50 flex items-center justify-center mx-auto mb-6">
                        <span className="text-4xl">🧠</span>
                    </div>
                    <h2 className="text-xl font-bold text-neutral-800 mb-2">
                        Almost there!
                    </h2>
                    <p className="text-neutral-500 mb-6">
                        Meridian needs at least {MIN_ENTRIES_FOR_INSIGHTS} journal entries to start
                        finding patterns. You have {entryCount} so far.
                    </p>
                    <div className="h-3 bg-neutral-100 rounded-full overflow-hidden max-w-xs mx-auto mb-2">
                        <div
                            className="h-full bg-gradient-to-r from-accent-400 to-primary-400 rounded-full transition-all duration-700"
                            style={{ width: `${(entryCount / MIN_ENTRIES_FOR_INSIGHTS) * 100}%` }}
                        />
                    </div>
                    <span className="text-xs text-neutral-400">
                        {MIN_ENTRIES_FOR_INSIGHTS - entryCount} more entries needed
                    </span>
                </div>
            ) : insights.length === 0 ? (
                /* Has enough data but no insights yet */
                <div className="max-w-md mx-auto text-center py-16">
                    <div className="w-24 h-24 rounded-full bg-accent-50 flex items-center justify-center mx-auto mb-6 breathe">
                        <span className="text-4xl">✨</span>
                    </div>
                    <h2 className="text-xl font-bold text-neutral-800 mb-2">
                        Ready for analysis
                    </h2>
                    <p className="text-neutral-500 mb-6">
                        You have enough data! Click &ldquo;Generate Insights&rdquo; to let AI analyze your patterns.
                    </p>
                </div>
            ) : (
                /* Insights grid */
                <div className="grid md:grid-cols-2 gap-6 stagger-children">
                    {insights.map((insight) => (
                        <InsightCard key={insight.id} insight={insight} onFeedback={handleFeedback} />
                    ))}
                </div>
            )}

            {/* Disclaimer */}
            <div className="mt-12 p-4 rounded-xl bg-neutral-100/50 border border-neutral-200/50 text-center">
                <p className="text-xs text-neutral-400">
                    ⚕️ Meridian provides pattern analysis, not medical advice. Always consult a healthcare provider for medical decisions.
                </p>
            </div>
        </div>
    );
}
