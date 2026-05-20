"use client";

import React, { useState, useEffect } from "react";
import BuyerNavbar from "@/components/buyer/BuyerNavbar";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Spec {
  label: string;
  value: string;
}
export interface BidHistoryEntry {
  user: string;
  amount: number;
  time: string;
}

export interface ProductDetailProps {
  name?: string;
  category?: string;
  condition?: string;
  specs?: Spec[];
  currentBid?: number;
  startPrice?: number;
  bidHistory?: BidHistoryEntry[];
  endTime?: Date;
  seller?: { name: string; rating: number; sales: number };
  onPlaceBid?: (amount: number) => void;
  onBuyNow?: () => void;
  buyNowPrice?: number;
  totalBids?: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const C = {
  bg: "#0a0b0f",
  panel: "#0f1117",
  card: "#141720",
  field: "#1e2236",
  border: "#272c42",
  divider: "#1e2236",
  orange: "#f97316",
  white: "#ffffff",
  p: "#f0f2f5",
  s: "#e0e3ea",
  m: "#8b8fa3",
  d: "#555872",
  green: "#22c55e",
  red: "#ef4444",
};

const DEFAULT_SPECS: Spec[] = [
  { label: "Sensor", value: "Razer Focus Pro 30K Optical" },
  { label: "DPI", value: "100 – 30,000 DPI" },
  { label: "Trọng lượng", value: "88g (không dây)" },
  { label: "Kết nối", value: "Razer HyperSpeed Wireless / USB-C" },
  { label: "Pin", value: "90 giờ sử dụng liên tục" },
  { label: "Switch", value: "Razer Optical Gen-3 (90M clicks)" },
  { label: "Màu sắc", value: "Trắng (Mercury White)" },
  { label: "Bảo hành", value: "2 năm chính hãng" },
];

const DEFAULT_BID_HISTORY: BidHistoryEntry[] = [
  { user: "N***h", amount: 1250000, time: "02 phút trước" },
  { user: "t***k", amount: 1150000, time: "08 phút trước" },
  { user: "m***y", amount: 1050000, time: "15 phút trước" },
  { user: "v***a", amount: 950000, time: "23 phút trước" },
  { user: "b***z", amount: 850000, time: "31 phút trước" },
];

const fmt = (n: number) => n.toLocaleString("vi-VN") + "đ";

// ─── CountdownTimer ───────────────────────────────────────────────────────────

function CountdownTimer({ seconds }: { seconds: number }) {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    const id = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000);
    return () => clearInterval(id);
  }, []);

  const h = Math.floor(remaining / 3600);
  const m = Math.floor((remaining % 3600) / 60);
  const s = remaining % 60;
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      {[
        [h, "GIỜ"],
        [m, "PHÚT"],
        [s, "GIÂY"],
      ].map(([val, lbl], i) => (
        <React.Fragment key={i}>
          {i > 0 && (
            <span style={{ color: C.orange, fontSize: 18, fontWeight: 700 }}>
              :
            </span>
          )}
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                background: C.field,
                borderRadius: 8,
                padding: "8px 14px",
                minWidth: 52,
              }}
            >
              <span
                style={{
                  color: C.p,
                  fontSize: 22,
                  fontWeight: 700,
                  fontFamily: "Inter, sans-serif",
                }}
              >
                {pad(val as number)}
              </span>
            </div>
            <div
              style={{
                color: C.d,
                fontSize: 10,
                fontWeight: 600,
                marginTop: 4,
                fontFamily: "Inter, sans-serif",
              }}
            >
              {lbl}
            </div>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

// ─── ProductDetailPage ────────────────────────────────────────────────────────

export default function ProductDetailPage({
  name = "Razer DeathAdder V3 Pro — Mercury White",
  category = "Chuột gaming",
  condition = "Mới 100% — Fullbox",
  specs = DEFAULT_SPECS,
  currentBid = 1250000,
  startPrice = 800000,
  bidHistory = DEFAULT_BID_HISTORY,
  endTime,
  seller = { name: "GameGear.vn", rating: 4.9, sales: 312 },
  onPlaceBid,
  onBuyNow,
  buyNowPrice = 1800000,
  totalBids = 24,
}: ProductDetailProps) {
  const [activeThumb, setActiveThumb] = useState(0);
  const [bidAmount, setBidAmount] = useState<string>("");
  const [bidPlaced, setBidPlaced] = useState(false);
  const secondsLeft = 7873; // 02:11:13

  const handlePlaceBid = () => {
    const amount = parseInt(bidAmount.replace(/\D/g, ""), 10);
    if (!isNaN(amount) && amount > currentBid) {
      onPlaceBid?.(amount);
      setBidPlaced(true);
      setTimeout(() => setBidPlaced(false), 3000);
    }
  };

  const suggestedBid = currentBid + 50000;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        fontFamily: "Inter, sans-serif",
      }}
    >
      <BuyerNavbar />

      {/* Auction ticker */}
      <div
        style={{
          background: "rgba(255,71,87,0.9)",
          height: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: C.white,
              animation: "pulse 1.5s infinite",
            }}
          />
          <span
            style={{
              color: C.white,
              fontSize: 13,
              fontWeight: 600,
              fontFamily: "Inter, sans-serif",
            }}
          >
            PHIÊN ĐẤU GIÁ ĐANG DIỄN RA · Còn 02:14:33 · Giá hiện tại:{" "}
            {fmt(currentBid)} · {totalBids} người đang đặt giá
          </span>
        </div>
      </div>

      {/* Main content */}
      <div style={{ display: "flex", gap: 32, padding: "24px 80px" }}>
        {/* Gallery column */}
        <div style={{ width: 560, flexShrink: 0 }}>
          {/* Main image */}
          <div
            style={{
              width: 560,
              height: 400,
              background: C.card,
              borderRadius: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
              border: `1px solid ${C.border}`,
            }}
          >
            <svg
              width="80"
              height="80"
              viewBox="0 0 24 24"
              fill="none"
              stroke={C.border}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
          {/* Thumbnails */}
          <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
            {Array.from({ length: 5 }, (_, i) => (
              <button
                key={i}
                onClick={() => setActiveThumb(i)}
                style={{
                  width: 100,
                  height: 80,
                  background: i === activeThumb ? C.panel : C.panel,
                  borderRadius: 10,
                  border: `${i === activeThumb ? 2 : 1}px solid ${i === activeThumb ? C.orange : C.divider}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  padding: 0,
                  flexShrink: 0,
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={C.border}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="18" height="18" rx="3" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </button>
            ))}
          </div>

          {/* Specs Card */}
          <div
            style={{
              background: C.card,
              borderRadius: 16,
              padding: "20px 24px",
            }}
          >
            <h3
              style={{
                color: C.p,
                fontSize: 16,
                fontWeight: 700,
                marginBottom: 12,
              }}
            >
              Thông số kỹ thuật
            </h3>
            <div
              style={{ height: 1, background: C.divider, marginBottom: 12 }}
            />
            {specs.map((s, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  background: i % 2 === 0 ? C.bg : "transparent",
                  borderRadius: 6,
                  padding: "8px 10px",
                  marginBottom: 4,
                }}
              >
                <span style={{ color: C.m, fontSize: 13, minWidth: 140 }}>
                  {s.label}
                </span>
                <span
                  style={{ color: C.p, fontSize: 13, fontWeight: 600, flex: 1 }}
                >
                  {s.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Product info */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
              <span
                style={{
                  background: "rgba(239,68,68,0.15)",
                  border: `1px solid ${C.red}`,
                  borderRadius: 6,
                  padding: "3px 10px",
                  color: C.red,
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                LIVE
              </span>
              <span
                style={{
                  background: C.field,
                  borderRadius: 6,
                  padding: "3px 10px",
                  color: C.m,
                  fontSize: 11,
                  fontWeight: 600,
                }}
              >
                {category}
              </span>
              <span
                style={{
                  background: C.field,
                  borderRadius: 6,
                  padding: "3px 10px",
                  color: C.m,
                  fontSize: 11,
                }}
              >
                {condition}
              </span>
            </div>
            <h1
              style={{
                color: C.p,
                fontSize: 22,
                fontWeight: 700,
                lineHeight: 1.35,
                marginBottom: 8,
              }}
            >
              {name}
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ color: C.m, fontSize: 13 }}>Người bán:</span>
              <span style={{ color: C.orange, fontSize: 13, fontWeight: 600 }}>
                {seller.name}
              </span>
            </div>
          </div>

          {/* Bid card */}
          <div
            style={{
              background: C.card,
              borderRadius: 16,
              padding: "20px 24px",
              marginBottom: 16,
              border: `1px solid ${C.border}`,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 16,
              }}
            >
              <div>
                <p style={{ color: C.m, fontSize: 12, marginBottom: 4 }}>
                  Giá hiện tại
                </p>
                <p
                  style={{
                    color: C.orange,
                    fontSize: 28,
                    fontWeight: 700,
                    lineHeight: 1,
                  }}
                >
                  {fmt(currentBid)}
                </p>
                <p style={{ color: C.d, fontSize: 12, marginTop: 4 }}>
                  {totalBids} người đang tham gia
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ color: C.m, fontSize: 12, marginBottom: 8 }}>
                  Kết thúc sau
                </p>
                <CountdownTimer seconds={secondsLeft} />
              </div>
            </div>
            <div
              style={{ height: 1, background: C.divider, marginBottom: 16 }}
            />

            <p style={{ color: C.m, fontSize: 12, marginBottom: 6 }}>
              Nhập giá đấu của bạn
            </p>
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <input
                type="text"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                placeholder={`Tối thiểu ${fmt(suggestedBid)}`}
                style={{
                  flex: 1,
                  height: 44,
                  background: C.field,
                  border: `1px solid ${C.border}`,
                  borderRadius: 10,
                  padding: "0 14px",
                  color: C.p,
                  fontSize: 14,
                  fontFamily: "Inter, sans-serif",
                  outline: "none",
                }}
              />
              <button
                onClick={handlePlaceBid}
                style={{
                  height: 44,
                  padding: "0 20px",
                  background: C.orange,
                  border: "none",
                  borderRadius: 10,
                  color: C.white,
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "Inter, sans-serif",
                  whiteSpace: "nowrap",
                }}
              >
                Đặt giá
              </button>
            </div>

            {/* Quick bid suggestions */}
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              {[50000, 100000, 200000].map((inc) => (
                <button
                  key={inc}
                  onClick={() => setBidAmount(String(currentBid + inc))}
                  style={{
                    flex: 1,
                    height: 32,
                    background: C.field,
                    border: `1px solid ${C.border}`,
                    borderRadius: 8,
                    color: C.m,
                    fontSize: 12,
                    cursor: "pointer",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  +{(inc / 1000).toFixed(0)}K
                </button>
              ))}
            </div>

            {bidPlaced && (
              <div
                style={{
                  background: "rgba(34,197,94,0.1)",
                  border: "1px solid #22c55e",
                  borderRadius: 8,
                  padding: "8px 12px",
                  color: "#22c55e",
                  fontSize: 13,
                  textAlign: "center",
                  marginBottom: 12,
                }}
              >
                ✓ Đặt giá thành công!
              </div>
            )}

            <div
              style={{ height: 1, background: C.divider, marginBottom: 16 }}
            />
            <button
              onClick={onBuyNow}
              style={{
                width: "100%",
                height: 44,
                background: "transparent",
                border: `1px solid ${C.orange}`,
                borderRadius: 10,
                color: C.orange,
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
              }}
            >
              Mua ngay — {fmt(buyNowPrice)}
            </button>
          </div>

          {/* Bid History */}
          <div
            style={{
              background: C.card,
              borderRadius: 16,
              padding: "20px 24px",
            }}
          >
            <h3
              style={{
                color: C.p,
                fontSize: 15,
                fontWeight: 700,
                marginBottom: 12,
              }}
            >
              Lịch sử đặt giá
            </h3>
            <div
              style={{ height: 1, background: C.divider, marginBottom: 12 }}
            />
            {bidHistory.map((b, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 0",
                  borderBottom:
                    i < bidHistory.length - 1
                      ? `1px solid ${C.divider}`
                      : "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: i === 0 ? C.orange : C.field,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span
                      style={{
                        color: i === 0 ? C.white : C.m,
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      {b.user[0].toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p
                      style={{
                        color: i === 0 ? C.p : C.s,
                        fontSize: 13,
                        fontWeight: i === 0 ? 600 : 400,
                      }}
                    >
                      {b.user}
                    </p>
                    <p style={{ color: C.d, fontSize: 11 }}>{b.time}</p>
                  </div>
                </div>
                <span
                  style={{
                    color: i === 0 ? C.orange : C.m,
                    fontSize: 14,
                    fontWeight: i === 0 ? 700 : 400,
                  }}
                >
                  {fmt(b.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Re-export divider color used in the inline style
const divider = C.divider;
