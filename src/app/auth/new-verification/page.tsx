"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { newVerification } from "@/actions/new-verification";
import Link from "next/link";

export default function NewVerificationPage() {
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();

    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const onSubmit = useCallback(() => {
        if (success || error) return;

        if (!token) {
            setError("Missing token!");
            return;
        }

        newVerification(token)
            .then((data) => {
                setSuccess(data.success);
                setError(data.error);
            })
            .catch(() => {
                setError("Something went wrong!");
            });
    }, [token, success, error]);

    useEffect(() => {
        onSubmit();
    }, [onSubmit]);

    return (
        <div className="min-h-dvh bg-gradient-mesh flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl shadow-xl p-8 text-center">
                <h1 className="text-2xl font-bold text-neutral-900 mb-4">
                    Confirming your account
                </h1>

                {!success && !error && (
                    <div className="flex justify-center mb-4">
                        <svg className="w-8 h-8 animate-spin text-primary-500" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                            <path d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" fill="currentColor" className="opacity-75" />
                        </svg>
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-sm">
                        {success}
                    </div>
                )}

                {error && (
                    <div className="mb-6 p-3 rounded-xl bg-danger-500/10 border border-danger-500/20 text-danger-500 text-sm">
                        {error}
                    </div>
                )}

                <div className="mt-4">
                    <Link href="/login" className="text-sm text-neutral-500 hover:text-neutral-800 underline">
                        Back to login
                    </Link>
                </div>
            </div>
        </div>
    );
}
