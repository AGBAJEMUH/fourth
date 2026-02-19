/* ============================================================
   Meridian — AI Insight Generation API
   POST /api/insights/generate
   Analyzes user health data and generates AI-powered insights
   using a local correlation engine (no external API required).
   ============================================================ */

import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/config";
import {
    getAllEntriesForAnalysis,
    getAllMarkersForUser,
    createInsight,
    getInsights,
} from "@/lib/db";
import type { DbEntry, DbBodyMarker } from "@/lib/db";

// ---- Correlation Analysis Engine ----

interface FactorPair {
    factorA: string;
    factorB: string;
    correlation: number;
    direction: "positive" | "negative" | "neutral";
    strength: number;
}

/**
 * Compute Pearson correlation coefficient between two number arrays.
 */
function pearsonCorrelation(x: number[], y: number[]): number {
    const n = x.length;
    if (n < 3) return 0;

    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((a, xi, i) => a + xi * y[i], 0);
    const sumX2 = x.reduce((a, xi) => a + xi * xi, 0);
    const sumY2 = y.reduce((a, yi) => a + yi * yi, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt(
        (n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY)
    );

    if (denominator === 0) return 0;
    return numerator / denominator;
}

/**
 * Extract factor time series from entries.
 */
function extractFactors(entries: DbEntry[]): Record<string, number[]> {
    const factors: Record<string, number[]> = {
        sleepHours: [],
        sleepQuality: [],
        moodScore: [],
        energyLevel: [],
        stressLevel: [],
        exerciseMins: [],
        waterIntakeMl: [],
    };

    for (const entry of entries) {
        factors.sleepHours.push(entry.sleepHours ?? 7);
        factors.sleepQuality.push(entry.sleepQuality ?? 3);
        factors.moodScore.push(entry.moodScore ?? 3);
        factors.energyLevel.push(entry.energyLevel ?? 3);
        factors.stressLevel.push(entry.stressLevel ?? 3);
        factors.exerciseMins.push(entry.exerciseMins ?? 0);
        factors.waterIntakeMl.push(entry.waterIntakeMl ?? 2000);
    }

    return factors;
}

/**
 * Find all significant correlations between factor pairs.
 */
function findCorrelations(
    factors: Record<string, number[]>,
    threshold = 0.3
): FactorPair[] {
    const keys = Object.keys(factors);
    const pairs: FactorPair[] = [];

    for (let i = 0; i < keys.length; i++) {
        for (let j = i + 1; j < keys.length; j++) {
            const keyA = keys[i];
            const keyB = keys[j];
            const r = pearsonCorrelation(factors[keyA], factors[keyB]);

            if (Math.abs(r) >= threshold) {
                pairs.push({
                    factorA: keyA,
                    factorB: keyB,
                    correlation: r,
                    direction: r > 0 ? "positive" : "negative",
                    strength: Math.abs(r),
                });
            }
        }
    }

    // Sort by strength (descending)
    return pairs.sort((a, b) => b.strength - a.strength);
}

/**
 * Detect trends (moving average slope) in factor data.
 */
function detectTrends(
    factors: Record<string, number[]>
): { factor: string; slope: number; direction: string }[] {
    const trends: { factor: string; slope: number; direction: string }[] = [];

    for (const [key, values] of Object.entries(factors)) {
        if (values.length < 5) continue;

        // Simple linear regression slope
        const n = values.length;
        const xMean = (n - 1) / 2;
        const yMean = values.reduce((a, b) => a + b, 0) / n;

        let numerator = 0;
        let denominator = 0;
        for (let i = 0; i < n; i++) {
            numerator += (i - xMean) * (values[i] - yMean);
            denominator += (i - xMean) * (i - xMean);
        }

        const slope = denominator !== 0 ? numerator / denominator : 0;

        // Only report significant trends
        if (Math.abs(slope) > 0.05) {
            trends.push({
                factor: key,
                slope,
                direction: slope > 0 ? "improving" : "declining",
            });
        }
    }

    return trends;
}

/**
 * Analyze symptom frequency by body region.
 */
function analyzeSymptoms(
    markers: DbBodyMarker[]
): { region: string; symptom: string; count: number; avgIntensity: number }[] {
    const grouping: Record<string, { count: number; totalIntensity: number }> = {};

    for (const marker of markers) {
        const key = `${marker.bodyRegion}:${marker.symptom}`;
        if (!grouping[key]) {
            grouping[key] = { count: 0, totalIntensity: 0 };
        }
        grouping[key].count++;
        grouping[key].totalIntensity += marker.intensity;
    }

    return Object.entries(grouping)
        .map(([key, val]) => {
            const [region, symptom] = key.split(":");
            return {
                region,
                symptom,
                count: val.count,
                avgIntensity: val.totalIntensity / val.count,
            };
        })
        .sort((a, b) => b.count - a.count);
}

/** Utility to format factor name for display */
function formatFactorName(factor: string): string {
    const names: Record<string, string> = {
        sleepHours: "Sleep Duration",
        sleepQuality: "Sleep Quality",
        moodScore: "Mood",
        energyLevel: "Energy",
        stressLevel: "Stress",
        exerciseMins: "Exercise",
        waterIntakeMl: "Water Intake",
    };
    return names[factor] || factor;
}

// ---- Route Handler ----

export async function POST() {
    try {
        const user = await getAuthUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const entries = await getAllEntriesForAnalysis(user.id);
        const markers = await getAllMarkersForUser(user.id);

        if (entries.length < 7) {
            return NextResponse.json(
                { error: "Need at least 7 entries for analysis" },
                { status: 400 }
            );
        }

        // Extract and analyze factors
        const factors = extractFactors(entries);
        const correlations = findCorrelations(factors);
        const trends = detectTrends(factors);
        const symptomAnalysis = analyzeSymptoms(markers);

        const generatedInsights: any[] = [];

        // Generate correlation insights
        for (const pair of correlations.slice(0, 3)) {
            const factorA = formatFactorName(pair.factorA);
            const factorB = formatFactorName(pair.factorB);
            const isPositive = pair.direction === "positive";

            let title: string;
            let description: string;

            if (isPositive) {
                title = `${factorA} and ${factorB} move together`;
                description = `When your ${factorA.toLowerCase()} goes up, your ${factorB.toLowerCase()} tends to go up too. This ${Math.round(pair.strength * 100)}% correlation suggests these factors are connected for you.`;
            } else {
                title = `${factorA} inversely affects ${factorB}`;
                description = `Higher ${factorA.toLowerCase()} tends to correspond with lower ${factorB.toLowerCase()}. This inverse relationship (${Math.round(pair.strength * 100)}% strength) is worth monitoring.`;
            }

            const insight = await createInsight({
                userId: user.id,
                insightType: "correlation",
                title,
                description,
                confidence: Math.min(0.95, pair.strength + 0.1),
                factors: [
                    { name: factorA, direction: pair.direction, strength: pair.strength },
                    { name: factorB, direction: pair.direction, strength: pair.strength },
                ],
                supportingData: pair,
                status: "active",
            });
            generatedInsights.push(insight);
        }

        // Generate trend insights
        for (const trend of trends.slice(0, 2)) {
            const factorName = formatFactorName(trend.factor);
            const isStress = trend.factor === "stressLevel";
            const improving = isStress
                ? trend.direction === "declining"
                : trend.direction === "improving";

            const title = improving
                ? `${factorName} is trending upward 📈`
                : `${factorName} needs attention 📉`;

            const description = improving
                ? `Your ${factorName.toLowerCase()} has been gradually improving over your recent entries. Keep up the positive habits!`
                : `Your ${factorName.toLowerCase()} shows a declining trend. Consider reviewing recent lifestyle changes that may be contributing.`;

            const insight = await createInsight({
                userId: user.id,
                insightType: "trend",
                title,
                description,
                confidence: Math.min(0.9, Math.abs(trend.slope) * 5 + 0.5),
                factors: [
                    {
                        name: factorName,
                        direction: improving ? "positive" : "negative",
                        strength: Math.min(1, Math.abs(trend.slope) * 5),
                    },
                ],
                supportingData: trend,
                status: "active",
            });
            generatedInsights.push(insight);
        }

        // Generate symptom insights
        if (symptomAnalysis.length > 0) {
            const topSymptom = symptomAnalysis[0];
            const regionName = topSymptom.region.replace(/_/g, " ");

            const insight = await createInsight({
                userId: user.id,
                insightType: "prediction",
                title: `Recurring ${topSymptom.symptom} in ${regionName}`,
                description: `You've reported ${topSymptom.symptom.toLowerCase()} in your ${regionName} area ${topSymptom.count} times with an average intensity of ${topSymptom.avgIntensity.toFixed(1)}/10. Consider discussing this pattern with your healthcare provider.`,
                confidence: Math.min(0.85, topSymptom.count * 0.1 + 0.4),
                factors: [
                    {
                        name: `${topSymptom.symptom} (${regionName})`,
                        direction: "negative",
                        strength: Math.min(1, topSymptom.avgIntensity / 10),
                    },
                ],
                supportingData: topSymptom,
                status: "active",
            });
            generatedInsights.push(insight);
        }

        return NextResponse.json({
            insights: generatedInsights,
            meta: {
                entriesAnalyzed: entries.length,
                correlationsFound: correlations.length,
                trendsFound: trends.length,
                symptomsTracked: symptomAnalysis.length,
            },
        });
    } catch (error) {
        console.error("Generate insights error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
