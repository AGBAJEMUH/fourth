/* ============================================================
   Meridian — Body Map Component
   Interactive SVG body silhouette where users can tap/click
   to place symptom markers on specific body regions.
   ============================================================ */
"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils/helpers";
import { COMMON_SYMPTOMS } from "@/lib/utils/constants";
import type { BodyMarker } from "@/types";

interface BodyMapProps {
    markers: Omit<BodyMarker, "id" | "entryId" | "userId" | "createdAt">[];
    onAddMarker: (marker: Omit<BodyMarker, "id" | "entryId" | "userId" | "createdAt">) => void;
    onRemoveMarker: (index: number) => void;
    readonly?: boolean;
}

/** Get region name from approximate SVG position */
function getRegionFromPosition(x: number, y: number): string {
    // Map x,y (0-100) to body regions
    if (y < 15) return "head";
    if (y < 20) return "neck";
    if (y < 22 && x < 35) return "left_shoulder";
    if (y < 22 && x > 65) return "right_shoulder";
    if (y < 35 && x < 30) return "left_arm";
    if (y < 35 && x > 70) return "right_arm";
    if (y < 35) return "chest";
    if (y < 45 && x < 30) return "left_arm";
    if (y < 45 && x > 70) return "right_arm";
    if (y < 45) return "abdomen";
    if (y < 55 && x < 30) return "left_hand";
    if (y < 55 && x > 70) return "right_hand";
    if (y < 55 && x < 45) return "left_hip";
    if (y < 55 && x > 55) return "right_hip";
    if (y < 55) return "lower_back";
    if (y < 72 && x < 45) return "left_leg";
    if (y < 72 && x > 55) return "right_leg";
    if (y < 80 && x < 45) return "left_knee";
    if (y < 80 && x > 55) return "right_knee";
    if (y < 92 && x < 45) return "left_leg";
    if (y < 92 && x > 55) return "right_leg";
    if (x < 45) return "left_foot";
    return "right_foot";
}

/** Format region ID to display label */
function formatRegion(region: string): string {
    return region
        .split("_")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
}

/** Get color for symptom intensity (1-10) */
function getIntensityColor(intensity: number): string {
    if (intensity <= 3) return "bg-warning-500";
    if (intensity <= 6) return "bg-orange-500";
    return "bg-danger-500";
}

