import React, { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type AuthTab = "login" | "register";

export interface AuthPageProps {
  onLogin?: (data: { email: string; password: string }) => void;
  onRegister?: (data: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => void;
  onForgotPassword?: () => void;
  initialTab?: AuthTab;
  loginError?: string;
  registerError?: string;
  loading?: boolean;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const COLOR = {
  bg: "#0a0b0f",
  panel: "#0f1117",
  card: "#141720",
  field: "#1e2236",
  border: "#2a3050",
  divider: "#1e2236",
  orange: "#f97316",
  white: "#ffffff",
  textPrimary: "#f0f2f5",
  textSecondary: "#e0e3ea",
  textMuted: "#8b8fa3",
};

const INPUT_STYLE: React.CSSProperties = {
  width: "100%",
  height: 46,
  backgroundColor: COLOR.field,
  border: "1px solid transparent",
  borderRadius: 8,
  padding: "0 16px",
  color: COLOR.textPrimary,
  fontFamily: "Inter, sans-serif",
  fontSize: 13,
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

interface FieldProps {
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  rightSlot?: React.ReactNode;
}

function Field({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  rightSlot,
}: FieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <label
        style={{
          color: COLOR.textSecondary,
          fontFamily: "Inter, sans-serif",
          fontSize: 12,
          fontWeight: 600,
        }}
      >
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            ...INPUT_STYLE,
            borderColor: focused ? COLOR.orange : "transparent",
            paddingRight: rightSlot ? 72 : 16,
          }}
        />
        {rightSlot && (
          <div
            style={{
              position: "absolute",
              right: 16,
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            {rightSlot}
          </div>
        )}
      </div>
    </div>
  );
}

function OrangeButton({
  children,
  onClick,
  type = "button",
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "100%",
        height: 46,
        backgroundColor: hovered ? "#e8670f" : COLOR.orange,
        border: "none",
        borderRadius: 10,
        color: COLOR.white,
        fontFamily: "Inter, sans-serif",
        fontSize: 15,
        fontWeight: 700,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
        transition: "background-color 0.15s",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Shine overlay */}
      <span
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "50%",
          background: "rgba(255,255,255,0.06)",
          pointerEvents: "none",
        }}
      />
      {children}
    </button>
  );
}

// ─── Login Form ───────────────────────────────────────────────────────────────

function LoginForm({
  onLogin,
  onForgotPassword,
  onSwitchToRegister,
  error,
  loading,
}: {
  onLogin?: AuthPageProps["onLogin"];
  onForgotPassword?: () => void;
  onSwitchToRegister: () => void;
  error?: string;
  loading?: boolean;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin?.({ email, password });
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: 0 }}
    >
      <h2
        style={{
          margin: "0 0 4px",
          color: COLOR.white,
          fontFamily: "Inter, sans-serif",
          fontSize: 22,
          fontWeight: 700,
        }}
      >
        Chào mừng trở lại!
      </h2>
      <p
        style={{
          margin: "0 0 20px",
          color: COLOR.textMuted,
          fontFamily: "Inter, sans-serif",
          fontSize: 13,
          lineHeight: "20px",
        }}
      >
        Đăng nhập để tiếp tục mua sắm và đấu giá.
      </p>

      {error && (
        <div
          style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid #ef4444",
            borderRadius: 8,
            padding: "10px 14px",
            color: "#ef4444",
            fontSize: 13,
            fontFamily: "Inter, sans-serif",
            marginBottom: 14,
          }}
        >
          {error}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Field
          label="Email"
          type="email"
          placeholder="Nhập email của bạn..."
          value={email}
          onChange={setEmail}
        />

        <Field
          label="Mật khẩu"
          type={showPassword ? "text" : "password"}
          placeholder="Nhập mật khẩu..."
          value={password}
          onChange={setPassword}
          rightSlot={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: COLOR.orange,
                fontFamily: "Inter, sans-serif",
                fontSize: 13,
                padding: 0,
              }}
            >
              {showPassword ? "Ẩn" : "Hiện"}
            </button>
          }
        />
      </div>

      <button
        type="button"
        onClick={onForgotPassword}
        style={{
          alignSelf: "flex-start",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: COLOR.orange,
          fontFamily: "Inter, sans-serif",
          fontSize: 13,
          padding: "8px 0 14px",
        }}
      >
        Quên mật khẩu?
      </button>

      <OrangeButton type="submit" disabled={loading}>
        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
      </OrangeButton>

      <p
        style={{
          margin: "16px 0 0",
          textAlign: "center",
          fontFamily: "Inter, sans-serif",
          fontSize: 13,
          color: COLOR.textMuted,
        }}
      >
        Chưa có tài khoản?{" "}
        <button
          type="button"
          onClick={onSwitchToRegister}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: COLOR.orange,
            fontFamily: "Inter, sans-serif",
            fontSize: 13,
            fontWeight: 600,
            padding: 0,
          }}
        >
          Đăng ký ngay
        </button>
      </p>
    </form>
  );
}

