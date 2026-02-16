/* ============================================================
   Meridian — Middleware
   Protects dashboard routes and redirects unauthenticated users.
   ============================================================ */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const sessionToken = request.cookies.get("meridian_session")?.value;
    const { pathname } = request.nextUrl;

    // Routes that require authentication
    const protectedRoutes = ["/dashboard", "/journal", "/insights", "/timeline", "/settings"];
    const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

    // Routes for unauthenticated users only (login, register)
    const authRoutes = ["/login", "/register"];
    const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

    if (isProtectedRoute && !sessionToken) {
        // Redirect to login if trying to access protected route without session
        return NextResponse.redirect(new URL("/login", request.url));
    }

    if (isAuthRoute && sessionToken) {
        // Redirect to dashboard if trying to access login/register while authenticated
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};
