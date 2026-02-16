/* ============================================================
   Meridian — 404 Page
   Custom not found page with premium styling.
   ============================================================ */
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-dvh flex flex-col items-center justify-center bg-gradient-mesh px-4 text-center">
            <div className="w-24 h-24 rounded-full bg-white/50 backdrop-blur-xl border border-white/60 flex items-center justify-center mb-6 shadow-xl">
                <span className="text-4xl">🧭</span>
            </div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Page Not Found</h1>
            <p className="text-neutral-500 mb-8 max-w-md">
                We couldn&apos;t find the page you&apos;re looking for. It might have been moved or doesn&apos;t exist.
            </p>
            <Link
                href="/dashboard"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold shadow-md hover:shadow-lg transition-all"
            >
                Return to Dashboard
            </Link>
        </div>
    );
}
