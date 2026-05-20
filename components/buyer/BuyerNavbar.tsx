"use client";

import { useState } from "react";
import { Zap, Bell, ShoppingBag, Clock, Wallet } from "lucide-react";
import Link from "next/link";
import NotificationPopup from "@/components/buyer/NotificationPopup";
import BuyerPopup from "@/components/common/ProfilePopup";

interface BuyerNavbarProps {
  activePage?: "products" | "topup" | "history";
  userName?: string;
  notificationCount?: number;
}

export default function BuyerNavbar({
  activePage,
  userName = "K",
  notificationCount = 3,
}: BuyerNavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const navLinks = [
    {
      key: "products",
      label: "Sản phẩm",
      href: "/products",
      icon: ShoppingBag,
    },
    { key: "topup", label: "Nạp tiền", href: "/topup", icon: Wallet },
    {
      key: "history",
      label: "Lịch sử mua hàng",
      href: "/history",
      icon: Clock,
    },
  ] as const;

  return (
    <nav
      className="w-full h-16 flex items-center px-8 relative"
      style={{ backgroundColor: "#0f1117", borderBottom: "1px solid #1e2236" }}
    >
      {/* ── Logo ─────────────────────────────────────── */}
      <Link href="/" className="flex items-center gap-2 mr-12 flex-shrink-0">
        <span
          className="flex items-center justify-center w-9 h-9 rounded-full"
          style={{ backgroundColor: "rgba(249,115,22,0.15)" }}
        >
          <Zap size={18} fill="#f97316" color="#f97316" />
        </span>
        <span
          className="font-bold text-lg leading-none"
          style={{ color: "#f0f2f5", fontFamily: "Inter, sans-serif" }}
        >
          TechBid
        </span>
      </Link>

      {/* ── Nav links ────────────────────────────────── */}
      <div className="flex items-center gap-8">
        {navLinks.map(({ key, label, href }) => {
          const isActive = activePage === key;
          return (
            <Link
              key={key}
              href={href}
              className="text-sm transition-colors"
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: isActive ? 600 : 400,
                color: isActive ? "#f97316" : "#e0e3ea",
                borderBottom: isActive
                  ? "2px solid #f97316"
                  : "2px solid transparent",
                paddingBottom: "2px",
              }}
            >
              {label}
            </Link>
          );
        })}
      </div>

      {/* ── Right side ───────────────────────────────── */}
      <div className="flex items-center gap-4 ml-auto">
        {/* Notification bell */}
        <div className="relative">
          <button
            className="flex items-center justify-center w-9 h-9 rounded-full transition-colors"
            style={{ backgroundColor: "#1a1d27" }}
            aria-label="Thông báo"
            onClick={() => {
              setShowNotif(!showNotif);
              setShowProfile(false);
            }}
          >
            <Bell size={18} color="#e0e3ea" />
          </button>
          {notificationCount > 0 && (
            <span
              className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-[18px] h-[18px] rounded-full text-[10px] font-bold text-white"
              style={{
                backgroundColor: "#ef4444",
                fontFamily: "Inter, sans-serif",
              }}
            >
              {notificationCount > 9 ? "9+" : notificationCount}
            </span>
          )}
          {showNotif && (
            <div
              style={{ position: "absolute", top: 48, right: 0, width: 360 }}
            >
              <NotificationPopup
                unreadCount={notificationCount}
                onClose={() => setShowNotif(false)}
                onMarkAllRead={() => setShowNotif(false)}
                onViewAll={() => setShowNotif(false)}
              />
            </div>
          )}
        </div>

        {/* Avatar */}
        <div className="relative">
          <button
            className="flex items-center justify-center w-11 h-11 rounded-full font-bold text-sm text-white"
            style={{
              backgroundColor: "#f97316",
              fontFamily: "Inter, sans-serif",
            }}
            aria-label="Tài khoản"
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotif(false);
            }}
          >
            {userName.charAt(0).toUpperCase()}
          </button>
          {showProfile && (
            <div
              style={{ position: "absolute", top: 48, right: 0, width: 280 }}
            >
              <BuyerPopup
                user={{ username: userName, email: "" }}
                onClose={() => setShowProfile(false)}
                onLogout={() => setShowProfile(false)}
              />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
