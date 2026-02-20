"use client";

import { useTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ResetSchema } from "@/lib/schemas";
import { reset } from "@/actions/reset";
import Link from "next/link";

export default function ResetPage() {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<z.infer<typeof ResetSchema>>({
        resolver: zodResolver(ResetSchema),
        defaultValues: {
            email: "",
        },
    });

    const onSubmit = (values: z.infer<typeof ResetSchema>) => {
        setError("");
        setSuccess("");

        startTransition(() => {
            reset(values)
                .then((data) => {
                    setError(data?.error);
                    setSuccess(data?.success);
                });
        });
    };

    return (
        <div className="min-h-dvh bg-gradient-mesh flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl shadow-xl p-8">
                <h1 className="text-2xl font-bold text-neutral-900 text-center mb-1">
                    Reset Password
                </h1>
                <p className="text-neutral-500 text-center text-sm mb-8">
                    Enter your email to receive a reset link
                </p>

                {error && (
                    <div className="mb-6 p-3 rounded-xl bg-danger-500/10 border border-danger-500/20 text-danger-500 text-sm text-center">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-sm text-center">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-neutral-700 mb-1.5"
                        >
                            Email
                        </label>
                        <input
                            {...register("email")}
                            type="email"
                            placeholder="you@example.com"
                            className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50/50 text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 transition-all text-sm"
                            disabled={isPending}
                        />
                        {errors.email && (
                            <p className="mt-1 text-xs text-danger-500">{errors.email.message}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold text-sm shadow-md hover:shadow-lg hover:from-primary-600 hover:to-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                        {isPending ? "Sending..." : "Send Reset Link"}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <Link
                        href="/login"
                        className="text-sm text-neutral-500 hover:text-neutral-800 underline"
                    >
                        Back to login
                    </Link>
                </div>
            </div>
        </div>
    );
}
