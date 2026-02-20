/* ============================================================
   Meridian — Login Page
   Clean, premium sign-in with email/password form
   ============================================================ */
"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isPending, startTransition] = useTransition();

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        startTransition(async () => {
            try {
                const result = await signIn("credentials", {
                    email,
                    password,
                    redirect: false,
                });

                if (result?.error) {
                    setError("Invalid credentials!");
                } else {
                    router.push(DEFAULT_LOGIN_REDIRECT);
                }
            } catch (error) {
                setError("Something went wrong!");
            }
        });
    };

    const onGoogleClick = () => {
        signIn("google", {
            callbackUrl: DEFAULT_LOGIN_REDIRECT,
        });
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

                    <form onSubmit={onSubmit} className="space-y-5">
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
                                disabled={isPending}
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
                                <Link
                                    href="/auth/reset"
                                    className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50/50 text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 transition-all text-sm"
                                disabled={isPending}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold text-sm shadow-md hover:shadow-lg hover:from-primary-600 hover:to-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            {isPending ? "Signing in..." : "Sign In"}
                        </button>
                    </form>

                    <div className="my-6 flex items-center gap-4">
                        <div className="h-px flex-1 bg-neutral-200" />
                        <span className="text-xs text-neutral-400 font-medium">OR CONTINUE WITH</span>
                        <div className="h-px flex-1 bg-neutral-200" />
                    </div>

                    <button
                        onClick={onGoogleClick}
                        className="w-full py-3 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 font-medium text-sm flex items-center justify-center gap-2 transition-all duration-200"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23.5 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.97 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        Google
                    </button>

                    <div className="mt-6 text-center">
                        <span className="text-sm text-neutral-500">
                            Don&apos;t have an account?{" "}
                            <Link
                                href="/auth/register"
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
