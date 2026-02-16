/* ============================================================
   Meridian — Application Constants
   ============================================================ */

/** Body regions for the interactive body map */
export const BODY_REGIONS = [
    { id: "head", label: "Head" },
    { id: "neck", label: "Neck" },
    { id: "chest", label: "Chest" },
    { id: "upper_back", label: "Upper Back" },
    { id: "lower_back", label: "Lower Back" },
    { id: "abdomen", label: "Abdomen" },
    { id: "left_shoulder", label: "Left Shoulder" },
    { id: "right_shoulder", label: "Right Shoulder" },
    { id: "left_arm", label: "Left Arm" },
    { id: "right_arm", label: "Right Arm" },
    { id: "left_hand", label: "Left Hand" },
    { id: "right_hand", label: "Right Hand" },
    { id: "left_hip", label: "Left Hip" },
    { id: "right_hip", label: "Right Hip" },
    { id: "left_leg", label: "Left Leg" },
    { id: "right_leg", label: "Right Leg" },
    { id: "left_knee", label: "Left Knee" },
    { id: "right_knee", label: "Right Knee" },
    { id: "left_foot", label: "Left Foot" },
    { id: "right_foot", label: "Right Foot" },
] as const;

/** Common symptoms for quick-select */
export const COMMON_SYMPTOMS = [
    "Sharp pain",
    "Dull ache",
    "Throbbing",
    "Burning",
    "Tingling",
    "Numbness",
    "Stiffness",
    "Swelling",
    "Cramping",
    "Pressure",
    "Itching",
    "Fatigue",
    "Tension",
    "Weakness",
] as const;

/** Exercise types */
export const EXERCISE_TYPES = [
    "Walking",
    "Running",
    "Cycling",
    "Swimming",
    "Yoga",
    "Strength Training",
    "HIIT",
    "Stretching",
    "Dance",
    "Sports",
    "Hiking",
    "Other",
] as const;

/** Meal types */
export const MEAL_TYPES = [
    { id: "breakfast", label: "Breakfast", icon: "☀️" },
    { id: "lunch", label: "Lunch", icon: "🌤️" },
    { id: "dinner", label: "Dinner", icon: "🌙" },
    { id: "snack", label: "Snack", icon: "🍎" },
] as const;

/** Mood labels for the 1–5 scale */
export const MOOD_LABELS = ["Terrible", "Bad", "Okay", "Good", "Great"] as const;
export const ENERGY_LABELS = ["Exhausted", "Low", "Moderate", "Energized", "Peak"] as const;
export const STRESS_LABELS = ["None", "Mild", "Moderate", "High", "Extreme"] as const;
export const SLEEP_LABELS = ["Awful", "Poor", "Fair", "Good", "Excellent"] as const;

/** Conditions for onboarding */
export const COMMON_CONDITIONS = [
    "Migraine",
    "Chronic Fatigue",
    "IBS / Digestive Issues",
    "Anxiety",
    "Insomnia",
    "Joint Pain",
    "Back Pain",
    "Allergies",
    "Eczema / Skin Issues",
    "Autoimmune Condition",
    "PCOS",
    "Fibromyalgia",
    "Asthma",
    "General Wellness",
] as const;

/** Navigation items for the dashboard sidebar */
export const NAV_ITEMS = [
    { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
    { label: "Journal", href: "/journal", icon: "BookOpen" },
    { label: "Insights", href: "/insights", icon: "Lightbulb" },
    { label: "Timeline", href: "/timeline", icon: "TrendingUp" },
    { label: "Settings", href: "/settings", icon: "Settings" },
] as const;

/** Minimum entries required before AI analysis */
export const MIN_ENTRIES_FOR_INSIGHTS = 7;

/** API rate limits */
export const RATE_LIMITS = {
    INSIGHT_GENERATION: 3, // per day
    LOGIN_ATTEMPTS: 5, // per 15 min
    API_REQUESTS: 100, // per minute
} as const;
