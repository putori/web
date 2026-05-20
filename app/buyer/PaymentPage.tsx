"use client";

import React, { useState } from "react";
import BuyerNavbar from "@/components/buyer/BuyerNavbar";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  isDefault?: boolean;
}

export interface PaymentPageProps {
  productName?: string;
  productPrice?: number;
  shippingFee?: number;
  discount?: number;
  buyerName?: string;
  buyerPhone?: string;
  buyerEmail?: string;
  addresses?: Address[];
  onConfirm?: (data: { address: string }) => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const C = {
  bg: "#0a0b0f",
  panel: "#0f1117",
  card: "#141720",
  field: "#1e2236",
  border: "#272c42",
  orange: "#f97316",
  white: "#ffffff",
  p: "#f0f2f5",
  s: "#e0e3ea",
  m: "#8b8fa3",
  d: "#555872",
  green: "#22c55e",
};

const DEFAULT_ADDRESSES: Address[] = [
  {
    id: "home",
    label: "Nhà riêng",
    street: "123 Nguyễn Trãi, P.2, Q.5",
    city: "TP. Hồ Chí Minh",
    isDefault: true,
  },
  {
    id: "work",
    label: "Công ty",
    street: "456 Lê Văn Sỹ, P.14, Q.3",
    city: "TP. Hồ Chí Minh",
  },
];

const fmt = (n: number) => n.toLocaleString("vi-VN") + "đ";

// ─── Shipping options ─────────────────────────────────────────────────────────

const SHIP_OPTS = [
  {
    id: "std",
    label: "Giao hàng tiêu chuẩn",
    sub: "2–3 ngày làm việc",
    price: 30000,
  },
  {
    id: "fast",
    label: "Giao hàng nhanh",
    sub: "1 ngày làm việc",
    price: 60000,
  },
  {
    id: "same",
    label: "Giao hàng trong ngày",
    sub: "Trước 22:00 hôm nay",
    price: 90000,
  },
];

// ─── PaymentPage ──────────────────────────────────────────────────────────────

export default function PaymentPage({
  productName = "Razer DeathAdder V3 HyperSpeed",
  productPrice = 1250000,
  shippingFee: initShipping = 35000,
  discount = 35000,
  buyerName = "Nguyễn Văn Khoa",
  buyerPhone = "0901 234 567",
  buyerEmail = "khoa.nguyen@gmail.com",
  addresses = DEFAULT_ADDRESSES,
  onConfirm,
}: PaymentPageProps) {
  const [selectedAddress, setSelectedAddress] = useState(
    addresses[0]?.id ?? "",
  );
  const [selectedShip, setSelectedShip] = useState("std");
  const [name, setName] = useState(buyerName);
  const [phone, setPhone] = useState(buyerPhone);
  const [email, setEmail] = useState(buyerEmail);
  const [confirmHov, setConfirmHov] = useState(false);

  const currentShipFee =
    SHIP_OPTS.find((o) => o.id === selectedShip)?.price ?? initShipping;
  const auctionFee = Math.round(productPrice * 0.02);
  const total = productPrice + auctionFee + currentShipFee - discount;

  const Field = ({
    label,
    value,
    onChange,
    half = false,
  }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    half?: boolean;
  }) => (
    <div style={{ flex: half ? "0 0 calc(50% - 8px)" : 1 }}>
      <p style={{ color: C.m, fontSize: 12, marginBottom: 6 }}>{label}</p>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          height: 40,
          background: C.bg,
          border: `1px solid ${C.border}`,
          borderRadius: 10,
          padding: "0 14px",
          color: C.p,
          fontSize: 14,
          fontFamily: "Inter, sans-serif",
          outline: "none",
          boxSizing: "border-box",
        }}
      />
    </div>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        fontFamily: "Inter, sans-serif",
      }}
    >
      <BuyerNavbar />
      <div
        style={{
          display: "flex",
          gap: 24,
          padding: "32px 48px",
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        {/* ── Left column ─────────────────────────────────────────── */}
        <div
          style={{ flex: 1, display: "flex", flexDirection: "column", gap: 24 }}
        >
          {/* Buyer info */}
          <div
            style={{
              background: C.card,
              borderRadius: 16,
              padding: "20px 24px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 16,
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke={C.orange}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <h3 style={{ color: C.p, fontSize: 16, fontWeight: 700 }}>
                Thông tin người mua
              </h3>
            </div>
            <div style={{ height: 1, background: C.field, marginBottom: 16 }} />
            <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
              <Field label="Họ và tên" value={name} onChange={setName} half />
              <Field
                label="Số điện thoại"
                value={phone}
                onChange={setPhone}
                half
              />
            </div>
            <Field
              label="Email nhận xác nhận"
              value={email}
              onChange={setEmail}
            />
          </div>

          {/* Shipping address */}
          <div
            style={{
              background: C.card,
              borderRadius: 16,
              padding: "20px 24px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={C.orange}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <h3 style={{ color: C.p, fontSize: 16, fontWeight: 700 }}>
                  Địa chỉ giao hàng
                </h3>
              </div>
              <button
                style={{
                  background: "none",
                  border: "none",
                  color: C.orange,
                  fontSize: 13,
                  cursor: "pointer",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                + Thêm địa chỉ
              </button>
            </div>
            <div style={{ height: 1, background: C.field, marginBottom: 16 }} />
            <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
              {addresses.map((addr) => (
                <button
                  key={addr.id}
                  onClick={() => setSelectedAddress(addr.id)}
                  style={{
                    flex: 1,
                    padding: "12px 14px",
                    background:
                      selectedAddress === addr.id ? "#1a1e2e" : C.panel,
                    borderRadius: 12,
                    border: `${selectedAddress === addr.id ? 2 : 1}px solid ${selectedAddress === addr.id ? C.orange : C.border}`,
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <p
                    style={{
                      color: selectedAddress === addr.id ? C.orange : C.m,
                      fontSize: 12,
                      fontWeight: 700,
                      marginBottom: 4,
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    {addr.label}
                  </p>
                  <p
                    style={{
                      color: C.m,
                      fontSize: 12,
                      fontFamily: "Inter, sans-serif",
                      lineHeight: "16px",
                    }}
                  >
                    {addr.street}
                    <br />
                    {addr.city}
                  </p>
                </button>
              ))}
            </div>

            <p style={{ color: C.m, fontSize: 12, marginBottom: 8 }}>
              Phương thức vận chuyển
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              {SHIP_OPTS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSelectedShip(opt.id)}
                  style={{
                    flex: 1,
                    padding: "10px 12px",
                    background: selectedShip === opt.id ? "#1a1e2e" : C.panel,
                    borderRadius: 8,
                    border: `${selectedShip === opt.id ? 2 : 1}px solid ${
                      selectedShip === opt.id ? C.orange : C.border
                    }`,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <p
                    style={{
                      color: selectedShip === opt.id ? C.orange : C.m,
                      fontSize: 12,
                      fontWeight: 600,
                      fontFamily: "Inter, sans-serif",
                      margin: 0,
                    }}
                  >
                    {opt.label}
                  </p>
                  <p
                    style={{
                      color: C.orange,
                      fontSize: 12,
                      fontWeight: 700,
                      fontFamily: "Inter, sans-serif",
                      margin: 0,
                    }}
                  >
                    {fmt(opt.price)}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* TechBid wallet */}
          <div
            style={{
              background: C.card,
              borderRadius: 16,
              padding: "20px 24px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 16,
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke={C.orange}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
              <h3 style={{ color: C.p, fontSize: 16, fontWeight: 700 }}>
                Thanh toán bằng ví TechBid
              </h3>
            </div>
            <div style={{ height: 1, background: C.field, marginBottom: 16 }} />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                background: C.panel,
                border: `1px solid ${C.field}`,
                borderRadius: 12,
                padding: 16,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: C.field,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={C.orange}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="3" y1="22" x2="21" y2="22" />
                  <line x1="6" y1="18" x2="6" y2="11" />
                  <line x1="10" y1="18" x2="10" y2="11" />
                  <line x1="14" y1="18" x2="14" y2="11" />
                  <line x1="18" y1="18" x2="18" y2="11" />
                  <polygon points="12 2 20 7 4 7" />
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    color: C.m,
                    fontSize: 12,
                    marginBottom: 4,
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  Số dư ví TechBid
                </p>
                <p
                  style={{
                    color: C.p,
                    fontSize: 18,
                    fontWeight: 700,
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  12.500.000đ
                </p>
              </div>
              <button
                style={{
                  height: 34,
                  padding: "0 14px",
                  background: "transparent",
                  border: `1px solid ${C.orange}`,
                  borderRadius: 8,
                  color: C.orange,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "Inter, sans-serif",
                  whiteSpace: "nowrap",
                }}
              >
                + Nạp thêm
              </button>
            </div>
          </div>
        </div>

        {/* ── Right sidebar ────────────────────────────────────────── */}
        <div
          style={{
            width: 380,
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            gap: 12,
            alignSelf: "flex-start",
            position: "sticky",
            top: 24,
          }}
        >
          {/* Order summary card */}
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
                marginBottom: 16,
              }}
            >
              Hóa đơn
            </h3>
            <div style={{ height: 1, background: C.field, marginBottom: 16 }} />

            {/* Product */}
            <div
              style={{
                display: "flex",
                gap: 12,
                marginBottom: 16,
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: 60,
                  height: 60,
                  background: C.panel,
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  border: `1px solid ${C.border}`,
                }}
              >
                <svg
                  width="26"
                  height="26"
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
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    color: C.p,
                    fontSize: 13,
                    fontWeight: 600,
                    lineHeight: "18px",
                    marginBottom: 2,
                  }}
                >
                  {productName}
                </p>
                <p style={{ color: C.m, fontSize: 12 }}>Giá đấu thắng</p>
              </div>
              <p
                style={{
                  color: C.orange,
                  fontSize: 14,
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                }}
              >
                {fmt(productPrice)}
              </p>
            </div>

            <div style={{ height: 1, background: C.field, marginBottom: 16 }} />

            {/* Cost breakdown */}
            {[
              { label: "Giá sản phẩm", value: fmt(productPrice), color: C.p },
              { label: "Phí đấu giá (2%)", value: fmt(auctionFee), color: C.p },
              {
                label: "Phí vận chuyển",
                value: fmt(currentShipFee),
                color: C.p,
              },
              {
                label: "Mã giảm giá (GAME10)",
                value: `-${fmt(discount)}`,
                color: C.green,
              },
            ].map((row) => (
              <div
                key={row.label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 9,
                }}
              >
                <span style={{ color: C.m, fontSize: 13 }}>{row.label}</span>
                <span
                  style={{ color: row.color, fontSize: 13, fontWeight: 500 }}
                >
                  {row.value}
                </span>
              </div>
            ))}

            <div style={{ height: 1, background: C.field, margin: "12px 0" }} />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  color: C.p,
                  fontSize: 14,
                  fontWeight: 700,
                  letterSpacing: "0.3px",
                }}
              >
                TỔNG THANH TOÁN
              </span>
              <span style={{ color: C.orange, fontSize: 22, fontWeight: 700 }}>
                {fmt(total)}
              </span>
            </div>
          </div>

          {/* Coupon row */}
          <div style={{ display: "flex", gap: 10 }}>
            <input
              placeholder="Nhập mã giảm giá..."
              style={{
                flex: 1,
                height: 44,
                background: C.card,
                border: `1px solid ${C.field}`,
                borderRadius: 10,
                padding: "0 14px",
                color: C.p,
                fontSize: 13,
                fontFamily: "Inter, sans-serif",
                outline: "none",
              }}
            />
            <button
              style={{
                height: 44,
                padding: "0 18px",
                background: "transparent",
                border: `1px solid ${C.orange}`,
                borderRadius: 10,
                color: C.orange,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
                whiteSpace: "nowrap",
              }}
            >
              Áp dụng
            </button>
          </div>

          {/* Confirm button */}
          <button
            onMouseEnter={() => setConfirmHov(true)}
            onMouseLeave={() => setConfirmHov(false)}
            onClick={() => onConfirm?.({ address: selectedAddress })}
            style={{
              width: "100%",
              height: 52,
              background: confirmHov ? "#e8670f" : C.orange,
              border: "none",
              borderRadius: 12,
              color: C.white,
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
              transition: "background 0.15s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Xác nhận — Thanh toán {fmt(total)}
          </button>
        </div>
      </div>
    </div>
  );
}
