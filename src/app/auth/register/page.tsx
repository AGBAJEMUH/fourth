/* ============================================================
   Meridian — Register Page
   Sign-up with email/password, onboarding condition selection
   ============================================================ */
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { COMMON_CONDITIONS } from "@/lib/utils/constants";
import { signIn } from "@/auth";

export default function RegisterPage() {
    const router = useRouter();
    const [step, setStep] = useState<"credentials" | "conditions">("credentials");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    function toggleCondition(condition: string) {
        setSelectedConditions((prev: string[]) =>
            prev.includes(condition)
                ? prev.filter((c: string) => c !== condition)
                : [...prev, condition]
        );
    }

    async function handleCredentialSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        if (password.length < 8) {
            setError("Password must be at least 8 characters");
            return;
        }
        setStep("conditions");
    }

    async function handleFinalSubmit() {
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    conditions: selectedConditions,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Registration failed");
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
                    {step === "credentials" ? (
                        <>
                            <h1 className="text-2xl font-bold text-neutral-900 text-center mb-1">
                                Create your account
                            </h1>
                            <p className="text-neutral-500 text-center text-sm mb-8">
                                Start your body intelligence journey
                            </p>

                            {error && (
                                <div className="mb-6 p-3 rounded-xl bg-danger-500/10 border border-danger-500/20 text-danger-500 text-sm text-center">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleCredentialSubmit} className="space-y-5">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1.5">
                                        Display Name
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Your name"
                                        className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50/50 text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 transition-all text-sm"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="reg-email" className="block text-sm font-medium text-neutral-700 mb-1.5">
                                        Email
                                    </label>
                                    <input
                                        id="reg-email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50/50 text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 transition-all text-sm"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="reg-password" className="block text-sm font-medium text-neutral-700 mb-1.5">
                                        Password
                                    </label>
                                    <input
                                        id="reg-password"
                                        type="password"
                                        required
                                        minLength={8}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="At least 8 characters"
                                        className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50/50 text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 transition-all text-sm"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold text-sm shadow-md hover:shadow-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-200"
                                >
                                    Continue
                                </button>
                            </form>

                            {/* Divider */}
                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-neutral-200" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-white text-neutral-400">or</span>
                                </div>
                            </div>

                            {/* Google Sign Up */}
                            <button
                                type="button"
                                onClick={async () => {
                                    setLoading(true);
                                    setError("");
                                    try {
                                        await signIn("google", { redirect: false });
                                        router.push("/dashboard");
                                    } catch (err) {
                                        setError(err instanceof Error ? err.message : "Google sign in failed");
                                    } finally {
                                        setLoading(false);
                                    }
                                }}
                                disabled={loading}
                                className="w-full py-3 px-4 rounded-xl border border-neutral-200 bg-white text-neutral-700 font-medium text-sm hover:bg-neutral-50 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Continue with Google
                            </button>
                        </>
                    ) : (
                        <>
                            <h1 className="text-2xl font-bold text-neutral-900 text-center mb-1">
                                What are you tracking?
                            </h1>
                            <p className="text-neutral-500 text-center text-sm mb-6">
                                Select conditions or goals you want Meridian to focus on. You can change these later.
                            </p>

                            {error && (
                                <div className="mb-6 p-3 rounded-xl bg-danger-500/10 border border-danger-500/20 text-danger-500 text-sm text-center">
                                    {error}
                                </div>
                            )}

                            <div className="flex flex-wrap gap-2 mb-8">
                                {COMMON_CONDITIONS.map((condition: string) => (
                                    <button
                                        key={condition}
                                        type="button"
                                        onClick={() => toggleCondition(condition)}
                                        className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${selectedConditions.includes(condition)
                                            ? "bg-primary-500 text-white shadow-md shadow-primary-500/20"
                                            : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 border border-neutral-200/50"
                                            }`}
                                    >
                                        {condition}
                                    </button>
                                ))}
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setStep("credentials")}
                                    className="flex-1 py-3 rounded-xl border border-neutral-200 text-neutral-600 font-medium text-sm hover:bg-neutral-50 transition-all"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleFinalSubmit}
                                    disabled={loading}
                                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold text-sm shadow-md hover:shadow-lg disabled:opacity-50 transition-all duration-200"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                                                <path d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" fill="currentColor" className="opacity-75" />
                                            </svg>
                                            Creating...
                                        </span>
                                    ) : (
                                        "Create Account"
                                    )}
                                </button>
                            </div>
                        </>
                    )}

                    {step === "credentials" && (
                        <div className="mt-6 text-center">
                            <span className="text-sm text-neutral-500">
                                Already have an account?{" "}
                                <Link
                                    href="/auth/login"
                                    className="text-primary-600 font-semibold hover:text-primary-700"
                                >
                                    Sign In
                                </Link>
                            </span>
                        </div>
                    )}
                </div>

                {/* Progress indicator */}
                <div className="flex justify-center mt-6 gap-2">
                    <div className={`w-8 h-1.5 rounded-full transition-all ${step === "credentials" ? "bg-primary-500" : "bg-neutral-300"}`} />
                    <div className={`w-8 h-1.5 rounded-full transition-all ${step === "conditions" ? "bg-primary-500" : "bg-neutral-300"}`} />
                </div>
            </div>
        </div>
    );
}
