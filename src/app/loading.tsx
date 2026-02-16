/* ============================================================
   Meridian — Loading State
   Global loading skeleton for route transitions.
   ============================================================ */
export default function Loading() {
    return (
        <div className="min-h-dvh flex items-center justify-center bg-white">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg animate-pulse-glow">
                    <div className="w-4 h-4 rounded-full bg-white" />
                </div>
                <span className="text-sm font-medium text-neutral-400 animate-pulse">
                    Loading Meridian...
                </span>
            </div>
        </div>
    );
}
