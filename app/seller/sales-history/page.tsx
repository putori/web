"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import SellerNavbar from "../../../components/seller/SellerNavbar";
import StatList, { StatItem } from "../../../components/seller/StatList";
import GenericTable, { Column } from "../../../components/seller/GenericTable";

type Product = {
  id: number;
  name: string;
  imageUrl: string;
  category: string;
  type: "Đấu giá" | "Mua ngay";
  price: string;
  buyer: string;
  soldDate: string;
  status: string;
  statusClass: string;
  rawDate: Date;
};

export default function SalesHistoryPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<"all" | "auction" | "buyNow" | "month">("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState<StatItem[]>([
    { title: "Tổng đã bán", value: 0, subText: "+0 tháng này", color: "green" },
    { title: "Doanh thu", value: "0đ", color: "orange" },
    { title: "Giá trung bình", value: "0đ", color: "blue" },
    { title: "Tỷ lệ thành công", value: "100%", color: "white" },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authHeader = 'Basic ' + btoa('user:315686f2-4834-40c8-905f-5380ac9f5991'); 
        
        const requestOptions = {
          method: 'GET',
          headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/json'
          }
        };

        const orderRes = await fetch("http://localhost:8080/orders?size=50", requestOptions);
        const orderJson = await orderRes.json();
        
        if (!orderJson.data || !orderJson.data.items) return;

        const orders = orderJson.data.items;
        let totalRevenue = 0; // Biến tính tổng doanh thu

        const combinedData = await Promise.all(
          orders.map(async (order: any) => {
            let productName = "Đang cập nhật...";
            let categoryName = "Chưa rõ";
            let imageUrl = "";

            totalRevenue += order.amount; // Cộng dồn doanh thu

            if (order.auctionId) {
              try {
                const aucRes = await fetch(`http://localhost:8080/auctions/${order.auctionId}`, requestOptions);
                const aucJson = await aucRes.json();
                
                if (aucJson.data && aucJson.data.product) {
                  const prod = aucJson.data.product;
                  productName = prod.title;
                  categoryName = `Danh mục #${prod.categoryId}`;
                  if (prod.images && prod.images.length > 0) {
                    imageUrl = prod.images[0].imageUrl;
                  }
                }
              } catch (err) {
                console.error(err);
              }
            }

            let statusText = "Chờ xử lý";
            let statusClass = "bg-slate-500/10 text-slate-400";
            if (order.status === "PAID") {
              statusText = "Đã thanh toán";
              statusClass = "bg-green-500/10 text-green-500";
            } else if (order.status === "PENDING") {
              statusText = "Chờ thanh toán";
              statusClass = "bg-amber-500/10 text-amber-500";
            } else if (order.status === "CANCELED") {
              statusText = "Đã hủy";
              statusClass = "bg-red-500/10 text-red-500";
            }

            return {
              id: order.id,
              name: productName,
              imageUrl: imageUrl,
              category: categoryName,
              type: "Đấu giá",
              price: order.amount.toLocaleString("vi-VN") + "đ",
              buyer: `User #${order.buyerId}`,
              soldDate: new Date(order.createdAt).toLocaleDateString("vi-VN"),
              status: statusText,
              statusClass: statusClass,
              rawDate: new Date(order.createdAt),
            };
          })
        );

        setProducts(combinedData);

        const avgPrice = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;

        setStats([
          { title: "Tổng đã bán", value: combinedData.length, subText: "+0 tháng này", color: "green" },
          { title: "Doanh thu", value: totalRevenue.toLocaleString("vi-VN") + "đ", color: "orange" },
          { title: "Giá trung bình", value: avgPrice.toLocaleString("vi-VN") + "đ", color: "blue" },
          { title: "Tỷ lệ thành công", value: "100%", color: "white" },
        ]);

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns: Column<Product>[] = [
    {
      key: "name",
      label: "Sản phẩm",
      render: (_, row) => (
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-slate-800/80 flex-shrink-0 overflow-hidden flex items-center justify-center">
             {row.imageUrl ? <img src={row.imageUrl} alt="img" className="w-full h-full object-cover"/> : <span className="text-xs text-gray-500">No img</span>}
          </div>
          <span className="font-medium text-white line-clamp-2">{row.name}</span>
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
        <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500/10 text-amber-500">
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
      render: (value) => <span className="text-slate-400 font-medium">{String(value)}</span>,
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
          const now = new Date();
          return (
            product.rawDate.getMonth() === now.getMonth() &&
            product.rawDate.getFullYear() === now.getFullYear()
          );
        });
      default:
        return products;
    }
  }, [activeFilter, products]);

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
        <StatList items={stats} />
        
        <div className="bg-[#14161d] p-6 rounded-xl border border-white/5 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Lịch sử bán hàng</h2>

            <div className="flex gap-3">
              {["all", "auction", "buyNow", "month"].map((filterKey) => {
                const labels: Record<string, string> = {
                  all: "Tất cả",
                  auction: "Đấu giá",
                  buyNow: "Mua ngay",
                  month: "Tháng này"
                };
                return (
                  <button
                    key={filterKey}
                    onClick={() => setActiveFilter(filterKey as any)}
                    className={`px-5 py-2.5 rounded-xl text-sm font-bold transition cursor-pointer ${
                      activeFilter === filterKey
                        ? "bg-[#f97316] text-white"
                        : "bg-[#1a1d27] text-gray-400 hover:text-white"
                    }`}
                  >
                    {labels[filterKey]}
                  </button>
                );
              })}
            </div>
          </div>
          
          {loading ? (
             <div className="py-10 text-center text-gray-500 font-medium">Đang tải dữ liệu...</div>
          ) : (
             <GenericTable data={filteredProducts} columns={columns} />
          )}
        </div>
      </main>
    </div>
  );
}