export default function BodyMap({ markers, onAddMarker, onRemoveMarker, readonly = false }: BodyMapProps) {
    const [showPopover, setShowPopover] = useState(false);
    const [popoverPos, setPopoverPos] = useState({ x: 0, y: 0 });
    const [selectedSymptom, setSelectedSymptom] = useState("");
    const [selectedIntensity, setSelectedIntensity] = useState(5);
    const [pendingRegion, setPendingRegion] = useState("");

    const handleSvgClick = useCallback(
        (e: React.MouseEvent<SVGSVGElement>) => {
            if (readonly) return;
            const svg = e.currentTarget;
            const rect = svg.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;

            const region = getRegionFromPosition(x, y);
            setPendingRegion(region);
            setPopoverPos({ x, y });
            setSelectedSymptom("");
            setSelectedIntensity(5);
            setShowPopover(true);
        },
        [readonly]
    );

    function handleConfirmMarker() {
        if (!selectedSymptom) return;
        onAddMarker({
            bodyRegion: pendingRegion,
            xPos: popoverPos.x,
            yPos: popoverPos.y,
            symptom: selectedSymptom,
            intensity: selectedIntensity,
        });
        setShowPopover(false);
    }

    return (
        <div className="relative">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-neutral-700">Body Map</h3>
                {!readonly && (
                    <span className="text-xs text-neutral-400">Tap to mark symptoms</span>
                )}
            </div>

            {/* SVG Body */}
            <div className="relative bg-gradient-to-b from-neutral-50 to-white rounded-2xl border border-neutral-200/50 p-4 flex justify-center">
                <svg
                    viewBox="0 0 200 440"
                    className={cn(
                        "w-full max-w-[220px]",
                        !readonly && "cursor-crosshair"
                    )}
                    onClick={handleSvgClick}
                >
                    {/* Body outline */}
                    <path
                        d="M100 30 C85 30 75 45 75 55 C75 65 85 75 100 75 C115 75 125 65 125 55 C125 45 115 30 100 30Z"
                        className="fill-primary-100/50 stroke-primary-300"
                        strokeWidth="1.5"
                    />
                    <path
                        d="M80 80 L70 84 L55 110 L50 150 L60 152 L70 120 L80 100 L80 80Z"
                        className="fill-primary-100/30 stroke-primary-300"
                        strokeWidth="1.5"
                    />
                    <path
                        d="M120 80 L130 84 L145 110 L150 150 L140 152 L130 120 L120 100 L120 80Z"
                        className="fill-primary-100/30 stroke-primary-300"
                        strokeWidth="1.5"
                    />
                    <path
                        d="M82 78 L80 100 L78 160 L75 200 L78 260 L72 340 L68 400 L80 405 L90 340 L95 270 L100 260 L105 270 L110 340 L120 405 L132 400 L128 340 L122 260 L125 200 L122 160 L120 100 L118 78 L100 85Z"
                        className="fill-primary-100/30 stroke-primary-300"
                        strokeWidth="1.5"
                    />

                    {/* Existing markers */}
                    {markers.map((marker, i) => {
                        const cx = (marker.xPos / 100) * 200;
                        const cy = (marker.yPos / 100) * 440;
                        return (
                            <g key={i}>
                                <circle
                                    cx={cx}
                                    cy={cy}
                                    r={6 + marker.intensity * 0.5}
                                    className={cn(
                                        "opacity-70 pulse-glow cursor-pointer",
                                        marker.intensity <= 3 ? "fill-warning-500" : marker.intensity <= 6 ? "fill-orange-500" : "fill-danger-500"
                                    )}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (!readonly) onRemoveMarker(i);
                                    }}
                                />
                                <circle cx={cx} cy={cy} r="3" className="fill-white" />
                            </g>
                        );
                    })}
                </svg>

                {/* Marker popover for adding new symptom */}
                {showPopover && (
                    <div
                        className="absolute z-10 bg-white rounded-xl shadow-xl border border-neutral-200 p-4 w-64 animate-slide-up"
                        style={{
                            left: `${Math.min(60, Math.max(10, popoverPos.x))}%`,
                            top: `${Math.min(70, popoverPos.y)}%`,
                            transform: "translate(-50%, -100%)",
                        }}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-semibold text-neutral-800">
                                {formatRegion(pendingRegion)}
                            </span>
                            <button
                                onClick={() => setShowPopover(false)}
                                className="w-6 h-6 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-400"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Symptom selection */}
                        <div className="mb-3">
                            <label className="text-xs font-medium text-neutral-500 mb-1.5 block">
                                Symptom
                            </label>
                            <div className="flex flex-wrap gap-1.5">
                                {COMMON_SYMPTOMS.slice(0, 8).map((symptom) => (
                                    <button
                                        key={symptom}
                                        onClick={() => setSelectedSymptom(symptom)}
                                        className={cn(
                                            "px-2 py-1 rounded-lg text-xs font-medium transition-all",
                                            selectedSymptom === symptom
                                                ? "bg-primary-500 text-white"
                                                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                                        )}
                                    >
                                        {symptom}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Intensity slider */}
                        <div className="mb-4">
                            <div className="flex items-center justify-between mb-1">
                                <label className="text-xs font-medium text-neutral-500">
                                    Intensity
                                </label>
                                <span className={cn(
                                    "text-xs font-bold",
                                    selectedIntensity <= 3 ? "text-warning-500" : selectedIntensity <= 6 ? "text-orange-500" : "text-danger-500"
                                )}>
                                    {selectedIntensity}/10
                                </span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                value={selectedIntensity}
                                onChange={(e) => setSelectedIntensity(Number(e.target.value))}
                                className="w-full accent-primary-500"
                            />
                        </div>

                        <button
                            onClick={handleConfirmMarker}
                            disabled={!selectedSymptom}
                            className="w-full py-2 rounded-lg bg-primary-500 text-white text-xs font-semibold hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            Add Marker
                        </button>
                    </div>
                )}
            </div>

            {/* Marker list */}
            {markers.length > 0 && (
                <div className="mt-3 space-y-1.5">
                    {markers.map((marker, i) => (
                        <div
                            key={i}
                            className="flex items-center justify-between px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-100 text-sm"
                        >
                            <div className="flex items-center gap-2">
                                <div className={cn("w-2 h-2 rounded-full", getIntensityColor(marker.intensity))} />
                                <span className="font-medium text-neutral-700">{formatRegion(marker.bodyRegion)}</span>
                                <span className="text-neutral-400">·</span>
                                <span className="text-neutral-500">{marker.symptom}</span>
                            </div>
                            {!readonly && (
                                <button
                                    onClick={() => onRemoveMarker(i)}
                                    className="text-neutral-400 hover:text-danger-500 text-xs transition-colors"
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