// ─── Register Form ────────────────────────────────────────────────────────────

function RegisterForm({
  onRegister,
  onSwitchToLogin,
  error,
  loading,
}: {
  onRegister?: AuthPageProps["onRegister"];
  onSwitchToLogin: () => void;
  error?: string;
  loading?: boolean;
}) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const passwordMatch = confirmPassword === "" || password === confirmPassword;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordMatch) return;
    onRegister?.({ fullName, email, password, confirmPassword });
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: 0 }}
    >
      <h2
        style={{
          margin: "0 0 4px",
          color: COLOR.white,
          fontFamily: "Inter, sans-serif",
          fontSize: 22,
          fontWeight: 700,
        }}
      >
        Tạo tài khoản mới
      </h2>
      <p
        style={{
          margin: "0 0 16px",
          color: COLOR.textMuted,
          fontFamily: "Inter, sans-serif",
          fontSize: 13,
          lineHeight: "20px",
        }}
      >
        Đăng ký để bắt đầu mua sắm và đấu giá ngay hôm nay.
      </p>

      {error && (
        <div
          style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid #ef4444",
            borderRadius: 8,
            padding: "10px 14px",
            color: "#ef4444",
            fontSize: 13,
            fontFamily: "Inter, sans-serif",
            marginBottom: 14,
          }}
        >
          {error}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <Field
          label="Họ và tên"
          placeholder="Nguyễn Văn A"
          value={fullName}
          onChange={setFullName}
        />

        <Field
          label="Email"
          type="email"
          placeholder="Nhập email của bạn..."
          value={email}
          onChange={setEmail}
        />

        <Field
          label="Mật khẩu"
          type={showPassword ? "text" : "password"}
          placeholder="Tối thiểu 8 ký tự..."
          value={password}
          onChange={setPassword}
          rightSlot={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: COLOR.orange,
                fontFamily: "Inter, sans-serif",
                fontSize: 13,
                padding: 0,
              }}
            >
              {showPassword ? "Ẩn" : "Hiện"}
            </button>
          }
        />

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <label
            style={{
              color: COLOR.textSecondary,
              fontFamily: "Inter, sans-serif",
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            Xác nhận mật khẩu
          </label>
          <input
            type="password"
            placeholder="Nhập lại mật khẩu..."
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{
              ...INPUT_STYLE,
              borderColor: !passwordMatch ? "#ef4444" : "transparent",
            }}
          />
          {!passwordMatch && (
            <span
              style={{
                color: "#ef4444",
                fontFamily: "Inter, sans-serif",
                fontSize: 11,
              }}
            >
              Mật khẩu không khớp
            </span>
          )}
        </div>
      </div>

      {/* Terms checkbox */}
      <label
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 10,
          margin: "10px 0 14px",
          cursor: "pointer",
        }}
      >
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          style={{ marginTop: 2, accentColor: COLOR.orange }}
        />
        <span
          style={{
            color: COLOR.textMuted,
            fontFamily: "Inter, sans-serif",
            fontSize: 12,
            lineHeight: "18px",
          }}
        >
          Tôi đồng ý với{" "}
          <span style={{ color: COLOR.orange, cursor: "pointer" }}>
            Điều khoản dịch vụ
          </span>{" "}
          và{" "}
          <span style={{ color: COLOR.orange, cursor: "pointer" }}>
            Chính sách bảo mật
          </span>
        </span>
      </label>

      <OrangeButton
        type="submit"
        disabled={!agreed || !passwordMatch || loading}
      >
        {loading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
      </OrangeButton>

      <p
        style={{
          margin: "14px 0 0",
          textAlign: "center",
          fontFamily: "Inter, sans-serif",
          fontSize: 13,
          color: COLOR.textMuted,
        }}
      >
        Đã có tài khoản?{" "}
        <button
          type="button"
          onClick={onSwitchToLogin}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: COLOR.orange,
            fontFamily: "Inter, sans-serif",
            fontSize: 13,
            fontWeight: 600,
            padding: 0,
          }}
        >
          Đăng nhập
        </button>
      </p>
    </form>
  );
}

// ─── AuthPage ─────────────────────────────────────────────────────────────────

