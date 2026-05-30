"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SellerNavbar from "../../../components/seller/SellerNavbar";
import StatList, { StatItem } from "../../../components/seller/StatList";
import GenericTable, { Column } from "../../../components/seller/GenericTable";

interface MyProductItem {
  id: string;
  auctionId: string | null;
  name: string;
  imageUrl: string;
  category: string;
  startPrice: string;
  currentPrice: string;
  status: string;
  statusClass: string;
  endTime: string;
  isEndable: boolean;
}

export default function MyProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<MyProductItem[]>([]);
  const [stats, setStats] = useState<StatItem[]>([
    { title: "Tổng sản phẩm", value: 0, color: "white" },
    { title: "Đang đấu giá", value: 0, color: "green" },
    { title: "Chờ duyệt", value: 0, color: "orange" },
    { title: "Đã bán", value: 0, color: "blue" },
  ]);

  const CURRENT_SELLER_ID = 1; 

  const fetchDashboardData = async () => {
    try {
      const authHeader = 'Basic ' + btoa('user:315686f2-4834-40c8-905f-5380ac9f5991'); 
      const reqOpt = { headers: { 'Authorization': authHeader, 'Content-Type': 'application/json' } };

      const [prodRes, aucRes] = await Promise.all([
        fetch("http://localhost:8080/products?size=100", reqOpt),
        fetch("http://localhost:8080/auctions?size=100", reqOpt)
      ]);

      const prodJson = await prodRes.json();
      const aucJson = await aucRes.json();

      const allProducts = prodJson.data?.items || prodJson.data || [];
      const allAuctions = aucJson.data?.items || aucJson.data || [];

      const myProducts = allProducts.filter((p: any) => p.sellerId === CURRENT_SELLER_ID);
      const myAuctions = allAuctions.filter((a: any) => a.product?.sellerId === CURRENT_SELLER_ID);

      let countActive = 0;
      let countPending = 0;
      let countSold = 0;

      const tableData: MyProductItem[] = myProducts.map((prod: any) => {
        const auction = myAuctions.find((a: any) => a.product?.id === prod.id);

        let statusText = "Chưa đăng bán";
        let statusClass = "bg-slate-500/20 text-slate-400";
        let endTimeStr = "-";
        let isEndable = false;
        let startP = prod.price;
        let currP = prod.price;
        let aucId = null;

        if (auction) {
          aucId = auction.id;
          startP = auction.startingPrice;
          currP = auction.currentPrice;
          
          const now = new Date().getTime();
          const end = new Date(auction.endTime).getTime();

          if (auction.status === "ENDED") {
            statusText = "Đã bán";
            statusClass = "bg-gray-500/20 text-gray-400";
            endTimeStr = "Đã kết thúc";
            countSold++;
          } else {
            if (now >= end) {
              statusText = "Chờ duyệt";
              statusClass = "bg-amber-500/20 text-amber-500";
              endTimeStr = "Đã quá hạn";
              isEndable = true;
              countPending++;
            } else {
              statusText = "Đang đấu giá";
              statusClass = "bg-green-500/20 text-green-400 border border-green-500/30";
              endTimeStr = new Date(auction.endTime).toLocaleString("vi-VN");
              isEndable = true;
              countActive++;
            }
          }
        }

        return {
          id: prod.id.toString(),
          auctionId: aucId ? aucId.toString() : null,
          name: prod.title,
          imageUrl: prod.images?.[0]?.imageUrl || "",
          category: `Danh mục #${prod.categoryId}`,
          startPrice: startP.toLocaleString("vi-VN") + "đ",
          currentPrice: currP.toLocaleString("vi-VN") + "đ",
          status: statusText,
          statusClass: statusClass,
          endTime: endTimeStr,
          isEndable: isEndable,
        };
      });

      tableData.sort((a, b) => {
        if (a.status === "Chờ duyệt") return -1;
        if (a.status === "Đang đấu giá" && b.status !== "Chờ duyệt") return -1;
        return 1;
      });

      setProducts(tableData);
      setStats([
        { title: "Tổng sản phẩm", value: myProducts.length, color: "white" },
        { title: "Đang đấu giá", value: countActive, color: "green" },
        { title: "Chờ duyệt", value: countPending, color: "orange" },
        { title: "Đã bán", value: countSold, color: "blue" },
      ]);

    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleEndAuction = async (auctionId: string) => {
    if (!confirm("Bạn có chắc chắn muốn kết thúc phiên đấu giá này ngay bây giờ?")) return;
    
    try {
      const authHeader = 'Basic ' + btoa('user:315686f2-4834-40c8-905f-5380ac9f5991'); 
      const res = await fetch(`http://localhost:8080/auctions/${auctionId}/end`, {
        method: "POST",
        headers: {
          'Authorization': authHeader
        }
      });

      if (!res.ok) throw new Error("Lỗi khi kết thúc phiên");
      alert("Đã kết thúc phiên đấu giá thành công!");
      
      fetchDashboardData();
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  const columns: Column<MyProductItem>[] = [
    {
      key: "name",
      label: "Sản phẩm",
      render: (value, row) => (
        <div className="flex items-center gap-3">
          {row.imageUrl ? (
            <img src={row.imageUrl} alt="thumbnail" className="w-10 h-10 rounded-lg object-cover flex-shrink-0 bg-slate-800" />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-slate-800 flex-shrink-0" />
          )}
          <div className="flex flex-col">
            <span className="font-bold text-white line-clamp-1">{String(value)}</span>
            <span className="text-xs text-slate-500">{row.category}</span>
          </div>
        </div>
      ),
    },
    {
      key: "startPrice",
      label: "Giá khởi điểm",
      render: (value) => <span className="text-slate-400 font-medium">{String(value)}</span>,
    },
    {
      key: "currentPrice",
      label: "Giá hiện tại",
      render: (value) => <span className="text-orange-400 font-bold">{String(value)}</span>,
    },
    {
      key: "endTime",
      label: "Kết thúc dự kiến",
      render: (value) => <span className="text-slate-300 text-sm">{String(value)}</span>,
    },
    {
      key: "status",
      label: "Trạng thái",
      render: (value, row) => (
        <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${row.statusClass}`}>
          {String(value)}
        </span>
      ),
    },
    {
      key: "id",
      label: "Hành động",
      render: (_, row) => {
        if (row.isEndable && row.auctionId) {
          return (
            <button
              onClick={() => handleEndAuction(row.auctionId!)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                row.status === "Chờ duyệt" 
                  ? "bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20" 
                  : "bg-blue-600 hover:bg-blue-500 text-white"
              }`}
            >
              {row.status === "Chờ duyệt" ? "Duyệt đơn" : "Bán ngay"}
            </button>
          );
        }
        return <span className="text-xs text-slate-600 font-medium">Không khả dụng</span>;
      },
    },
  ];

  return (
    <div className="min-h-screen bg-[#0b0c10] text-white flex flex-col">
      <SellerNavbar
        pageTitle="Quản lý sản phẩm"
        pageSubtitle="Bao quát toàn bộ gian hàng và các phiên đấu giá"
        actionLabel="Thêm sản phẩm"
        onBack={() => router.push("/seller")}
        onAction={() => router.push("/seller/add-product")}
        userName="K"
      />

      <div className="flex-1 max-w-7xl w-full mx-auto p-8 space-y-6">
        <StatList items={stats} />
        
        <div className="bg-[#14161d] rounded-xl border border-white/5 overflow-hidden p-6 shadow-xl">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <span className="w-1.5 h-5 bg-orange-500 rounded-full"></span>
            Kho sản phẩm của bạn
          </h2>
          <GenericTable data={products} columns={columns} />
        </div>
      </div>
    </div>
  );
}