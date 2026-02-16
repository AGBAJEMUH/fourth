
/* ============================================================
   Meridian — Data Access Layer (Production)
   Handles database operations using Drizzle ORM + Neon.
    Falls back to in-memory mock if DATABASE_URL is missing.
   ============================================================ */

import { generateId } from "@/lib/utils/helpers";
import { db } from "./drizzle";
import { users, journalEntries, bodyMarkers, meals, insights, userConditions } from "./schema";
import { eq, desc, and } from "drizzle-orm";
import * as mockDb from "./mock"; // Renamed original index.ts content to mock.ts

// Re-export types
export type { DbUser, DbEntry, DbBodyMarker, DbMeal, DbInsight, DbCondition } from "./mock";
import type { DbUser, DbEntry, DbBodyMarker, DbMeal, DbInsight, DbCondition } from "./mock";

const USE_MOCK = !process.env.DATABASE_URL;

// ---- User Operations ----
export async function createUser(data: {
    email: string;
    passwordHash: string;
    displayName: string | null;
    provider: string;
}): Promise<DbUser> {
    if (USE_MOCK) return mockDb.createUser(data);

    const [newUser] = await db.insert(users).values({
        email: data.email,
        passwordHash: data.passwordHash,
        displayName: data.displayName,
        provider: data.provider,
    }).returning();

    return mapUser(newUser);
}

export async function findUserByEmail(email: string): Promise<DbUser | undefined> {
    if (USE_MOCK) return mockDb.findUserByEmail(email);

    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user ? mapUser(user) : undefined;
}

export async function findUserById(id: string): Promise<DbUser | undefined> {
    if (USE_MOCK) return mockDb.findUserById(id);

    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user ? mapUser(user) : undefined;
}

export async function updateUser(id: string, data: Partial<DbUser>): Promise<DbUser | undefined> {
    if (USE_MOCK) return mockDb.updateUser(id, data);

    const [updated] = await db.update(users)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(users.id, id))
        .returning();
    return updated ? mapUser(updated) : undefined;
}

// ---- Session Operations (Keep in-memory for simplicity unless Redis is added) ----
// In a real prod app, use Redis or a DB table for sessions. 
// For this V1, we'll keep the in-memory session store from mock.ts
// but we could migrate it to a table if needed.
export const createSession = mockDb.createSession;
export const getUserIdFromSession = mockDb.getUserIdFromSession;
export const deleteSession = mockDb.deleteSession;

// ---- Condition Operations ----
export async function createConditions(userId: string, conditionNames: string[]): Promise<void> {
    if (USE_MOCK) return mockDb.createConditions(userId, conditionNames);

    if (conditionNames.length === 0) return;

    await db.insert(userConditions).values(
        conditionNames.map(name => ({
            userId,
            condition: name,
            severity: 3
        }))
    );
}

// ---- Journal Operations ----
export async function createEntry(data: Omit<DbEntry, "id" | "createdAt" | "updatedAt">): Promise<DbEntry> {
    if (USE_MOCK) return mockDb.createEntry(data);

    const [entry] = await db.insert(journalEntries).values({
        userId: data.userId,
        entryDate: data.entryDate,
        sleepHours: data.sleepHours ? String(data.sleepHours) : null,
        sleepQuality: data.sleepQuality,
        stressLevel: data.stressLevel,
        energyLevel: data.energyLevel,
        moodScore: data.moodScore,
        exerciseMins: data.exerciseMins,
        exerciseType: data.exerciseType,
        waterIntakeMl: data.waterIntakeMl,
        notes: data.notes,
        weatherTemp: data.weatherTemp ? String(data.weatherTemp) : null,
        weatherCond: data.weatherCond,
    }).returning();

    return mapEntry(entry);
}

export async function getEntries(userId: string, limit = 10): Promise<{ entries: DbEntry[]; totalCount: number }> {
    if (USE_MOCK) return mockDb.getEntries(userId, limit);

    const rows = await db.select().from(journalEntries)
        .where(eq(journalEntries.userId, userId))
        .orderBy(desc(journalEntries.entryDate))
        .limit(limit);

    // Note: Total count would require a separate query, simulating for now
    return {
        entries: rows.map(mapEntry),
        totalCount: rows.length
    };
}

export async function getEntryById(id: string, userId: string): Promise<DbEntry | undefined> {
    if (USE_MOCK) return mockDb.getEntryById(id, userId);

    const [entry] = await db.select().from(journalEntries)
        .where(and(eq(journalEntries.id, id), eq(journalEntries.userId, userId)));

    return entry ? mapEntry(entry) : undefined;
}

