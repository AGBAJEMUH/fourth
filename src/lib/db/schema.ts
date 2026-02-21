/* ============================================================
   Meridian — Drizzle Schema
   Database definition for Neon PostgreSQL.
   ============================================================ */
import { pgTable, text, timestamp, boolean, uuid, integer, decimal, jsonb, unique } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ---- Users Table ----
export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull().unique(),
    passwordHash: text("password_hash"),
    displayName: text("display_name"),
    avatarUrl: text("avatar_url"),
    provider: text("provider").default("email").notNull(),
    role: text("role").default("user").notNull(),
    emailVerified: timestamp("email_verified"),
    onboardingDone: boolean("onboarding_done").default(false).notNull(),
    timezone: text("timezone"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const userConditions = pgTable("user_conditions", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    condition: text("condition").notNull(),
    severity: integer("severity").default(3).notNull(), // 1-5
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ---- Journal Entries ----
export const journalEntries = pgTable("journal_entries", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    entryDate: text("entry_date").notNull(), // YYYY-MM-DD
    sleepHours: decimal("sleep_hours", { precision: 3, scale: 1 }),
    sleepQuality: integer("sleep_quality"),
    stressLevel: integer("stress_level"),
    energyLevel: integer("energy_level"),
    moodScore: integer("mood_score"),
    exerciseMins: integer("exercise_mins"),
    exerciseType: text("exercise_type"),
    waterIntakeMl: integer("water_intake_ml"),
    notes: text("notes"),
    weatherTemp: decimal("weather_temp", { precision: 4, scale: 1 }),
    weatherCond: text("weather_cond"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => ({
    unq: unique().on(t.userId, t.entryDate),
}));

export const bodyMarkers = pgTable("body_markers", {
    id: uuid("id").primaryKey().defaultRandom(),
    entryId: uuid("entry_id").references(() => journalEntries.id, { onDelete: "cascade" }).notNull(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    bodyRegion: text("body_region").notNull(),
    xPos: decimal("x_pos", { precision: 5, scale: 2 }).notNull(),
    yPos: decimal("y_pos", { precision: 5, scale: 2 }).notNull(),
    symptom: text("symptom").notNull(),
    intensity: integer("intensity").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const meals = pgTable("meals", {
    id: uuid("id").primaryKey().defaultRandom(),
    entryId: uuid("entry_id").references(() => journalEntries.id, { onDelete: "cascade" }).notNull(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    mealType: text("meal_type").notNull(),
    description: text("description").notNull(),
    foods: jsonb("foods"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ---- AI Insights ----
export const insights = pgTable("insights", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    insightType: text("insight_type").notNull(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    confidence: decimal("confidence", { precision: 3, scale: 2 }).notNull(),
    factors: jsonb("factors").notNull(),
    supportingData: jsonb("supporting_data"),
    status: text("status").default("active").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ---- Auth & Sessions ----
export const accounts = pgTable("accounts", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
}, (t) => ({
    providerProviderAccountId: unique().on(t.provider, t.providerAccountId),
}));

// ---- Relations ----
export const userRelations = relations(users, ({ many }) => ({
    entries: many(journalEntries),
    conditions: many(userConditions),
    insights: many(insights),
    accounts: many(accounts),
}));

export const entryRelations = relations(journalEntries, ({ one, many }) => ({
    user: one(users, {
        fields: [journalEntries.userId],
        references: [users.id],
    }),
    bodyMarkers: many(bodyMarkers),
    meals: many(meals),
}));

export const markerRelations = relations(bodyMarkers, ({ one }) => ({
    entry: one(journalEntries, {
        fields: [bodyMarkers.entryId],
        references: [journalEntries.id],
    }),
}));

export const mealRelations = relations(meals, ({ one }) => ({
    entry: one(journalEntries, {
        fields: [meals.entryId],
        references: [journalEntries.id],
    }),
}));

export const sessions = pgTable("sessions", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    token: text("token").notNull().unique(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const verificationTokens = pgTable("verification_tokens", {
    identifier: text("identifier").notNull(), // email
    token: text("token").notNull().unique(),
    expires: timestamp("expires").notNull(),
}, (t) => ({
    pk: unique().on(t.identifier, t.token),
}));

export const passwordResetTokens = pgTable("password_reset_tokens", {
    identifier: text("identifier").notNull(), // email
    token: text("token").notNull().unique(),
    expires: timestamp("expires").notNull(),
}, (t) => ({
    pk: unique().on(t.identifier, t.token),
}));
