import React from "react";

// ─── Types ──────────────────────────────────────────────────────────────────

export type BoostPackage = "bronze" | "silver" | "gold";
export type BoostDuration = 3 | 7 | 14;

export interface BoostProduct {
  name: string;
  highestPrice: string;
  bids: number;
  timeLeft: string;
  isLive?: boolean;
}

export interface BoosterPaymentPopupProps {
  product?: BoostProduct;
  selectedPackage?: BoostPackage;
  selectedDuration?: BoostDuration;
  walletBalance?: string;
  onSelectPackage?: (pkg: BoostPackage) => void;
  onSelectDuration?: (days: BoostDuration) => void;
  onConfirm?: () => void;
  onClose?: () => void;
}

// ─── Package config ───────────────────────────────────────────────────────────

const PKG_CONFIG = {
  bronze: {
    label: "ĐỒNG",
    icon: "D",
    color: "#cd7c2f",
    bg: "#131620",
    bgActive: "#131620",
    borderActive: "#3a3d4e",
    pricePerDay: "50.000₫ / ngày",
    desc: "Top 20 kết quả",
    iconBg: "rgba(146,64,14,0.2)",
  },
  silver: {
    label: "BẠC",
    icon: "S",
    color: "#f97316",
    bg: "#1e1a14",
    bgActive: "#1e1a14",
    borderActive: "#f97316",
    pricePerDay: "100.000₫ / ngày",
    desc: "Top 10 kết quả",
    iconBg: "rgba(249,115,22,0.2)",
  },
  gold: {
    label: "VÀNG",
    icon: "G",
    color: "#eab308",
    bg: "#131620",
    bgActive: "#131620",
    borderActive: "#3a3d4e",
    pricePerDay: "200.000₫ / ngày",
    desc: "Top 3 + Banner nổi bật",
    iconBg: "rgba(234,179,8,0.2)",
  },
} as const;

const DURATION_PRICES: Record<BoostPackage, Record<BoostDuration, string>> = {
  bronze: { 3: "150.000₫", 7: "350.000₫", 14: "700.000₫" },
  silver: { 3: "300.000₫", 7: "700.000₫", 14: "1.400.000₫" },
  gold: { 3: "600.000₫", 7: "1.400.000₫", 14: "2.800.000₫" },
};

const DEFAULT_PRODUCT: BoostProduct = {
  name: "PlayStation 5 Pro",
  highestPrice: "28.500.000₫",
  bids: 28,
  timeLeft: "01:24:36",
  isLive: true,
};

// ─── BoosterPaymentPopup ──────────────────────────────────────────────────────

