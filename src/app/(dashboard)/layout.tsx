/* ============================================================
   Meridian — Dashboard Layout
   App shell with collapsible sidebar (desktop) and bottom
   tab bar (mobile). Wraps all dashboard/* pages.
   ============================================================ */
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { NAV_ITEMS } from "@/lib/utils/constants";
import { cn } from "@/lib/utils/helpers";

/** Icon component — maps icon names to inline SVGs */
function NavIcon({ name, className }: { name: string; className?: string }) {
    const cls = cn("w-5 h-5", className);
    switch (name) {
        case "LayoutDashboard":
            return (
                <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="9" rx="1" />
                    <rect x="14" y="3" width="7" height="5" rx="1" />
                    <rect x="14" y="12" width="7" height="9" rx="1" />
                    <rect x="3" y="16" width="7" height="5" rx="1" />
                </svg>
            );
        case "BookOpen":
            return (
                <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
                </svg>
            );
        case "Lightbulb":
            return (
                <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 006 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
                    <path d="M9 18h6" /><path d="M10 22h4" />
                </svg>
            );
        case "TrendingUp":
            return (
                <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                    <polyline points="16 7 22 7 22 13" />
                </svg>
            );
        case "Settings":
            return (
                <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
            );
        default:
            return <div className={cls} />;
    }
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    async function handleLogout() {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/login");
    }

    return (
        <div className="min-h-dvh bg-neutral-50 flex">
            {/* ---- Desktop Sidebar ---- */}
            {!isMobile && (
                <aside
                    className={cn(
                        "fixed left-0 top-0 bottom-0 z-40 bg-white border-r border-neutral-200/70 flex flex-col transition-all duration-300",
                        sidebarCollapsed ? "w-16" : "w-60"
                    )}
                >
                    {/* Logo row */}
                    <div className="h-16 flex items-center px-4 border-b border-neutral-100 flex-shrink-0">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-sm flex-shrink-0">
                            <div className="w-2.5 h-2.5 rounded-full bg-white" />
                        </div>
                        {!sidebarCollapsed && (
                            <span className="ml-2.5 text-lg font-bold text-neutral-800 tracking-tight">
                                Meridian
                            </span>
                        )}
                    </div>

                    {/* Nav items */}
                    <nav className="flex-1 py-4 px-2 space-y-1">
                        {NAV_ITEMS.map((item) => {
                            const active = pathname === item.href || pathname.startsWith(item.href + "/");
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                                        active
                                            ? "bg-primary-50 text-primary-700 shadow-sm"
                                            : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700"
                                    )}
                                    title={sidebarCollapsed ? item.label : undefined}
                                >
                                    <NavIcon
                                        name={item.icon}
                                        className={active ? "text-primary-600" : "text-neutral-400"}
                                    />
                                    {!sidebarCollapsed && <span>{item.label}</span>}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Bottom section */}
                    <div className="p-3 border-t border-neutral-100">
                        {/* Collapse toggle */}
                        <button
                            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                            className="w-full flex items-center justify-center p-2 rounded-xl text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50 transition-all"
                            aria-label="Toggle sidebar"
                        >
                            <svg className={cn("w-5 h-5 transition-transform", sidebarCollapsed ? "rotate-180" : "")} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <path d="M11 17l-5-5 5-5" />
                                <path d="M18 17l-5-5 5-5" />
                            </svg>
                        </button>
                        {/* Logout */}
                        <button
                            onClick={handleLogout}
                            className={cn(
                                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700 transition-all mt-1",
                            )}
                        >
                            <svg className="w-5 h-5 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                                <polyline points="16 17 21 12 16 7" />
                                <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                            {!sidebarCollapsed && <span>Logout</span>}
                        </button>
                    </div>
                </aside>
            )}

            {/* ---- Main Content ---- */}
            <main
                className={cn(
                    "flex-1 transition-all duration-300",
                    !isMobile && (sidebarCollapsed ? "ml-16" : "ml-60"),
                    isMobile && "pb-20" // space for bottom nav
                )}
            >
                {/* Top bar (mobile only) */}
                {isMobile && (
                    <header className="sticky top-0 z-30 h-14 bg-white/80 backdrop-blur-xl border-b border-neutral-200/50 flex items-center px-4">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-white" />
                        </div>
                        <span className="ml-2 text-base font-bold text-neutral-800">Meridian</span>
                    </header>
                )}

                <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>

            {/* ---- Mobile Bottom Nav ---- */}
            {isMobile && (
                <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-t border-neutral-200/50 px-2 py-1 safe-area-bottom">
                    <div className="flex items-center justify-around">
                        {NAV_ITEMS.map((item) => {
                            const active = pathname === item.href || pathname.startsWith(item.href + "/");
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex flex-col items-center py-2 px-3 rounded-xl transition-colors min-w-[56px]",
                                        active ? "text-primary-600" : "text-neutral-400"
                                    )}
                                >
                                    <NavIcon
                                        name={item.icon}
                                        className={cn("w-5 h-5", active ? "text-primary-600" : "text-neutral-400")}
                                    />
                                    <span className="text-[10px] font-medium mt-0.5">{item.label}</span>
                                    {active && (
                                        <div className="w-1 h-1 rounded-full bg-primary-500 mt-0.5" />
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </nav>
            )}
        </div>
    );
}
