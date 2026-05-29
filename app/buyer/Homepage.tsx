"use client";

import React, { useState, useMemo } from "react";
import BuyerNavbar from "@/components/buyer/BuyerNavbar";
import type { AuctionDto, CategoryDto } from "@/lib/api";
import { API_BASE } from "@/lib/api";

// ─── Types ────────────────────────────────────────────────────────────────────

// Unified product shape for display (wraps auction data)
export interface Product {
  id: string;
  name: string;
  category: string;
  currentBid: number;
  bids: number;
  timeLeft: string;
  isHot?: boolean;
  imageUrl?: string;
  status: string;
}

export interface SearchCatalogPageProps {
  auctions?: AuctionDto[];
  categories?: CategoryDto[];
  loading?: boolean;
  onProductClick?: (product: Product) => void;
  onSearch?: (query: string) => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

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
  imgBg: "#1a1e2e",
  hotRed: "#ff4757",
};

const fmt = (n: number) => n.toLocaleString("vi-VN") + "đ";

function timeLeftFromEndTime(endTime: string): string {
  if (!endTime) return "--:--:--";
  const diff = new Date(endTime).getTime() - Date.now();
  if (diff <= 0) return "Đã kết thúc";
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function auctionToProduct(a: AuctionDto): Product {
  return {
    id: String(a.id),
    name: a.product?.title ?? "Sản phẩm",
    category: String(a.product?.categoryId ?? ""),
    currentBid: Number(a.currentPrice ?? a.startingPrice ?? 0),
    bids: 0,
    timeLeft: timeLeftFromEndTime(a.endTime),
    isHot: a.status === "OPEN",
    imageUrl:
      a.product?.images?.[0]?.url
        ? `${API_BASE}/${a.product.images[0].url}`
        : undefined,
    status: a.status,
  };
}

// ─── ProductCard ──────────────────────────────────────────────────────────────

function ProductCard({
  product,
  onClick,
}: {
  product: Product;
  onClick?: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: C.card,
        borderRadius: 14,
        overflow: "hidden",
        border: `1px solid ${hovered ? C.orange : C.divider}`,
        cursor: "pointer",
        transition: "border-color 0.2s, transform 0.15s, box-shadow 0.2s",
        transform: hovered ? "translateY(-3px)" : "none",
        boxShadow: hovered ? "0 8px 24px rgba(249,115,22,0.12)" : "none",
      }}
    >
      {/* Image area */}
      <div
        style={{
          position: "relative",
          height: 140,
          background: C.imgBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt={product.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <svg
            width="48"
            height="48"
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
        {product.isHot && product.status === "OPEN" && (
          <div
            style={{
              position: "absolute",
              top: 8,
              left: 8,
              background: C.hotRed,
              borderRadius: 5,
              padding: "3px 8px",
              color: C.white,
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.3px",
              fontFamily: "Inter, sans-serif",
            }}
          >
            LIVE
          </div>
        )}
      </div>

      {/* Body */}
      <div
        style={{
          padding: "12px 14px",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <p
          style={{
            color: C.d,
            fontSize: 10,
            fontWeight: 400,
            textTransform: "uppercase",
            letterSpacing: "0.3px",
            fontFamily: "Inter, sans-serif",
          }}
        >
          {product.category}
        </p>
        <p
          style={{
            color: C.p,
            fontSize: 13,
            fontWeight: 600,
            lineHeight: 1.4,
            fontFamily: "Inter, sans-serif",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {product.name}
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 6,
            marginTop: 2,
          }}
        >
          <span
            style={{
              color: C.orange,
              fontSize: 14,
              fontWeight: 700,
              fontFamily: "Inter, sans-serif",
            }}
          >
            {fmt(product.currentBid)}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginTop: 2,
          }}
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke={C.hotRed}
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
          <span
            style={{
              color: C.hotRed,
              fontSize: 12,
              fontFamily: "Inter, sans-serif",
            }}
          >
            {product.timeLeft}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── SearchCatalogPage ────────────────────────────────────────────────────────

export default function SearchCatalogPage({
  auctions = [],
  categories = [],
  loading = false,
  onProductClick,
  onSearch,
}: SearchCatalogPageProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [sort, setSort] = useState("Mới nhất");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "OPEN" | "ENDED">("ALL");

  const products = useMemo(() => auctions.map(auctionToProduct), [auctions]);

  const filtered = useMemo(() => {
    let list = products;

    if (query) {
      list = list.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (activeCategory !== null) {
      list = list.filter(
        (p) => p.category === String(activeCategory)
      );
    }

    if (minPrice) {
      const min = Number(minPrice.replace(/\D/g, ""));
      if (!isNaN(min)) list = list.filter((p) => p.currentBid >= min);
    }
    if (maxPrice) {
      const max = Number(maxPrice.replace(/\D/g, ""));
      if (!isNaN(max)) list = list.filter((p) => p.currentBid <= max);
    }

    if (statusFilter === "OPEN") list = list.filter((p) => p.status === "OPEN");
    if (statusFilter === "ENDED")
      list = list.filter((p) => p.status !== "OPEN");

    if (sort === "Giá thấp nhất")
      list = [...list].sort((a, b) => a.currentBid - b.currentBid);
    if (sort === "Giá cao nhất")
      list = [...list].sort((a, b) => b.currentBid - a.currentBid);

    return list;
  }, [products, query, activeCategory, minPrice, maxPrice, statusFilter, sort]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        fontFamily: "Inter, sans-serif",
      }}
    >
      <BuyerNavbar activePage="products" />
      {/* Hero Banner */}
      <div style={{ background: C.card, padding: "40px 48px 44px" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: C.orange,
            borderRadius: 6,
            padding: "5px 12px",
            marginBottom: 18,
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: C.white,
            }}
          />
          <span
            style={{
              color: C.white,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.4px",
            }}
          >
            ĐANG ĐẤU GIÁ TRỰC TIẾP
          </span>
        </div>
        <h1
          style={{
            color: C.p,
            fontSize: 42,
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: 12,
          }}
        >
          Sàn Đấu Giá Đồ Điện Tử
          <br />
          Hàng Đầu
        </h1>
        <p style={{ color: C.m, fontSize: 14, lineHeight: 1.6 }}>
          Hàng ngàn phụ kiện gaming chính hãng · Đấu giá minh bạch · Giao hàng
          toàn quốc
        </p>
      </div>

      {/* Search Bar */}
      <div
        style={{
          background: C.panel,
          height: 82,
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "0 48px",
          borderBottom: `1px solid ${C.divider}`,
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            background: C.card,
            border: `1px solid ${C.divider}`,
            borderRadius: 12,
            padding: "0 16px",
            height: 44,
            gap: 10,
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke={C.d}
            strokeWidth="2"
            strokeLinecap="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch?.(query)}
            placeholder="Tìm kiếm tai nghe, chuột, bàn phím..."
            style={{
              flex: 1,
              background: "none",
              border: "none",
              outline: "none",
              color: C.p,
              fontSize: 14,
              fontFamily: "Inter, sans-serif",
            }}
          />
        </div>
        <button
          onClick={() => onSearch?.(query)}
          style={{
            height: 44,
            padding: "0 28px",
            background: C.orange,
            border: "none",
            borderRadius: 12,
            color: C.white,
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "Inter, sans-serif",
            whiteSpace: "nowrap",
          }}
        >
          Tìm kiếm
        </button>
        <div
          style={{
            height: 44,
            padding: "0 14px",
            background: C.card,
            border: `1px solid ${C.divider}`,
            borderRadius: 12,
            color: C.m,
            fontSize: 13,
            fontFamily: "Inter, sans-serif",
            display: "flex",
            alignItems: "center",
            gap: 8,
            whiteSpace: "nowrap",
          }}
        >
          <span>Sắp xếp:</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            style={{
              background: "none",
              border: "none",
              outline: "none",
              color: C.m,
              fontSize: 13,
              fontFamily: "Inter, sans-serif",
              cursor: "pointer",
            }}
          >
            {[
              "Mới nhất",
              "Giá thấp nhất",
              "Giá cao nhất",
            ].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      <div style={{ display: "flex", gap: 20, padding: "20px 48px 32px" }}>
        {/* Filter Sidebar */}
        <div
          style={{
            width: 200,
            flexShrink: 0,
            background: C.card,
            borderRadius: 16,
            padding: 18,
            alignSelf: "flex-start",
          }}
        >
          <div
            style={{
              color: C.p,
              fontSize: 15,
              fontWeight: 700,
              marginBottom: 14,
            }}
          >
            Bộ lọc
          </div>
          <div style={{ height: 1, background: C.divider, margin: "12px 0" }} />

          <p
            style={{
              color: C.d,
              fontSize: 10,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.6px",
              marginBottom: 8,
            }}
          >
            Danh mục
          </p>
          <button
            onClick={() => setActiveCategory(null)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              padding: "7px 8px",
              borderRadius: 8,
              marginBottom: 2,
              background: activeCategory === null ? "#1a1e2e" : "transparent",
              border: "none",
              cursor: "pointer",
              textAlign: "left",
              fontFamily: "Inter, sans-serif",
            }}
          >
            <span
              style={{
                color: activeCategory === null ? C.orange : C.p,
                fontSize: 13,
                fontWeight: activeCategory === null ? 600 : 400,
              }}
            >
              Tất cả
            </span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() =>
                setActiveCategory(activeCategory === cat.id ? null : cat.id)
              }
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                padding: "7px 8px",
                borderRadius: 8,
                marginBottom: 2,
                background:
                  activeCategory === cat.id ? "#1a1e2e" : "transparent",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                fontFamily: "Inter, sans-serif",
              }}
            >
              <span
                style={{
                  color: activeCategory === cat.id ? C.orange : C.p,
                  fontSize: 13,
                  fontWeight: activeCategory === cat.id ? 600 : 400,
                }}
              >
                {cat.name}
              </span>
            </button>
          ))}

          <div style={{ height: 1, background: C.divider, margin: "12px 0" }} />
          <p
            style={{
              color: C.d,
              fontSize: 10,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.6px",
              marginBottom: 8,
            }}
          >
            Khoảng giá
          </p>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <input
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="Từ"
              style={{
                flex: 1,
                minWidth: 0,
                height: 34,
                background: C.bg,
                border: `1px solid ${C.border}`,
                borderRadius: 8,
                padding: "0 10px",
                color: C.p,
                fontSize: 12,
                fontFamily: "Inter, sans-serif",
                outline: "none",
                textAlign: "center",
              }}
            />
            <input
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Đến"
              style={{
                flex: 1,
                minWidth: 0,
                height: 34,
                background: C.bg,
                border: `1px solid ${C.border}`,
                borderRadius: 8,
                padding: "0 10px",
                color: C.p,
                fontSize: 12,
                fontFamily: "Inter, sans-serif",
                outline: "none",
                textAlign: "center",
              }}
            />
          </div>

          <div style={{ height: 1, background: C.divider, margin: "12px 0" }} />
          <p
            style={{
              color: C.d,
              fontSize: 10,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.6px",
              marginBottom: 8,
            }}
          >
            Trạng thái
          </p>
          {(
            [
              { label: "Tất cả", value: "ALL" },
              { label: "Đang diễn ra", value: "OPEN", dot: "#ef4444" },
              { label: "Đã kết thúc", value: "ENDED", dot: "#f59e0b" },
            ] as { label: string; value: "ALL" | "OPEN" | "ENDED"; dot?: string }[]
          ).map((s) => (
            <div
              key={s.value}
              onClick={() => setStatusFilter(s.value)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 8px",
                borderRadius: 8,
                cursor: "pointer",
                background:
                  statusFilter === s.value ? "#1a1e2e" : "transparent",
                marginBottom: 2,
              }}
            >
              {s.dot && (
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: s.dot,
                    flexShrink: 0,
                  }}
                />
              )}
              <span
                style={{
                  fontSize: 13,
                  color: statusFilter === s.value ? C.orange : C.p,
                  fontWeight: statusFilter === s.value ? 600 : 400,
                }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Product Grid */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: 200,
                color: C.m,
                fontSize: 14,
              }}
            >
              Đang tải dữ liệu...
            </div>
          ) : (
            <>
              <p style={{ color: C.m, fontSize: 13, marginBottom: 16 }}>
                <strong style={{ color: C.p, fontWeight: 600 }}>
                  {filtered.length}
                </strong>{" "}
                sản phẩm
              </p>
              {filtered.length === 0 ? (
                <div
                  style={{
                    color: C.m,
                    fontSize: 14,
                    textAlign: "center",
                    padding: "60px 0",
                  }}
                >
                  Không tìm thấy sản phẩm nào.
                </div>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: 16,
                  }}
                >
                  {filtered.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      onClick={() => onProductClick?.(p)}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
