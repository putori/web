"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import SellerNavbar from "../../../components/seller/SellerNavbar";
import StatList, { StatItem } from "../../../components/seller/StatList";
import GenericTable, { Column } from "../../../components/seller/GenericTable";

type Product = {
  name: string;
  category: string;
  type: "Đấu giá" | "Mua ngay";
  price: string;
  buyer: string;
  soldDate: string;
  status: string;
  statusClass: string;
};

export default function SalesHistoryPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<"all" | "auction" | "buyNow" | "month">("all");

  const statItems: StatItem[] = [
    {
      title: "Tổng đã bán",
      value: 156,
      subText: "+12 tháng này",
      color: "green",
    },
    {
      title: "Doanh thu",
      value: "248.500.000₫",
      color: "orange",
    },
    {
      title: "Giá trung bình",
      value: "1.593.000₫",
      color: "blue",
    },
    {
      title: "Tỷ lệ thành công",
      value: "94.2%",
      color: "white",
    },
  ];

  const products: Product[] = [
    {
      name: "Razer DeathAdder V3 HyperSpeed",
      category: "Chuột gaming",
      type: "Đấu giá",
      price: "1.250.000đ",
      buyer: "gamer_khoa_123",
      soldDate: "10/04/2026",
      status: "Đấu trúng",
      statusClass: "bg-green-500/10 text-green-500",
    },
    {
      name: "Logitech G Pro X TKL",
      category: "Bàn phím cơ",
      type: "Đấu giá",
      price: "3.800.000đ",
      buyer: "pro_player_huy",
      soldDate: "08/04/2026",
      status: "Đấu trúng",
      statusClass: "bg-green-500/10 text-green-500",
    },
    {
      name: "SteelSeries Arctis Nova 7",
      category: "Tai nghe",
      type: "Mua ngay",
      price: "2.100.000đ",
      buyer: "technoob_9x",
      soldDate: "06/04/2026",
      status: "Đã bán",
      statusClass: "bg-amber-500/10 text-amber-500",
    },
    {
      name: "HyperX Pulsefire Haste 2",
      category: "Chuột gaming",
      type: "Đấu giá",
      price: "980.000đ",
      buyer: "lele_gaming_vn",
      soldDate: "04/04/2026",
      status: "Đấu trúng",
      statusClass: "bg-green-500/10 text-green-500",
    },
    {
      name: "Glorious Model O Wireless",
      category: "Chuột gaming",
      type: "Mua ngay",
      price: "1.450.000đ",
      buyer: "vnprogamer_2005",
      soldDate: "02/04/2026",
      status: "Đã bán",
      statusClass: "bg-amber-500/10 text-amber-500",
    },
    {
      name: "Corsair HS70 Pro Wireless",
      category: "Tai nghe",
      type: "Đấu giá",
      price: "1.100.000đ",
      buyer: "hanoi_gamer99",
      soldDate: "30/03/2026",
      status: "Đấu trúng",
      statusClass: "bg-green-500/10 text-green-500",
    },
    {
      name: "ASUS ROG Strix Scope NX",
      category: "Bàn phím cơ",
      type: "Đấu giá",
      price: "2.250.000đ",
      buyer: "saigon_esports",
      soldDate: "28/03/2026",
      status: "Đấu trúng",
      statusClass: "bg-green-500/10 text-green-500",
    },
    {
      name: "Razer Basilisk V3 Pro",
      category: "Chuột gaming",
      type: "Mua ngay",
      price: "1.800.000đ",
      buyer: "streamer_kid_95",
      soldDate: "26/03/2026",
      status: "Đã bán",
      statusClass: "bg-amber-500/10 text-amber-500",
    },
  ];

  const columns: Column<Product>[] = [
    {
      key: "name",
      label: "Sản phẩm",
      render: (value) => (
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-slate-800/80 flex-shrink-0" />
          <span className="font-medium text-white">{String(value)}</span>
        </div>
      ),
    },
    {
      key: "category",
      label: "Danh mục",
      render: (value) => <span className="text-slate-400">{String(value)}</span>,
    },
    {
      key: "type",
      label: "Kiểu bán",
      render: (value) => (
        <span
          className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
            value === "Đấu giá"
              ? "bg-amber-500/10 text-amber-500"
              : "bg-purple-500/10 text-purple-400"
          }`}
        >
          {String(value)}
        </span>
      ),
    },
    {
      key: "price",
      label: "Giá bán",
      render: (value) => <span className="font-bold text-white text-[15px]">{String(value)}</span>,
    },
    {
      key: "buyer",
      label: "Người mua",
      render: (value) => <span className="text-slate-400">{String(value)}</span>,
    },
    {
      key: "soldDate",
      label: "Ngày bán",
      render: (value) => <span className="text-slate-400">{String(value)}</span>,
    },
    {
      key: "status",
      label: "Trạng thái",
      render: (_, row) => (
        <span className={`px-4 py-1.5 rounded-lg text-xs font-bold ${row.statusClass}`}>
          {row.status}
        </span>
      ),
    },
  ];

  const filteredProducts = useMemo(() => {
    switch (activeFilter) {
      case "auction":
        return products.filter((product) => product.type === "Đấu giá");
      case "buyNow":
        return products.filter((product) => product.type === "Mua ngay");
      case "month":
        return products.filter((product) => {
          const [day, month, year] = product.soldDate.split("/");
          const productDate = new Date(Number(year), Number(month) - 1, Number(day));
          const now = new Date();
          return (
            productDate.getMonth() === now.getMonth() &&
            productDate.getFullYear() === now.getFullYear()
          );
        });
      default:
        return products;
    }
  }, [activeFilter]);

  return (
    <div className="min-h-screen bg-[#0b0c10] text-[#e0e3ea] flex flex-col">
      <SellerNavbar
        pageTitle="Lịch sử bán hàng"
        pageSubtitle="Tất cả các phiên đấu giá đã kết thúc và giao dịch thành công"
        actionLabel="Thêm sản phẩm"
        onBack={() => router.push("/seller")}
        onAction={() => router.push("/seller/add-product")}
        userName="K"
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-8 space-y-8">
        <StatList items={statItems} />
        
        <div className="bg-[#14161d] p-6 rounded-xl border border-white/5 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Lịch sử bán hàng</h2>

            <div className="flex gap-3">
              <button
                onClick={() => setActiveFilter("all")}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition ${
                  activeFilter === "all"
                    ? "bg-[#f97316] text-white"
                    : "bg-[#1a1d27] text-gray-400 hover:text-white"
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setActiveFilter("auction")}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition ${
                  activeFilter === "auction"
                    ? "bg-[#f97316] text-white"
                    : "bg-[#1a1d27] text-gray-400 hover:text-white"
                }`}
              >
                Đấu giá
              </button>
              <button
                onClick={() => setActiveFilter("buyNow")}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition ${
                  activeFilter === "buyNow"
                    ? "bg-[#f97316] text-white"
                    : "bg-[#1a1d27] text-gray-400 hover:text-white"
                }`}
              >
                Mua ngay
              </button>
              <button
                onClick={() => setActiveFilter("month")}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition ${
                  activeFilter === "month"
                    ? "bg-[#f97316] text-white"
                    : "bg-[#1a1d27] text-gray-400 hover:text-white"
                }`}
              >
                Tháng này
              </button>
            </div>
          </div>
          <GenericTable data={filteredProducts} columns={columns} />
        </div>
      </main>
    </div>
  );
}