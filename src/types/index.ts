/* ============================================================
   Meridian — TypeScript Type Definitions
   All shared types/interfaces for the application
   ============================================================ */

// ---- User & Auth ----
export interface User {
  id: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  provider: "email" | "google";
  onboardingDone: boolean;
  timezone: string | null;
  createdAt: string;
}

export interface UserCondition {
  id: string;
  userId: string;
  condition: string;
  severity: number; // 1–5
  createdAt: string;
}

// ---- Journal Entries ----
export interface JournalEntry {
  id: string;
  userId: string;
  entryDate: string; // ISO date
  sleepHours: number | null;
  sleepQuality: number | null; // 1–5
  stressLevel: number | null; // 1–5
  energyLevel: number | null; // 1–5
  moodScore: number | null; // 1–5
  exerciseMins: number | null;
  exerciseType: string | null;
  waterIntakeMl: number | null;
  notes: string | null;
  weatherTemp: number | null;
  weatherCond: string | null;
  createdAt: string;
  updatedAt: string;
  // Relations (populated on detail views)
  bodyMarkers?: BodyMarker[];
  meals?: Meal[];
  supplements?: Supplement[];
}

// ---- Body Map ----
export interface BodyMarker {
  id: string;
  entryId: string;
  userId: string;
  bodyRegion: string; // e.g., "head_front", "lower_back"
  xPos: number; // 0–100 relative position on SVG
  yPos: number; // 0–100
  symptom: string; // "Sharp pain", "Tingling", etc.
  intensity: number; // 1–10
  createdAt: string;
}

export interface BodyRegionData {
  id: string;
  label: string;
  path: string; // SVG path data
}

// ---- Meals & Supplements ----
export interface Meal {
  id: string;
  entryId: string;
  userId: string;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  description: string;
  foods: string[] | null; // Parsed food items
  createdAt: string;
}

export interface Supplement {
  id: string;
  entryId: string;
  userId: string;
  name: string;
  dosage: string | null;
  takenAt: string | null;
  createdAt: string;
}

// ---- AI Insights ----
export interface Insight {
  id: string;
  userId: string;
  insightType: "correlation" | "prediction" | "trend";
  title: string;
  description: string;
  confidence: number; // 0.00–1.00
  factors: InsightFactor[];
  supportingData: SupportingDataPoint[] | null;
  status: "active" | "dismissed" | "confirmed";
  createdAt: string;
}

export interface InsightFactor {
  name: string;
  direction: "positive" | "negative" | "neutral";
  strength: number; // 0–1
}

export interface SupportingDataPoint {
  entryId: string;
  date: string;
  values: Record<string, number | string>;
}

export interface InsightFeedback {
  id: string;
  insightId: string;
  userId: string;
  helpful: boolean;
  comment: string | null;
  createdAt: string;
}

// ---- Analytics ----
export interface TimelineDataPoint {
  date: string;
  sleepQuality: number | null;
  stressLevel: number | null;
  energyLevel: number | null;
  moodScore: number | null;
  symptomCount: number;
}

export interface CorrelationPair {
  factorA: string;
  factorB: string;
  correlation: number; // -1 to 1
  sampleSize: number;
  significance: "high" | "medium" | "low";
}

// ---- UI ----
export interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
}

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  description?: string;
  duration?: number;
}
