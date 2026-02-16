# Meridian — AI Body Intelligence Journal

Meridian is a flagship health journaling application that uses AI to correlate your lifestyle factors (sleep, food, stress, exercise) with your body's signals.

## Features

- **Body Map**: Interactive SVG interface to log symptoms on specific body regions.
- **AI Insights**: Local Pearson correlation engine detects patterns in your data (e.g., "High stress correlates with neck pain").
- **Dashboard**: Premium UI with glassmorphism, animations, and real-time metrics.
- **Timeline**: Visual trend charts (sparklines) for mood, sleep, energy, and stress.
- **Secure Auth**: Session-based authentication with httpOnly cookies.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript
- **Database**: In-memory store (for demo/development) — swap with Neon PostgreSQL for production.
- **Icons**: Inline SVGs (no heavy icon libraries).

## Getting Started

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Run the development server**:
    ```bash
    npm run dev
    ```

3.  **Open the app**:
    Navigate to [http://localhost:3000](http://localhost:3000).

## Verification

See `walkthrough.md` for a detailed guide on how to test all features.
