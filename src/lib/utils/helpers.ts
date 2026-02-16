/* ============================================================
   Meridian — Utility Helpers
   ============================================================ */

import { MOOD_LABELS, ENERGY_LABELS, STRESS_LABELS, SLEEP_LABELS } from "./constants";

/**
 * Merge CSS class names, filtering out falsy values.
 * Lightweight alternative to clsx.
 */
export function cn(...classes: (string | false | null | undefined)[]): string {
    return classes.filter(Boolean).join(" ");
}

/**
 * Format a date string for display.
 * Returns: "Feb 15, 2026"
 */
export function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

/**
 * Format relative time: "Today", "Yesterday", "3 days ago"
 */
export function formatRelativeDate(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return formatDate(dateStr);
}

/**
 * Get a human-readable label for a numeric scale value.
 */
export function getScaleLabel(
    value: number | null,
    scale: "mood" | "energy" | "stress" | "sleep"
): string {
    if (value === null || value < 1 || value > 5) return "—";
    const labels = {
        mood: MOOD_LABELS,
        energy: ENERGY_LABELS,
        stress: STRESS_LABELS,
        sleep: SLEEP_LABELS,
    };
    return labels[scale][value - 1];
}

/**
 * Get color for a 1–5 scale value.
 * 1 = red, 3 = yellow, 5 = green (inverted for stress)
 */
export function getScaleColor(
    value: number | null,
    invert = false
): string {
    if (value === null) return "text-neutral-400";
    const v = invert ? 6 - value : value;
    if (v <= 2) return "text-danger-500";
    if (v <= 3) return "text-warning-500";
    return "text-success-500";
}

/**
 * Generate a UUID v4.
 */
export function generateId(): string {
    return crypto.randomUUID();
}

/**
 * Clamp a number between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

/**
 * Debounce function - delays invoking func until after wait ms.
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), wait);
    };
}

/**
 * Get today's date as ISO string (YYYY-MM-DD).
 */
export function getTodayISO(): string {
    return new Date().toISOString().split("T")[0];
}

/**
 * Parse a confidence score (0–1) into human-readable text.
 */
export function formatConfidence(confidence: number): string {
    if (confidence >= 0.8) return "High confidence";
    if (confidence >= 0.6) return "Moderate confidence";
    if (confidence >= 0.4) return "Some evidence";
    return "Preliminary";
}

/**
 * Truncate text with ellipsis.
 */
export function truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength - 3) + "...";
}
