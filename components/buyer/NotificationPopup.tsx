import React from "react";

// ─── Types ──────────────────────────────────────────────────────────────────

export type NotifType = "outbid" | "win" | "ending" | "info";

export interface NotificationItem {
  id: string;
  type: NotifType;
  title: string;
  body: string;
  action?: string;
  time: string;
  isUnread?: boolean;
  onAction?: () => void;
}

export interface NotificationPopupProps {
  items?: NotificationItem[];
  unreadCount?: number;
  onMarkAllRead?: () => void;
  onViewAll?: () => void;
  onClose?: () => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<
  NotifType,
  { iconColor: string; iconBg: string; iconChar: string; titleColor: string }
> = {
  outbid: {
    iconColor: "#ef4444",
    iconBg: "rgba(239,68,68,0.18)",
    iconChar: "!",
    titleColor: "#ef4444",
  },
  win: {
    iconColor: "#22c55e",
    iconBg: "rgba(34,197,94,0.18)",
    iconChar: "✓",
    titleColor: "#22c55e",
  },
  ending: {
    iconColor: "#3b82f6",
    iconBg: "rgba(59,130,246,0.14)",
    iconChar: "i",
    titleColor: "#c5c7d4",
  },
  info: {
    iconColor: "#f97316",
    iconBg: "rgba(249,115,22,0.18)",
    iconChar: "·",
    titleColor: "#f0f2f5",
  },
};

const ITEM_BG: Record<NotifType, string> = {
  outbid: "#1f2235",
  win: "#1c2030",
  ending: "#1a1d27",
  info: "#1a1d27",
};

// ─── Default demo data ────────────────────────────────────────────────────────

const DEFAULT_ITEMS: NotificationItem[] = [
  {
    id: "1",
    type: "outbid",
    title: "Bạn đã bị Outbid!",
    body: "Giá mới: 28.500.000₫  -  PlayStation 5 Pro",
    action: "Đặt lại ngay",
    time: "2 phút trước",
    isUnread: true,
  },
  {
    id: "2",
    type: "win",
    title: "Đấu giá thành công!",
    body: "Nintendo Switch OLED  -  Giá cuối: 9.800.000₫",
    time: "1 giờ",
    isUnread: true,
  },
  {
    id: "3",
    type: "ending",
    title: "Sắp kết thúc đấu giá",
    body: "Sony WH-1000XM5  -  còn 30 phút  -  3.200.000₫",
    time: "30 phút trước",
  },
];

// ─── NotificationPopup ────────────────────────────────────────────────────────

export default function NotificationPopup({
  items = DEFAULT_ITEMS,
  unreadCount = 2,
  onMarkAllRead,
  onViewAll,
  onClose,
}: NotificationPopupProps) {
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
          width: 360,
          backgroundColor: "#1a1d27",
          border: "1px solid #252836",
          borderRadius: 12,
          overflow: "hidden",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        }}
      >
        {/* ── Header ─────────────────────────────────────── */}
        <div
          style={{
            height: 60,
            backgroundColor: "#12141e",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 20px",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                color: "#f0f2f5",
                fontFamily: "Inter, sans-serif",
                fontSize: 16,
                fontWeight: 700,
              }}
            >
              Thông báo
            </span>
            {unreadCount > 0 && (
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 9,
                  backgroundColor: "#f97316",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    color: "#fff",
                    fontSize: 10,
                    fontWeight: 700,
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {unreadCount}
                </span>
              </div>
            )}
          </div>
          <button
            onClick={onMarkAllRead}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#f97316",
              fontFamily: "Inter, sans-serif",
              fontSize: 12,
              padding: 0,
            }}
          >
            Đánh dấu đã đọc
          </button>
        </div>

        {/* Header divider */}
        <div style={{ height: 1, backgroundColor: "#252836", flexShrink: 0 }} />

        {/* ── Notification items ──────────────────────────── */}
        {items.map((item, idx) => {
          const cfg = TYPE_CONFIG[item.type];
          return (
            <React.Fragment key={item.id}>
              <div
                style={{
                  position: "relative",
                  height: 82,
                  backgroundColor: ITEM_BG[item.type],
                  display: "flex",
                  alignItems: "flex-start",
                  padding: "0 20px",
                  flexShrink: 0,
                }}
              >
                {/* Unread dot */}
                {item.isUnread && (
                  <div
                    style={{
                      position: "absolute",
                      top: 8,
                      right: 12,
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: "#f97316",
                    }}
                  />
                )}

                {/* Icon */}
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 21,
                    backgroundColor: cfg.iconBg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: 18,
                  }}
                >
                  <span
                    style={{
                      color: cfg.iconColor,
                      fontSize: cfg.iconChar === "✓" ? 16 : 22,
                      fontWeight: 700,
                      fontFamily: "Inter, sans-serif",
                      lineHeight: 1,
                    }}
                  >
                    {cfg.iconChar}
                  </span>
                </div>

                {/* Content */}
                <div
                  style={{
                    marginLeft: 12,
                    paddingTop: 8,
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  <div
                    style={{
                      color: cfg.titleColor,
                      fontFamily: "Inter, sans-serif",
                      fontSize: 13,
                      fontWeight: 700,
                      marginBottom: 6,
                    }}
                  >
                    {item.title}
                  </div>
                  <div
                    style={{
                      color: "#8b8fa3",
                      fontFamily: "Inter, sans-serif",
                      fontSize: 11,
                      marginBottom: 6,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.body}
                  </div>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    {item.action ? (
                      <button
                        onClick={item.onAction}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#f97316",
                          fontFamily: "Inter, sans-serif",
                          fontSize: 11,
                          fontWeight: 700,
                          padding: 0,
                        }}
                      >
                        {item.action}
                      </button>
                    ) : (
                      <span />
                    )}
                    <span
                      style={{
                        color: "#555870",
                        fontFamily: "Inter, sans-serif",
                        fontSize: 11,
                      }}
                    >
                      {item.time}
                    </span>
                  </div>
                </div>
              </div>
              {idx < items.length - 1 && (
                <div
                  style={{
                    height: 1,
                    backgroundColor: "#252836",
                    flexShrink: 0,
                  }}
                />
              )}
            </React.Fragment>
          );
        })}

        {/* ── Footer divider ──────────────────────────────── */}
        <div style={{ height: 1, backgroundColor: "#252836", flexShrink: 0 }} />

        {/* ── Footer ─────────────────────────────────────── */}
        <button
          onClick={onViewAll}
          style={{
            height: 50,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#f97316",
            fontFamily: "Inter, sans-serif",
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: "0.01em",
          }}
        >
          Xem tất cả thông báo →
        </button>

        {/* Bottom accent */}
        <div
          style={{
            height: 1,
            backgroundColor: "rgba(249,115,22,0.4)",
            flexShrink: 0,
          }}
        />
      </div>
    </>
  );
}
