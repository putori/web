"use client";

import { ChevronLeft, Plus } from "lucide-react";

interface SellerNavbarProps {
    pageTitle: string;
    pageSubtitle?: string;
    actionLabel?: string;
    onAction?: () => void;
    onBack?: () => void;
    userName?: string;
}

export default function SellerNavbar({
    pageTitle,
    pageSubtitle,
    actionLabel,
    onAction,
    onBack,
    userName = "K",
}: SellerNavbarProps) {
    return (
        <header
            className="w-full flex items-center px-6 flex-shrink-0"
            style={{
                height: 64,
                backgroundColor: "#0f1117",
                borderBottom: "1px solid #1e2236",
            }}
        >
            {/* ── Left: page title + subtitle ─────────────── */}
            <div className="flex flex-col justify-center mr-auto">
                <h1
                    className="font-bold leading-tight"
                    style={{
                        fontSize: 20,
                        color: "#ffffff",
                        fontFamily: "Inter, sans-serif",
                        lineHeight: "1.2",
                    }}
                >
                    {pageTitle}
                </h1>
                {pageSubtitle && (
                    <p
                        className="mt-0.5"
                        style={{
                            fontSize: 12,
                            color: "#8b8fa3",
                            fontFamily: "Inter, sans-serif",
                            fontWeight: 400,
                        }}
                    >
                        {pageSubtitle}
                    </p>
                )}
            </div>

            {/* ── Right: back + action + avatar ────────────── */}
            <div className="flex items-center gap-3">
                {/* Quay lại */}
                {onBack && (
                    <button
                        onClick={onBack}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm transition-colors hover:bg-white/5"
                        style={{
                            color: "#e0e3ea",
                            fontFamily: "Inter, sans-serif",
                            fontWeight: 600,
                            border: "1px solid #1e2236",
                        }}
                    >
                        <ChevronLeft size={16} />
                        Quay lại
                    </button>
                )}

                {/* Action button (cam) */}
                {actionLabel && (
                    <button
                        onClick={onAction}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90"
                        style={{
                            backgroundColor: "#f97316",
                            color: "#ffffff",
                            fontFamily: "Inter, sans-serif",
                            fontWeight: 600,
                        }}
                    >
                        <Plus size={16} strokeWidth={2.5} />
                        {actionLabel}
                    </button>
                )}

                {/* Avatar */}
                <button
                    className="flex items-center justify-center w-11 h-11 rounded-full font-bold text-sm text-white flex-shrink-0"
                    style={{
                        backgroundColor: "#f97316",
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 700,
                    }}
                    aria-label="Tài khoản"
                >
                    {userName.charAt(0).toUpperCase()}
                </button>
            </div>
        </header>
    );
}
