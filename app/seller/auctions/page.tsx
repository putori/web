"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SellerNavbar from "../../../components/seller/SellerNavbar";
import StatList, { StatItem } from "../../../components/seller/StatList";
import GenericTable, { Column } from "../../../components/seller/GenericTable";
import BoosterPaymentPopup, { BoostProduct } from "../../../components/seller/BoosterPaymentPopup";

interface LiveAuctionItem {
  id: string;
  name: string;
  imageUrl?: string;
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
  
  const [products, setProducts] = useState<LiveAuctionItem[]>([]);
  const [stats, setStats] = useState<StatItem[]>([
    { title: "Tổng phiên đấu giá", value: 0, color: "white" },
    { title: "Đang diễn ra", value: 0, color: "white" },
    { title: "Tổng lượt đấu", value: 0, color: "white" },
    { title: "Đã kết thúc", value: 0, color: "white" },
  ]);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const authHeader = 'Basic ' + btoa('user:315686f2-4834-40c8-905f-5380ac9f5991');
        
        const response = await fetch("http://localhost:8080/auctions", {
          method: "GET",
          headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) throw new Error("Lỗi khi tải dữ liệu đấu giá");
        
        const json = await response.json();
        if (!json.data) return;

        let totalBids = 0;
        let ongoingCount = 0;
        let endedCount = 0;

        const mappedData: LiveAuctionItem[] = json.data.map((auc: any) => {
          let timeLeftStr = "00:00:00";
          let displayStatus = "";
          let statusClass = "";

          const end = new Date(auc.endTime).getTime();
          const now = new Date().getTime();
          const diff = end - now;

          if (auc.status === "ENDED") {
            timeLeftStr = "Đã kết thúc";
            displayStatus = "Đã kết thúc";
            statusClass = "bg-gray-500/20 text-gray-400 border border-gray-500/30";
            endedCount++;
          } else if (diff > 0) {
            const d = Math.floor(diff / (1000 * 60 * 60 * 24));
            const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const m = Math.floor((diff / 1000 / 60) % 60);
            timeLeftStr = d > 0 ? `${d} ngày ${h}h` : `${h}h ${m}m`;
            displayStatus = "Đang đấu giá";
            statusClass = "bg-green-500/20 text-green-400 border border-green-500/30";
            ongoingCount++;
          } else {
            timeLeftStr = "Đã quá hạn";
            displayStatus = "Chờ xử lý"; 
            statusClass = "bg-amber-500/20 text-amber-500 border border-amber-500/30";
            endedCount++;
          }

          const bidCount = auc.highestBidderId ? 1 : 0;
          totalBids += bidCount;

          return {
            id: auc.id.toString(),
            name: auc.product?.title || "Sản phẩm không tên",
            imageUrl: auc.product?.images?.[0]?.imageUrl || "", 
            startPrice: auc.startingPrice.toLocaleString("vi-VN") + "đ",
            highestPrice: auc.currentPrice.toLocaleString("vi-VN") + "đ",
            bids: bidCount,
            timeLeft: timeLeftStr,
            status: displayStatus,
            statusClass: statusClass,
          };
        });

        mappedData.sort((a, b) => (a.status === "Đang đấu giá" ? -1 : 1));

        setProducts(mappedData);

        setStats([
          { title: "Tổng phiên đấu giá", value: mappedData.length, color: "white" },
          { title: "Đang diễn ra", value: ongoingCount, color: "white", subText: "Đang mở" },
          { title: "Tổng lượt đấu", value: totalBids, color: "white" },
          { title: "Đã kết thúc", value: endedCount, color: "white" },
        ]);

      } catch (error) {
        console.error("Fetch Auctions Error:", error);
      }
    };

    fetchAuctions();
  }, []);

  const columns: Column<LiveAuctionItem>[] = [
    {
      key: "name",
      label: "Sản phẩm",
      render: (value, row) => (
        <div className="flex items-center gap-3">
          {row.imageUrl ? (
            <img src={row.imageUrl} alt="thumbnail" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-slate-800 flex-shrink-0" />
          )}
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
          disabled={row.status !== "Đang đấu giá"}
          onClick={() =>
            setSelectedBoostProduct({
              name: row.name,
              highestPrice: row.highestPrice,
              bids: row.bids,
              timeLeft: row.timeLeft,
              isLive: true,
            })
          }
          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-opacity ${
            row.status === "Đang đấu giá" 
              ? "bg-[#f97316] text-white hover:opacity-90" 
              : "bg-gray-700 text-gray-500 cursor-not-allowed"
          }`}
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
        <StatList items={stats} />
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