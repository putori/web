"use client";

import React, { useState, useEffect, useCallback } from "react";
import BuyerNavbar from "@/components/buyer/BuyerNavbar";
import {
  getAuction,
  listBids,
  placeBid as apiPlaceBid,
  getUser,
  type AuctionDto,
  type BidDto,
  API_BASE,
} from "@/lib/api";

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

const fmt = (n: number) => n.toLocaleString("vi-VN") + "đ";

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "vừa xong";
  if (mins < 60) return `${mins} phút trước`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} giờ trước`;
  return `${Math.floor(hours / 24)} ngày trước`;
}

function maskUser(bidderId: number): string {
  const s = String(bidderId);
  if (s.length <= 2) return s[0] + "***";
  return s[0] + "***" + s[s.length - 1];
}

// ─── CountdownTimer ───────────────────────────────────────────────────────────

function CountdownTimer({ endTime }: { endTime: string }) {
  const [remaining, setRemaining] = useState(() =>
    Math.max(0, Math.floor((new Date(endTime).getTime() - Date.now()) / 1000))
  );

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

export interface ProductDetailPageProps {
  auctionId?: string | number;
  onPlaceBid?: (amount: number) => void;
  onBuyNow?: () => void;
}

export default function ProductDetailPage({
  auctionId,
  onPlaceBid,
  onBuyNow,
}: ProductDetailPageProps) {
  const [auction, setAuction] = useState<AuctionDto | null>(null);
  const [bids, setBids] = useState<BidDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeThumb, setActiveThumb] = useState(0);
  const [bidAmount, setBidAmount] = useState<string>("");
  const [bidPlaced, setBidPlaced] = useState(false);
  const [bidError, setBidError] = useState<string | null>(null);
  const [bidLoading, setBidLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!auctionId) return;
    try {
      const [auctionData, bidsData] = await Promise.all([
        getAuction(auctionId),
        listBids(auctionId),
      ]);
      setAuction(auctionData);
      setBids(bidsData.sort((a, b) => b.amount - a.amount));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không tải được dữ liệu");
    } finally {
      setLoading(false);
    }
  }, [auctionId]);

  useEffect(() => {
    fetchData();
    // Poll every 10s for live bid updates
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handlePlaceBid = async () => {
    if (!auction) return;
    const amount = parseInt(bidAmount.replace(/\D/g, ""), 10);
    const minBid = Number(auction.currentPrice) + Number(auction.minimumStep);
    if (isNaN(amount) || amount < minBid) {
      setBidError(`Giá đặt phải tối thiểu ${fmt(minBid)}`);
      return;
    }
    const user = getUser();
    if (!user) {
      setBidError("Bạn cần đăng nhập để đặt giá");
      return;
    }
    setBidLoading(true);
    setBidError(null);
    try {
      await apiPlaceBid(auction.id, user.id, amount, amount * 2);
      setBidPlaced(true);
      setBidAmount("");
      setTimeout(() => setBidPlaced(false), 3000);
      onPlaceBid?.(amount);
      // Refresh data
      const [auctionData, bidsData] = await Promise.all([
        getAuction(auction.id),
        listBids(auction.id),
      ]);
      setAuction(auctionData);
      setBids(bidsData.sort((a, b) => b.amount - a.amount));
    } catch (e) {
      setBidError(e instanceof Error ? e.message : "Đặt giá thất bại");
    } finally {
      setBidLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "Inter, sans-serif" }}>
        <BuyerNavbar />
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 400, color: C.m }}>
          Đang tải...
        </div>
      </div>
    );
  }

  if (error || !auction) {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "Inter, sans-serif" }}>
        <BuyerNavbar />
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 400, color: C.red }}>
          {error || "Không tìm thấy sản phẩm"}
        </div>
      </div>
    );
  }

  const product = auction.product;
  const currentBid = Number(auction.currentPrice ?? auction.startingPrice);
  const minimumStep = Number(auction.minimumStep ?? 50000);
  const suggestedBid = currentBid + minimumStep;
  const images = product?.images ?? [];
  const isOpen = auction.status === "OPEN";

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
      {isOpen && (
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
              PHIÊN ĐẤU GIÁ ĐANG DIỄN RA · Giá hiện tại: {fmt(currentBid)} ·{" "}
              {bids.length} lượt đặt giá
            </span>
          </div>
        </div>
      )}

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
              overflow: "hidden",
            }}
          >
            {images[activeThumb]?.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`${API_BASE}/${images[activeThumb].url}`}
                alt={product?.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
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
            )}
          </div>
          {/* Thumbnails */}
          {images.length > 0 && (
            <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
              {images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setActiveThumb(i)}
                  style={{
                    width: 100,
                    height: 80,
                    background: C.panel,
                    borderRadius: 10,
                    border: `${i === activeThumb ? 2 : 1}px solid ${
                      i === activeThumb ? C.orange : C.divider
                    }`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    padding: 0,
                    flexShrink: 0,
                    overflow: "hidden",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`${API_BASE}/${img.url}`}
                    alt=""
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </button>
              ))}
            </div>
          )}

          {/* Description */}
          {product?.description && (
            <div
              style={{
                background: C.card,
                borderRadius: 16,
                padding: "20px 24px",
                marginBottom: 16,
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
                Mô tả sản phẩm
              </h3>
              <div style={{ height: 1, background: C.divider, marginBottom: 12 }} />
              <p style={{ color: C.m, fontSize: 13, lineHeight: 1.6 }}>
                {product.description}
              </p>
            </div>
          )}

          {/* Product Info card */}
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
              Thông tin đấu giá
            </h3>
            <div style={{ height: 1, background: C.divider, marginBottom: 12 }} />
            {[
              { label: "Giá khởi điểm", value: fmt(Number(auction.startingPrice)) },
              { label: "Bước giá tối thiểu", value: fmt(minimumStep) },
              { label: "Trạng thái", value: auction.status },
              { label: "Người bán", value: `Seller #${product?.sellerId ?? "?"}` },
            ].map((s, i) => (
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
                <span style={{ color: C.m, fontSize: 13, minWidth: 160 }}>
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
              {isOpen && (
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
              )}
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
                {product?.status ?? auction.status}
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
              {product?.title ?? "Sản phẩm đấu giá"}
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ color: C.m, fontSize: 13 }}>Người bán:</span>
              <span style={{ color: C.orange, fontSize: 13, fontWeight: 600 }}>
                Seller #{product?.sellerId ?? "?"}
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
                  {bids.length} người đang tham gia
                </p>
              </div>
              {isOpen && auction.endTime && (
                <div style={{ textAlign: "right" }}>
                  <p style={{ color: C.m, fontSize: 12, marginBottom: 8 }}>
                    Kết thúc sau
                  </p>
                  <CountdownTimer endTime={auction.endTime} />
                </div>
              )}
              {!isOpen && (
                <div
                  style={{
                    background: C.field,
                    borderRadius: 8,
                    padding: "8px 14px",
                    color: C.m,
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  Đấu giá kết thúc
                </div>
              )}
            </div>
            <div
              style={{ height: 1, background: C.divider, marginBottom: 16 }}
            />

            {isOpen ? (
              <>
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
                    disabled={bidLoading}
                    style={{
                      height: 44,
                      padding: "0 20px",
                      background: bidLoading ? C.d : C.orange,
                      border: "none",
                      borderRadius: 10,
                      color: C.white,
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: bidLoading ? "not-allowed" : "pointer",
                      fontFamily: "Inter, sans-serif",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {bidLoading ? "Đang đặt..." : "Đặt giá"}
                  </button>
                </div>

                {/* Quick bid suggestions */}
                <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                  {[1, 2, 3].map((mult) => {
                    const inc = minimumStep * mult;
                    return (
                      <button
                        key={mult}
                        onClick={() =>
                          setBidAmount(String(currentBid + inc))
                        }
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
                        +{fmt(inc)}
                      </button>
                    );
                  })}
                </div>

                {bidError && (
                  <div
                    style={{
                      background: "rgba(239,68,68,0.1)",
                      border: "1px solid #ef4444",
                      borderRadius: 8,
                      padding: "8px 12px",
                      color: "#ef4444",
                      fontSize: 13,
                      marginBottom: 12,
                    }}
                  >
                    {bidError}
                  </div>
                )}

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
                  Mua ngay — {fmt(Number(product?.price ?? currentBid))}
                </button>
              </>
            ) : (
              <div style={{ color: C.m, fontSize: 14, textAlign: "center", padding: "16px 0" }}>
                Phiên đấu giá đã kết thúc
                {auction.highestBidderId && (
                  <div style={{ color: C.orange, marginTop: 8, fontWeight: 600 }}>
                    Người thắng: {maskUser(auction.highestBidderId)}
                  </div>
                )}
              </div>
            )}
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
              Lịch sử đặt giá ({bids.length})
            </h3>
            <div
              style={{ height: 1, background: C.divider, marginBottom: 12 }}
            />
            {bids.length === 0 ? (
              <p style={{ color: C.m, fontSize: 13 }}>Chưa có lượt đặt giá nào.</p>
            ) : (
              bids.slice(0, 10).map((b, i) => (
                <div
                  key={b.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 0",
                    borderBottom:
                      i < Math.min(bids.length, 10) - 1
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
                        {String(b.bidderId)[0]}
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
                        {maskUser(b.bidderId)}
                      </p>
                      <p style={{ color: C.d, fontSize: 11 }}>
                        {timeAgo(b.createdAt)}
                      </p>
                    </div>
                  </div>
                  <span
                    style={{
                      color: i === 0 ? C.orange : C.m,
                      fontSize: 14,
                      fontWeight: i === 0 ? 700 : 400,
                    }}
                  >
                    {fmt(Number(b.amount))}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