export default function BoosterPaymentPopup({
  product = DEFAULT_PRODUCT,
  selectedPackage: initPkg = "silver",
  selectedDuration: initDur = 7,
  walletBalance = "2.500.000₫",
  onSelectPackage,
  onSelectDuration,
  onConfirm,
  onClose,
}: BoosterPaymentPopupProps) {
  const [pkg, setPkg] = React.useState<BoostPackage>(initPkg);
  const [dur, setDur] = React.useState<BoostDuration>(initDur);

  const handlePkg = (p: BoostPackage) => {
    setPkg(p);
    onSelectPackage?.(p);
  };
  const handleDur = (d: BoostDuration) => {
    setDur(d);
    onSelectDuration?.(d);
  };

  const total = DURATION_PRICES[pkg][dur];
  const pkgLabel = PKG_CONFIG[pkg].label;

  return (
    <>
      {onClose && (
        <div
          onClick={onClose}
          style={{ position: "fixed", inset: 0, zIndex: 999 }}
        />
      )}

      <div
        style={{
          position: "absolute",
          width: 520,
          backgroundColor: "#1a1d27",
          border: "1px solid #252836",
          borderRadius: 12,
          overflow: "hidden",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 12px 48px rgba(0,0,0,0.6)",
        }}
      >
        {/* ── Header ─────────────────────────────────────── */}
        <div
          style={{
            position: "relative",
            height: 80,
            backgroundColor: "#f97316",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.12)",
            }}
          />
          <div style={{ position: "relative", padding: "18px 24px 0" }}>
            <div
              style={{
                color: "#fff",
                fontFamily: "Inter, sans-serif",
                fontSize: 22,
                fontWeight: 700,
                lineHeight: "27px",
              }}
            >
              Boost Sản phẩm
            </div>
            <div
              style={{
                color: "#fff",
                fontFamily: "Inter, sans-serif",
                fontSize: 11,
                fontWeight: 400,
                marginTop: 4,
                opacity: 0.9,
              }}
            >
              Tăng lượt hiển thị và độ nổi bật cho phiên đấu giá
            </div>
          </div>
          {/* Close btn */}
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: 22,
              right: 22,
              width: 22,
              height: 22,
              borderRadius: 11,
              backgroundColor: "rgba(0,0,0,0.3)",
              border: "none",
              cursor: "pointer",
              color: "#fff",
              fontFamily: "Inter, sans-serif",
              fontSize: 12,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        {/* ── Body ───────────────────────────────────────── */}
        <div style={{ padding: "0 24px 24px" }}>
          {/* Product card */}
          <div
            style={{
              marginTop: 16,
              height: 76,
              backgroundColor: "#0f1117",
              border: "1px solid #f97316",
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Orange left accent */}
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: 5,
                height: 76,
                backgroundColor: "#f97316",
              }}
            />
            <div style={{ marginLeft: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    color: "#f0f2f5",
                    fontFamily: "Inter, sans-serif",
                    fontSize: 15,
                    fontWeight: 700,
                  }}
                >
                  {product.name}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginTop: 8,
                }}
              >
                <span
                  style={{
                    color: "#8b8fa3",
                    fontFamily: "Inter, sans-serif",
                    fontSize: 12,
                  }}
                >
                  Giá cao nhất:
                </span>
                <span
                  style={{
                    color: "#f97316",
                    fontFamily: "Inter, sans-serif",
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  {product.highestPrice}
                </span>
                <span
                  style={{
                    color: "#8b8fa3",
                    fontFamily: "Inter, sans-serif",
                    fontSize: 12,
                  }}
                >
                  |&nbsp;&nbsp;{product.bids} lượt&nbsp;&nbsp;|&nbsp;&nbsp;còn{" "}
                  {product.timeLeft}
                </span>
              </div>
            </div>
            {/* LIVE badge */}
            {product.isLive && (
              <div
                style={{
                  position: "absolute",
                  right: 10,
                  top: 8,
                  width: 50,
                  height: 20,
                  backgroundColor: "rgba(34,197,94,0.15)",
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    color: "#22c55e",
                    fontFamily: "Inter, sans-serif",
                    fontSize: 10,
                    fontWeight: 700,
                  }}
                >
                  LIVE
                </span>
              </div>
            )}
          </div>

          {/* Package section */}
          <div style={{ marginTop: 16 }}>
            <div
              style={{
                color: "#f0f2f5",
                fontFamily: "Inter, sans-serif",
                fontSize: 14,
                fontWeight: 700,
                marginBottom: 12,
              }}
            >
              Chọn gói Boost
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {(["bronze", "silver", "gold"] as BoostPackage[]).map((p) => {
                const cfg = PKG_CONFIG[p];
                const isSelected = pkg === p;
                return (
                  <button
                    key={p}
                    onClick={() => handlePkg(p)}
                    style={{
                      flex: 1,
                      height: 110,
                      backgroundColor: cfg.bg,
                      border: `${isSelected ? 2 : 1}px solid ${
                        isSelected ? cfg.color : "#3a3d4e"
                      }`,
                      borderRadius: 10,
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      padding: "12px 0 0",
                      gap: 0,
                      transition: "border-color 0.15s",
                    }}
                  >
                    {/* Icon */}
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 16,
                        backgroundColor: cfg.iconBg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 8,
                      }}
                    >
                      <span
                        style={{
                          color: cfg.color,
                          fontFamily: "Inter, sans-serif",
                          fontSize: 16,
                          fontWeight: 700,
                        }}
                      >
                        {cfg.icon}
                      </span>
                    </div>
                    {/* Label */}
                    <span
                      style={{
                        color: cfg.color,
                        fontFamily: "Inter, sans-serif",
                        fontSize: 13,
                        fontWeight: 700,
                        marginBottom: 8,
                      }}
                    >
                      {cfg.label}
                    </span>
                    {/* Divider */}
                    <div
                      style={{
                        width: "85%",
                        height: 1,
                        backgroundColor: isSelected
                          ? `${cfg.color}4d`
                          : "#2a2d3e",
                        marginBottom: 6,
                      }}
                    />
                    {/* Price */}
                    <span
                      style={{
                        color: isSelected ? cfg.color : "#8b8fa3",
                        fontFamily: "Inter, sans-serif",
                        fontSize: 11,
                        fontWeight: 700,
                        marginBottom: 4,
                      }}
                    >
                      {cfg.pricePerDay}
                    </span>
                    <span
                      style={{
                        color: isSelected ? cfg.color : "#555870",
                        fontFamily: "Inter, sans-serif",
                        fontSize: 10,
                        fontWeight: 400,
                      }}
                    >
                      {cfg.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Duration section */}
          <div style={{ marginTop: 16 }}>
            <div
              style={{
                color: "#f0f2f5",
                fontFamily: "Inter, sans-serif",
                fontSize: 14,
                fontWeight: 700,
                marginBottom: 12,
              }}
            >
              Thời hạn
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {([3, 7, 14] as BoostDuration[]).map((d) => {
                const isSelected = dur === d;
                return (
                  <button
                    key={d}
                    onClick={() => handleDur(d)}
                    style={{
                      flex: 1,
                      height: 54,
                      backgroundColor: isSelected ? "#1e1a14" : "#131620",
                      border: `${isSelected ? 2 : 1}px solid ${
                        isSelected ? "#f97316" : "#3a3d4e"
                      }`,
                      borderRadius: 8,
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      justifyContent: "center",
                      padding: "0 12px",
                      transition: "border-color 0.15s",
                    }}
                  >
                    <span
                      style={{
                        color: isSelected ? "#f97316" : "#c5c7d4",
                        fontFamily: "Inter, sans-serif",
                        fontSize: 13,
                        fontWeight: isSelected ? 700 : 600,
                        display: "block",
                      }}
                    >
                      {d} ngày
                    </span>
                    <span
                      style={{
                        color: isSelected ? "#f97316" : "#8b8fa3",
                        fontFamily: "Inter, sans-serif",
                        fontSize: 12,
                        fontWeight: isSelected ? 700 : 400,
                        display: "block",
                        marginTop: 2,
                      }}
                    >
                      {DURATION_PRICES[pkg][d]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Payment section */}
          <div style={{ marginTop: 16 }}>
            <div
              style={{
                color: "#f0f2f5",
                fontFamily: "Inter, sans-serif",
                fontSize: 14,
                fontWeight: 700,
                marginBottom: 12,
              }}
            >
              Phương thức thanh toán
            </div>
            {/* Wallet option */}
            <div
              style={{
                height: 56,
                backgroundColor: "#1e1a14",
                border: "2px solid #f97316",
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                padding: "0 14px",
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: "rgba(249,115,22,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    color: "#f97316",
                    fontFamily: "Inter, sans-serif",
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  Xu
                </span>
              </div>
              <div style={{ marginLeft: 10, flex: 1 }}>
                <div
                  style={{
                    color: "#f0f2f5",
                    fontFamily: "Inter, sans-serif",
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  Ví TechBid Xu
                </div>
                <div
                  style={{
                    color: "#8b8fa3",
                    fontFamily: "Inter, sans-serif",
                    fontSize: 12,
                    marginTop: 2,
                  }}
                >
                  Số dư: {walletBalance}&nbsp;&nbsp;|&nbsp;&nbsp;Đủ để thanh
                  toán
                </div>
              </div>
              {/* Check mark */}
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 11,
                  backgroundColor: "#f97316",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    color: "#fff",
                    fontSize: 13,
                    fontWeight: 700,
                    fontFamily: "Inter, sans-serif",
                    lineHeight: 1,
                  }}
                >
                  ✓
                </span>
              </div>
            </div>

            {/* Summary row */}
            <div
              style={{
                marginTop: 8,
                height: 40,
                backgroundColor: "#0a0b0f",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 12px",
              }}
            >
              <span
                style={{
                  color: "#8b8fa3",
                  fontFamily: "Inter, sans-serif",
                  fontSize: 12,
                }}
              >
                Gói {pkgLabel} x {dur} ngày:
              </span>
              <span
                style={{
                  color: "#f97316",
                  fontFamily: "Inter, sans-serif",
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                Tổng: {total}
              </span>
            </div>
          </div>

          {/* Confirm button */}
          <button
            onClick={onConfirm}
            style={{
              position: "relative",
              marginTop: 16,
              width: "100%",
              height: 52,
              backgroundColor: "#f97316",
              border: "none",
              borderRadius: 12,
              cursor: "pointer",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Shine overlay */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 26,
                backgroundColor: "rgba(255,255,255,0.08)",
              }}
            />
            <span
              style={{
                position: "relative",
                color: "#fff",
                fontFamily: "Inter, sans-serif",
                fontSize: 15,
                fontWeight: 700,
              }}
            >
              Xác nhận Boost&nbsp;&nbsp;—&nbsp;&nbsp;{total}
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