export async function deleteEntry(id: string, userId: string): Promise<boolean> {
    if (USE_MOCK) return mockDb.deleteEntry(id, userId);

    const [deleted] = await db.delete(journalEntries)
        .where(and(eq(journalEntries.id, id), eq(journalEntries.userId, userId)))
        .returning();

    return !!deleted;
}

// ---- Marker Operations ----
export async function createBodyMarker(data: Omit<DbBodyMarker, "id" | "createdAt">): Promise<DbBodyMarker> {
    if (USE_MOCK) return mockDb.createBodyMarker(data);

    const [marker] = await db.insert(bodyMarkers).values({
        entryId: data.entryId,
        userId: data.userId,
        bodyRegion: data.bodyRegion,
        xPos: String(data.xPos),
        yPos: String(data.yPos),
        symptom: data.symptom,
        intensity: data.intensity,
    }).returning();

    return mapMarker(marker);
}

export async function getMarkersForEntry(entryId: string): Promise<DbBodyMarker[]> {
    if (USE_MOCK) return mockDb.getMarkersForEntry(entryId);

    const rows = await db.select().from(bodyMarkers).where(eq(bodyMarkers.entryId, entryId));
    return rows.map(mapMarker);
}

export async function getAllMarkersForUser(userId: string): Promise<DbBodyMarker[]> {
    if (USE_MOCK) return mockDb.getAllMarkersForUser(userId);

    const rows = await db.select().from(bodyMarkers).where(eq(bodyMarkers.userId, userId));
    return rows.map(mapMarker);
}

// ---- Meal Operations ----
export async function createMeal(data: Omit<DbMeal, "id" | "createdAt">): Promise<DbMeal> {
    if (USE_MOCK) return mockDb.createMeal(data);

    const [meal] = await db.insert(meals).values({
        entryId: data.entryId,
        userId: data.userId,
        mealType: data.mealType,
        description: data.description,
        foods: data.foods,
    }).returning();

    return mapMeal(meal);
}

export async function getMealsForEntry(entryId: string): Promise<DbMeal[]> {
    if (USE_MOCK) return mockDb.getMealsForEntry(entryId);

    const rows = await db.select().from(meals).where(eq(meals.entryId, entryId));
    return rows.map(mapMeal);
}

// ---- Insight Operations ----
export async function createInsight(data: Omit<DbInsight, "id" | "createdAt">): Promise<DbInsight> {
    if (USE_MOCK) return mockDb.createInsight(data);

    const [insight] = await db.insert(insights).values({
        userId: data.userId,
        insightType: data.insightType,
        title: data.title,
        description: data.description,
        confidence: String(data.confidence),
        factors: data.factors,
        supportingData: data.supportingData,
        status: data.status,
    }).returning();

    return mapInsight(insight);
}

export async function getInsights(userId: string): Promise<DbInsight[]> {
    if (USE_MOCK) return mockDb.getInsights(userId);

    const rows = await db.select().from(insights)
        .where(and(eq(insights.userId, userId), eq(insights.status, "active")))
        .orderBy(desc(insights.confidence));

    return rows.map(mapInsight);
}

export async function updateInsightStatus(id: string, status: string): Promise<void> {
    if (USE_MOCK) return mockDb.updateInsightStatus(id, status);

    await db.update(insights).set({ status }).where(eq(insights.id, id));
}

export async function getAllEntriesForAnalysis(userId: string): Promise<DbEntry[]> {
    if (USE_MOCK) return mockDb.getAllEntriesForAnalysis(userId);

    const rows = await db.select().from(journalEntries)
        .where(eq(journalEntries.userId, userId))
        .orderBy(desc(journalEntries.entryDate));

    return rows.map(mapEntry);
}


// ---- Mappers (Drizzle -> Domain) ----
function mapUser(row: any): DbUser {
    return { ...row, createdAt: row.createdAt.toISOString(), updatedAt: row.updatedAt.toISOString() };
}

function mapEntry(row: any): DbEntry {
    return {
        ...row,
        sleepHours: row.sleepHours ? Number(row.sleepHours) : null,
        weatherTemp: row.weatherTemp ? Number(row.weatherTemp) : null,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString()
    };
}

function mapMarker(row: any): DbBodyMarker {
    return {
        ...row,
        xPos: Number(row.xPos),
        yPos: Number(row.yPos),
        createdAt: row.createdAt.toISOString()
    };
}

function mapMeal(row: any): DbMeal {
    return { ...row, createdAt: row.createdAt.toISOString() };
}

function mapInsight(row: any): DbInsight {
    return {
        ...row,
        confidence: Number(row.confidence),
        createdAt: row.createdAt.toISOString()
    };
}