export default function AuthPage({
  onLogin,
  onRegister,
  onForgotPassword,
  initialTab = "login",
  loginError,
  registerError,
  loading,
}: AuthPageProps) {
  const [tab, setTab] = useState<AuthTab>(initialTab);

  const STATS = [
    { value: "50,000+", label: "Người bán" },
    { value: "120,000+", label: "Sản phẩm" },
    { value: "98%", label: "Đánh giá hài lòng" },
  ];

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        minHeight: "100vh",
        fontFamily: "Inter, sans-serif",
        backgroundColor: COLOR.bg,
      }}
    >
      {/* ── Left panel ────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          backgroundColor: COLOR.panel,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          position: "relative",
          minHeight: "100vh",
        }}
      >
        {/* Orange left accent */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 4,
            height: "100%",
            backgroundColor: COLOR.orange,
          }}
        />

        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 64,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              backgroundColor: COLOR.orange,
              borderRadius: 9,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" />
            </svg>
          </div>
          <span
            style={{
              color: COLOR.textPrimary,
              fontSize: 18,
              fontWeight: 700,
            }}
          >
            TechBid
          </span>
        </div>

        {/* Headline */}
        <div style={{ marginBottom: 24 }}>
          <h1
            style={{
              margin: 0,
              color: COLOR.white,
              fontSize: 40,
              fontWeight: 700,
              lineHeight: "1.2",
            }}
          >
            Sàn thương mại đấu giá
          </h1>
          <h1
            style={{
              margin: 0,
              color: COLOR.orange,
              fontSize: 40,
              fontWeight: 700,
              lineHeight: "1.2",
            }}
          >
            đồ điện tử hàng đầu Việt Nam
          </h1>
        </div>

        {/* Description */}
        <p
          style={{
            margin: "0 0 48px",
            color: COLOR.textMuted,
            fontSize: 15,
            lineHeight: "24px",
            maxWidth: 600,
          }}
        >
          Mua, bán và đấu giá các phụ kiện điện tử với giá tốt nhất.
          <br />
          An toàn · Nhanh chóng · Tin cậy.
        </p>

        {/* Stats */}
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {STATS.map((s) => (
            <div
              key={s.label}
              style={{
                flex: 1,
                minWidth: 140,
                backgroundColor: "#141720",
                borderRadius: 12,
                padding: "20px 20px 16px",
              }}
            >
              <div
                style={{
                  color: COLOR.orange,
                  fontSize: 20,
                  fontWeight: 700,
                  marginBottom: 4,
                }}
              >
                {s.value}
              </div>
              <div style={{ color: COLOR.textMuted, fontSize: 12 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom accent line */}
        <div
          style={{
            marginTop: 48,
            height: 2,
            backgroundColor: COLOR.divider,
            maxWidth: 720,
          }}
        />
      </div>

      {/* ── Right panel ───────────────────────────────── */}
      <div
        style={{
          flex: 1,
          backgroundColor: COLOR.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px",
          minHeight: "100vh",
        }}
      >
        {/* Card */}
        <div
          style={{
            width: "100%",
            maxWidth: 560,
            backgroundColor: COLOR.card,
            border: `1px solid ${COLOR.divider}`,
            borderRadius: 16,
            overflow: "hidden",
          }}
        >
          {/* Tab header */}
          <div
            style={{
              display: "flex",
              backgroundColor: COLOR.panel,
              borderRadius: "16px 16px 0 0",
              overflow: "hidden",
            }}
          >
            {(["login", "register"] as AuthTab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  flex: 1,
                  height: 56,
                  background: tab === t ? COLOR.card : "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: tab === t ? COLOR.white : COLOR.textMuted,
                  fontFamily: "Inter, sans-serif",
                  fontSize: 15,
                  fontWeight: tab === t ? 600 : 400,
                  position: "relative",
                  transition: "color 0.2s",
                  borderRadius: tab === t ? "16px 16px 0 0" : 0,
                }}
              >
                {t === "login" ? "Đăng nhập" : "Đăng ký"}
                {/* Active indicator */}
                {tab === t && (
                  <span
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: 3,
                      backgroundColor: COLOR.orange,
                      borderRadius: "2px 2px 0 0",
                    }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Form body */}
          <div
            style={{
              padding: "24px 36px 28px",
            }}
          >
            {tab === "login" ? (
              <LoginForm
                onLogin={onLogin}
                onForgotPassword={onForgotPassword}
                onSwitchToRegister={() => setTab("register")}
                error={loginError}
                loading={loading}
              />
            ) : (
              <RegisterForm
                onRegister={onRegister}
                onSwitchToLogin={() => setTab("login")}
                error={registerError}
                loading={loading}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
