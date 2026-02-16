/* ============================================================
   Meridian — Login Page
   Clean, premium sign-in with email/password form
   ============================================================ */
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Login failed");
            }

            router.push("/dashboard");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-dvh bg-gradient-mesh flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="flex items-center justify-center gap-2.5 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-md">
                        <div className="w-3 h-3 rounded-full bg-white" />
                    </div>
                    <span className="text-2xl font-bold text-neutral-800 tracking-tight">
                        Meridian
                    </span>
                </div>

                {/* Card */}
                <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl shadow-xl p-8">
                    <h1 className="text-2xl font-bold text-neutral-900 text-center mb-1">
                        Welcome back
                    </h1>
                    <p className="text-neutral-500 text-center text-sm mb-8">
                        Sign in to continue your health journal
                    </p>

                    {error && (
                        <div className="mb-6 p-3 rounded-xl bg-danger-500/10 border border-danger-500/20 text-danger-500 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-neutral-700 mb-1.5"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50/50 text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 transition-all text-sm"
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-neutral-700"
                                >
                                    Password
                                </label>
                                <a
                                    href="#"
                                    className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                                >
                                    Forgot password?
                                </a>
                            </div>
                            <input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50/50 text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 transition-all text-sm"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold text-sm shadow-md hover:shadow-lg hover:from-primary-600 hover:to-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                                        <path d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" fill="currentColor" className="opacity-75" />
                                    </svg>
                                    Signing in...
                                </span>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <span className="text-sm text-neutral-500">
                            Don&apos;t have an account?{" "}
                            <Link
                                href="/register"
                                className="text-primary-600 font-semibold hover:text-primary-700"
                            >
                                Sign Up
                            </Link>
                        </span>
                    </div>
                </div>

                {/* Medical disclaimer */}
                <p className="mt-6 text-center text-xs text-neutral-400 max-w-sm mx-auto">
                    Meridian is not a medical device. Consult a healthcare provider for medical decisions.
                </p>
            </div>
        </div>
    );
}
