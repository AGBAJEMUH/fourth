/* ============================================================
   Meridian — Settings Page
   User profile management with account info and preferences.
   ============================================================ */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { COMMON_CONDITIONS } from "@/lib/utils/constants";

export default function SettingsPage() {
    const router = useRouter();
    const [name, setName] = useState("User");
    const [email, setEmail] = useState("user@example.com");
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    async function handleSave() {
        setSaving(true);
        try {
            const res = await fetch("/api/user", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ displayName: name }),
            });
            if (res.ok) {
                setSaved(true);
                setTimeout(() => setSaved(false), 2000);
            }
        } catch (err) {
            console.error("Failed to update profile:", err);
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="max-w-2xl mx-auto animate-fade-in">
            <h1 className="text-2xl font-bold text-neutral-900 mb-6">Settings</h1>

            {/* Profile section */}
            <div className="bg-white rounded-2xl border border-neutral-200/50 shadow-sm p-6 mb-6">
                <h2 className="text-lg font-semibold text-neutral-800 mb-4">Profile</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-neutral-600 mb-1.5">Display Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50/50 text-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-600 mb-1.5">Email</label>
                        <input
                            type="email"
                            value={email}
                            disabled
                            className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-100 text-neutral-500 text-sm cursor-not-allowed"
                        />
                        <p className="text-xs text-neutral-400 mt-1">Email cannot be changed</p>
                    </div>
                </div>
                <div className="mt-6 flex items-center gap-3">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-semibold shadow-md hover:shadow-lg disabled:opacity-50 transition-all"
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                    {saved && (
                        <span className="text-sm text-success-500 font-medium animate-fade-in flex items-center gap-1">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                            Saved
                        </span>
                    )}
                </div>
            </div>

            {/* Data & Privacy */}
            <div className="bg-white rounded-2xl border border-neutral-200/50 shadow-sm p-6 mb-6">
                <h2 className="text-lg font-semibold text-neutral-800 mb-4">Data & Privacy</h2>
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-100">
                        <div>
                            <span className="text-sm font-medium text-neutral-700">Export Data</span>
                            <p className="text-xs text-neutral-400">Download your journal data as JSON</p>
                        </div>
                        <button className="px-3 py-1.5 rounded-lg border border-neutral-200 text-xs font-medium text-neutral-600 hover:bg-white transition-all">
                            Export
                        </button>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-100">
                        <div>
                            <span className="text-sm font-medium text-neutral-700">Encryption</span>
                            <p className="text-xs text-neutral-400">Your health data is encrypted at rest</p>
                        </div>
                        <span className="text-xs font-semibold text-success-500 flex items-center gap-1">
                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10zm-1-6l-4-4 1.4-1.4L11 13.2l5.6-5.6L18 9l-7 7z" />
                            </svg>
                            Active
                        </span>
                    </div>
                </div>
            </div>

            {/* Danger zone */}
            <div className="bg-white rounded-2xl border border-danger-500/20 shadow-sm p-6">
                <h2 className="text-lg font-semibold text-danger-500 mb-4">Danger Zone</h2>
                <p className="text-sm text-neutral-500 mb-4">
                    Once you delete your account, all data is permanently removed and cannot be recovered.
                </p>
                <button className="px-4 py-2 rounded-xl border border-danger-500/30 text-danger-500 text-sm font-medium hover:bg-danger-500/5 transition-all">
                    Delete Account
                </button>
            </div>
        </div>
    );
}
