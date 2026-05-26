"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import SellerNavbar from "../../../components/seller/SellerNavbar";
import StatList, { StatItem } from "../../../components/seller/StatList";
import GenericTable, { Column } from "../../../components/seller/GenericTable";
import BoosterPaymentPopup, { BoostProduct } from "../../../components/seller/BoosterPaymentPopup";

interface LiveAuctionItem {
  id: string;
  name: string;
  startPrice: string;
  highestPrice: string;
  bids: number;
  timeLeft: string;
  status: string;
  statusClass: string;
}

export default function AuctionsPage() {
  const router = useRouter();
  const [selectedBoostProduct, setSelectedBoostProduct] = useState<BoostProduct | null>(null);

  const statItems: StatItem[] = [
    {
      title: "Tổng phiên đấu giá",
      value: 18,
      subText: "+2 tuần này",
      color: "white",
    },
    {
      title: "Đang diễn ra",
      value: 6,
      color: "white",
    },
    {
      title: "Tổng lượt đấu",
      value: 342,
      color: "white",
    },
    {
      title: "Kết thúc hôm nay",
      value: 3,
      color: "white",
    },
  ];

  const products: LiveAuctionItem[] = [
    {
      id: "1",
      name: "PlayStation 5 Digital Edition",
      startPrice: "10.000.000đ",
      highestPrice: "28.500.000₫",
      bids: 28,
      timeLeft: "01:24:36",
      status: "Đang đấu giá",
      statusClass: "bg-green-500/20 text-green-400 border border-green-500/30",
    },
    {
      id: "2",
      name: "Nintendo Switch OLED Limited",
      startPrice: "6.000.000đ",
      highestPrice: "8.200.000đ",
      bids: 12,
      timeLeft: "05:12:00",
      status: "Đang đấu giá",
      statusClass: "bg-green-500/20 text-green-400 border border-green-500/30",
    },
  ];

  const columns: Column<LiveAuctionItem>[] = [
    {
      key: "name",
      label: "Sản phẩm",
      render: (value) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-800 flex-shrink-0" />
          <span className="font-medium text-white">{String(value)}</span>
        </div>
      ),
    },
    {
      key: "startPrice",
      label: "Giá khởi điểm",
      render: (value) => <span className="text-slate-400">{String(value)}</span>,
    },
    {
      key: "highestPrice",
      label: "Giá cao nhất",
      render: (value) => <span className="text-orange-400 font-semibold">{String(value)}</span>,
    },
    {
      key: "bids",
      label: "Lượt đấu",
      render: (value) => <span className="text-slate-300">{String(value)}</span>,
    },
    {
      key: "timeLeft",
      label: "Thời gian còn lại",
      render: (value) => <span className="text-red-400 font-mono font-semibold">{String(value)}</span>,
    },
    {
      key: "status",
      label: "Trạng thái",
      render: (value, row) => (
        <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${row.statusClass}`}>
          {String(value)}
        </span>
      ),
    },
    {
      key: "id",
      label: "Hành động",
      render: (val, row) => (
        <button
          type="button"
          onClick={() =>
            setSelectedBoostProduct({
              name: row.name,
              highestPrice: row.highestPrice,
              bids: row.bids,
              timeLeft: row.timeLeft,
              isLive: true,
            })
          }
          className="bg-[#f97316] text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-opacity hover:opacity-90"
        >
          Boost Now!
        </button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#0b0c10] text-white flex flex-col">
      <SellerNavbar
        pageTitle="Đấu giá đang diễn ra"
        pageSubtitle="Theo dõi và quản lý tất cả phiên đấu giá của bạn"
        actionLabel="Thêm sản phẩm"
        onBack={() => router.push("/seller")}
        onAction={() => router.push("/seller/add-product")}
        userName="K"
      />

      <div className="flex-1 max-w-7xl w-full mx-auto p-8 space-y-6">
        <StatList items={statItems} />
        <GenericTable data={products} columns={columns} />
      </div>

      {selectedBoostProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <BoosterPaymentPopup
            product={selectedBoostProduct}
            onClose={() => setSelectedBoostProduct(null)}
            onConfirm={() => {
              alert("Đăng ký gói Boost thành công!");
              setSelectedBoostProduct(null);
            }}
          />
        </div>
      )}
    </div>
  );
}