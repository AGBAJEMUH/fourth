/* ============================================================
   Meridian — Global Error Boundary
   Catches unexpected errors and provides a recovery action.
   ============================================================ */
"use client";

import { useEffect } from "react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-dvh flex flex-col items-center justify-center bg-neutral-50 px-4 text-center">
            <div className="w-16 h-16 rounded-full bg-danger-50 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-danger-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
            </div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">Something went wrong</h2>
            <p className="text-neutral-500 mb-6 max-w-md text-sm">
                An unexpected error occurred. Our team has been notified.
            </p>
            <button
                onClick={reset}
                className="px-6 py-2.5 rounded-xl bg-neutral-900 text-white font-medium text-sm hover:bg-neutral-800 transition-all"
            >
                Try again
            </button>
        </div>
    );
}
