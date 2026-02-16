/* ============================================================
   Meridian — Database Layer
   In-memory data store for demo mode (simulates Neon PostgreSQL).
   In production, replace with Drizzle ORM + Neon connection.
   
   This file provides a complete data access layer with the
   same interface as a real database — just swap the implementation.
   ============================================================ */

import { generateId } from "@/lib/utils/helpers";

// ---- In-memory store ----
export interface DbUser {
    id: string;
    email: string;
    passwordHash: string;
    displayName: string | null;
    avatarUrl: string | null;
    provider: string;
    onboardingDone: boolean;
    timezone: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface DbEntry {
    id: string;
    userId: string;
    entryDate: string;
    sleepHours: number | null;
    sleepQuality: number | null;
    stressLevel: number | null;
    energyLevel: number | null;
    moodScore: number | null;
    exerciseMins: number | null;
    exerciseType: string | null;
    waterIntakeMl: number | null;
    notes: string | null;
    weatherTemp: number | null;
    weatherCond: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface DbBodyMarker {
    id: string;
    entryId: string;
    userId: string;
    bodyRegion: string;
    xPos: number;
    yPos: number;
    symptom: string;
    intensity: number;
    createdAt: string;
}

export interface DbMeal {
    id: string;
    entryId: string;
    userId: string;
    mealType: string;
    description: string;
    foods: string[] | null;
    createdAt: string;
}

export interface DbInsight {
    id: string;
    userId: string;
    insightType: string;
    title: string;
    description: string;
    confidence: number;
    factors: { name: string; direction: string; strength: number }[];
    supportingData: unknown | null;
    status: string;
    createdAt: string;
}

export interface DbCondition {
    id: string;
    userId: string;
    condition: string;
    severity: number;
    createdAt: string;
}

// Global in-memory data stores
const users: Map<string, DbUser> = new Map();
const entries: Map<string, DbEntry> = new Map();
const bodyMarkers: Map<string, DbBodyMarker> = new Map();
const meals: Map<string, DbMeal> = new Map();
const insights: Map<string, DbInsight> = new Map();
const conditions: Map<string, DbCondition> = new Map();
const sessions: Map<string, string> = new Map(); // session token -> userId

// ---- User operations ----
export function createUser(data: {
    email: string;
    passwordHash: string;
    displayName: string | null;
    provider: string;
}): DbUser {
    const existing = findUserByEmail(data.email);
    if (existing) throw new Error("Email already registered");

    const user: DbUser = {
        id: generateId(),
        email: data.email,
        passwordHash: data.passwordHash,
        displayName: data.displayName,
        avatarUrl: null,
        provider: data.provider,
        onboardingDone: false,
        timezone: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    users.set(user.id, user);
    return user;
}

export function findUserByEmail(email: string): DbUser | undefined {
    for (const user of users.values()) {
        if (user.email === email) return user;
    }
    return undefined;
}

export function findUserById(id: string): DbUser | undefined {
    return users.get(id);
}

export function updateUser(id: string, data: Partial<DbUser>): DbUser | undefined {
    const user = users.get(id);
    if (!user) return undefined;
    const updated = { ...user, ...data, updatedAt: new Date().toISOString() };
    users.set(id, updated);
    return updated;
}

// ---- Session operations ----
export function createSession(userId: string): string {
    const token = generateId();
    sessions.set(token, userId);
    return token;
}

export function getUserIdFromSession(token: string): string | undefined {
    return sessions.get(token);
}

export function deleteSession(token: string): void {
    sessions.delete(token);
}

// ---- Condition operations ----
export function createConditions(userId: string, conditionNames: string[]): void {
    for (const name of conditionNames) {
        const condition: DbCondition = {
            id: generateId(),
            userId,
            condition: name,
            severity: 3,
            createdAt: new Date().toISOString(),
        };
        conditions.set(condition.id, condition);
    }
}

export function getConditions(userId: string): DbCondition[] {
    return Array.from(conditions.values()).filter((c) => c.userId === userId);
}

// ---- Entry operations ----
export function createEntry(data: Omit<DbEntry, "id" | "createdAt" | "updatedAt">): DbEntry {
    const entry: DbEntry = {
        ...data,
        id: generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    entries.set(entry.id, entry);
    return entry;
}

export function getEntries(userId: string, limit = 10): { entries: DbEntry[]; totalCount: number } {
    const userEntries = Array.from(entries.values())
        .filter((e) => e.userId === userId)
        .sort((a, b) => new Date(b.entryDate).getTime() - new Date(a.entryDate).getTime());
    return {
        entries: userEntries.slice(0, limit),
        totalCount: userEntries.length,
    };
}

export function getEntryById(id: string, userId: string): DbEntry | undefined {
    const entry = entries.get(id);
    if (entry && entry.userId === userId) return entry;
    return undefined;
}

export function deleteEntry(id: string, userId: string): boolean {
    const entry = entries.get(id);
    if (entry && entry.userId === userId) {
        entries.delete(id);
        // Clean up related records
        for (const [mId, m] of bodyMarkers) {
            if (m.entryId === id) bodyMarkers.delete(mId);
        }
        for (const [mId, m] of meals) {
            if (m.entryId === id) meals.delete(mId);
        }
        return true;
    }
    return false;
}

// ---- Body Marker operations ----
export function createBodyMarker(data: Omit<DbBodyMarker, "id" | "createdAt">): DbBodyMarker {
    const marker: DbBodyMarker = {
        ...data,
        id: generateId(),
        createdAt: new Date().toISOString(),
    };
    bodyMarkers.set(marker.id, marker);
    return marker;
}

export function getMarkersForEntry(entryId: string): DbBodyMarker[] {
    return Array.from(bodyMarkers.values()).filter((m) => m.entryId === entryId);
}

// ---- Meal operations ----
export function createMeal(data: Omit<DbMeal, "id" | "createdAt">): DbMeal {
    const meal: DbMeal = {
        ...data,
        id: generateId(),
        createdAt: new Date().toISOString(),
    };
    meals.set(meal.id, meal);
    return meal;
}

export function getMealsForEntry(entryId: string): DbMeal[] {
    return Array.from(meals.values()).filter((m) => m.entryId === entryId);
}

// ---- Insight operations ----
export function createInsight(data: Omit<DbInsight, "id" | "createdAt">): DbInsight {
    const insight: DbInsight = {
        ...data,
        id: generateId(),
        createdAt: new Date().toISOString(),
    };
    insights.set(insight.id, insight);
    return insight;
}

export function getInsights(userId: string): DbInsight[] {
    return Array.from(insights.values())
        .filter((i) => i.userId === userId && i.status === "active")
        .sort((a, b) => b.confidence - a.confidence);
}

export function updateInsightStatus(id: string, status: string): void {
    const insight = insights.get(id);
    if (insight) {
        insights.set(id, { ...insight, status });
    }
}

// ---- Bulk data access for AI analysis ----
export function getAllEntriesForAnalysis(userId: string): DbEntry[] {
    return Array.from(entries.values())
        .filter((e) => e.userId === userId)
        .sort((a, b) => new Date(a.entryDate).getTime() - new Date(b.entryDate).getTime());
}

export function getAllMarkersForUser(userId: string): DbBodyMarker[] {
    return Array.from(bodyMarkers.values()).filter((m) => m.userId === userId);
}

export function getAllMealsForUser(userId: string): DbMeal[] {
    return Array.from(meals.values()).filter((m) => m.userId === userId);
}
