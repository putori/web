"use client";

import React, { useState } from "react";
import BuyerNavbar from "@/components/buyer/BuyerNavbar";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Product {
  id: string;
  name: string;
  category: string;
  currentBid: number;
  bids: number;
  timeLeft: string;
  isHot?: boolean;
}

export interface SearchCatalogPageProps {
  products?: Product[];
  onProductClick?: (product: Product) => void;
  onSearch?: (query: string) => void;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const DEFAULT_CATEGORIES = [
  { name: "Chuột gaming", count: 342 },
  { name: "Bàn phím cơ", count: 218 },
  { name: "Tai nghe", count: 156 },
  { name: "Màn hình", count: 89 },
  { name: "Ghế gaming", count: 67 },
];

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Razer DeathAdder V3",
    category: "CHUỘT GAMING",
    currentBid: 1250000,
    bids: 24,
    timeLeft: "02:14:33",
    isHot: true,
  },
  {
    id: "2",
    name: "Logitech G Pro X TKL",
    category: "BÀN PHÍM CƠ",
    currentBid: 3800000,
    bids: 41,
    timeLeft: "05:42:10",
    isHot: false,
  },
  {
    id: "3",
    name: "SteelSeries Arctis Nova 7",
    category: "TAI NGHE",
    currentBid: 2100000,
    bids: 18,
    timeLeft: "00:58:02",
    isHot: true,
  },
  {
    id: "4",
    name: 'ASUS ROG Swift 32"',
    category: "MÀN HÌNH 4K",
    currentBid: 12500000,
    bids: 7,
    timeLeft: "11:20:45",
    isHot: false,
  },
  {
    id: "5",
    name: "Corsair K100 RGB",
    category: "BÀN PHÍM CƠ",
    currentBid: 4200000,
    bids: 12,
    timeLeft: "08:00:00",
    isHot: false,
  },
  {
    id: "6",
    name: "HyperX Cloud Alpha S",
    category: "TAI NGHE",
    currentBid: 1550000,
    bids: 29,
    timeLeft: "03:30:15",
    isHot: false,
  },
  {
    id: "7",
    name: "Secretlab Titan Evo",
    category: "GHẾ GAMING",
    currentBid: 9800000,
    bids: 5,
    timeLeft: "23:11:44",
    isHot: false,
  },
  {
    id: "8",
    name: "Benq Zowie XL2546K",
    category: "MÀN HÌNH 240HZ",
    currentBid: 8000000,
    bids: 11,
    timeLeft: "16:05:22",
    isHot: false,
  },
];

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
        }}
      >
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
          <rect x="5" y="2" width="14" height="20" rx="7" />
          <path d="M12 2v8" />
          <line x1="5" y1="10" x2="19" y2="10" />
        </svg>
        {product.isHot && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -130%)",
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
            HOT
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
          <span
            style={{
              color: C.d,
              fontSize: 11,
              fontFamily: "Inter, sans-serif",
            }}
          >
            · {product.bids} lượt
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
  products = DEFAULT_PRODUCTS,
  onProductClick,
  onSearch,
}: SearchCatalogPageProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Chuột gaming");
  const [sort, setSort] = useState("Mới nhất");

  const filtered = products.filter((p) => {
    if (query && !p.name.toLowerCase().includes(query.toLowerCase()))
      return false;
    return true;
  });

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
            cursor: "pointer",
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
              "Nhiều lượt đặt",
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
          {DEFAULT_CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                padding: "7px 8px",
                borderRadius: 8,
                marginBottom: 2,
                background:
                  activeCategory === cat.name ? "#1a1e2e" : "transparent",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                fontFamily: "Inter, sans-serif",
                transition: "background 0.15s",
              }}
            >
              <span
                style={{
                  color: activeCategory === cat.name ? C.orange : C.p,
                  fontSize: 13,
                  fontWeight: activeCategory === cat.name ? 600 : 400,
                  fontFamily: "Inter, sans-serif",
                }}
              >
                {cat.name}
              </span>
              <span
                style={{
                  background: C.divider,
                  borderRadius: 4,
                  padding: "2px 6px",
                  color: C.m,
                  fontSize: 11,
                  fontFamily: "Inter, sans-serif",
                }}
              >
                {cat.count}
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
              defaultValue="100K"
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
              defaultValue="5.000K"
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 0",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#ef4444",
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: 13, color: C.p }}>Đang diễn ra</span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 0",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#f59e0b",
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: 13, color: C.m }}>Sắp kết thúc</span>
          </div>
        </div>

        {/* Product Grid */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ color: C.m, fontSize: 13, marginBottom: 16 }}>
            <strong style={{ color: C.p, fontWeight: 600 }}>
              {filtered.length}
            </strong>{" "}
            sản phẩm
          </p>
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
        </div>
      </div>
    </div>
  );
}
