import React from "react";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface BuyerPopupUser {
  username: string;
  email: string;
  avatarLetter?: string;
}

export interface BuyerPopupProps {
  user: BuyerPopupUser;
  onClose?: () => void;
  // Seller section callbacks
  onOverview?: () => void;
  onMyProducts?: () => void;
  onAuction?: () => void;
  onSalesHistory?: () => void;
  onRevenue?: () => void;
  // Buyer section callbacks
  onMyAccount?: () => void;
  onMyOrders?: () => void;
  onLogout?: () => void;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function Divider() {
  return (
    <div
      style={{
        width: "100%",
        height: 1,
        backgroundColor: "#1e2236",
      }}
    />
  );
}

interface MenuItemProps {
  label: string;
  onClick?: () => void;
}

function MenuItem({ label, onClick }: MenuItemProps) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "block",
        width: "100%",
        textAlign: "left",
        background: hovered ? "#1e2236" : "transparent",
        border: "none",
        cursor: "pointer",
        padding: "0 16px",
        height: 32,
        color: "#e0e3ea",
        fontFamily: "Inter, sans-serif",
        fontSize: 13,
        fontWeight: 400,
        lineHeight: "32px",
        borderRadius: 6,
        transition: "background 0.15s",
      }}
    >
      {label}
    </button>
  );
}

interface SectionLabelProps {
  text: string;
}

function SectionLabel({ text }: SectionLabelProps) {
  return (
    <span
      style={{
        display: "block",
        padding: "0 16px",
        color: "#8b8fa3",
        fontFamily: "Inter, sans-serif",
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
      }}
    >
      {text}
    </span>
  );
}

// ─── BuyerPopup ──────────────────────────────────────────────────────────────

export default function BuyerPopup({
  user,
  onClose,
  onOverview,
  onMyProducts,
  onAuction,
  onSalesHistory,
  onRevenue,
  onMyAccount,
  onMyOrders,
  onLogout,
}: BuyerPopupProps) {
  const letter = user.avatarLetter ?? user.username.charAt(0).toUpperCase();

  return (
    <>
      {/* Backdrop */}
      {onClose && (
        <div
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 999,
          }}
        />
      )}

      {/* Popup panel — 280 × 440 matching Figma frame */}
      <div
        style={{
          position: "absolute",
          width: 280,
          backgroundColor: "#141720",
          border: "1px solid #1e2236",
          borderRadius: 12,
          overflow: "hidden",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* ── Header ─────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "16px 16px 16px 16px",
          }}
        >
          {/* Avatar circle */}
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              backgroundColor: "#f97316",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                color: "#ffffff",
                fontFamily: "Inter, sans-serif",
                fontSize: 16,
                fontWeight: 700,
                lineHeight: 1,
              }}
            >
              {letter}
            </span>
          </div>

          {/* Name + email */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span
              style={{
                color: "#ffffff",
                fontFamily: "Inter, sans-serif",
                fontSize: 14,
                fontWeight: 600,
                lineHeight: "17px",
              }}
            >
              {user.username}
            </span>
            <span
              style={{
                color: "#8b8fa3",
                fontFamily: "Inter, sans-serif",
                fontSize: 12,
                fontWeight: 400,
                lineHeight: "15px",
              }}
            >
              {user.email}
            </span>
          </div>
        </div>

        <Divider />

        {/* ── Seller management section ──────────────────── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 0,
            paddingTop: 12,
            paddingBottom: 8,
          }}
        >
          <div style={{ paddingBottom: 8 }}>
            <SectionLabel text="Quản lý bán hàng" />
          </div>

          <MenuItem label="Tổng quan" onClick={onOverview} />
          <MenuItem label="Sản phẩm của tôi" onClick={onMyProducts} />
          <MenuItem label="Đấu giá" onClick={onAuction} />
          <MenuItem label="Lịch sử bán" onClick={onSalesHistory} />
          <MenuItem label="Doanh thu" onClick={onRevenue} />
        </div>

        <Divider />

        {/* ── Account section ────────────────────────────── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 0,
            paddingTop: 12,
            paddingBottom: 8,
          }}
        >
          <div style={{ paddingBottom: 8 }}>
            <SectionLabel text="Tài khoản" />
          </div>

          <MenuItem label="Tài khoản của tôi" onClick={onMyAccount} />
          <MenuItem label="Đơn mua" onClick={onMyOrders} />
          <MenuItem label="Đăng xuất" onClick={onLogout} />
        </div>

        <Divider />

        {/* Bottom spacer matches Figma bottom padding */}
        <div style={{ height: 16 }} />
      </div>
    </>
  );
}
