import { useRouter } from "next/navigation";
import SellerNavbar from "../../components/seller/SellerNavbar"
import GenericTable from "../../components/seller/GenericTable";
import type { Column } from "../../components/seller/GenericTable";
import StatList from "../../components/seller/StatList";
import type { StatItem } from "../../components/seller/StatList";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useMemo, useState } from "react";

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

const products: Product[] = [
  {
    name: "Razer DeathAdder V3 HyperSpeed",
    category: "Chuột gaming",
    type: "Đấu giá",
    price: "1.250.000đ",
    buyer: "gamer_khoa_123",
    soldDate: "10/04/2026",
    status: "Đấu trúng",
    statusClass:
      "bg-green-500/20 text-green-400 border border-green-500/30",
  },
  {
    name: "Logitech G Pro X TKL",
    category: "Bàn phím cơ",
    type: "Đấu giá",
    price: "3.800.000đ",
    buyer: "pro_player_huy",
    soldDate: "08/04/2026",
    status: "Đấu trúng",
    statusClass:
      "bg-green-500/20 text-green-400 border border-green-500/30",
  },
  {
    name: "SteelSeries Arctis Nova 7",
    category: "Tai nghe",
    type: "Mua ngay",
    price: "2.100.000đ",
    buyer: "technoob_9x",
    soldDate: "06/04/2026",
    status: "Đã bán",
    statusClass:
      "bg-orange-500/20 text-orange-400 border border-orange-500/30",
  },
  {
    name: "HyperX Pulsefire Haste 2",
    category: "Chuột gaming",
    type: "Đấu giá",
    price: "980.000đ",
    buyer: "lele_gaming_vn",
    soldDate: "04/04/2026",
    status: "Đấu trúng",
    statusClass:
      "bg-green-500/20 text-green-400 border border-green-500/30",
  },
  {
    name: "Glorious Model O Wireless",
    category: "Chuột gaming",
    type: "Mua ngay",
    price: "1.450.000đ",
    buyer: "vnprogamer_2005",
    soldDate: "02/04/2026",
    status: "Đã bán",
    statusClass:
      "bg-orange-500/20 text-orange-400 border border-orange-500/30",
  },
  {
    name: "Corsair HS70 Pro Wireless",
    category: "Tai nghe",
    type: "Đấu giá",
    price: "1.100.000đ",
    buyer: "hanoi_gamer99",
    soldDate: "30/03/2026",
    status: "Đấu trúng",
    statusClass:
      "bg-green-500/20 text-green-400 border border-green-500/30",
  },
  {
    name: "ASUS ROG Strix Scope NX",
    category: "Bàn phím cơ",
    type: "Đấu giá",
    price: "2.250.000đ",
    buyer: "saigon_esports",
    soldDate: "28/03/2026",
    status: "Đấu trúng",
    statusClass:
      "bg-green-500/20 text-green-400 border border-green-500/30",
  },
  {
    name: "Razer Basilisk V3 Pro",
    category: "Chuột gaming",
    type: "Mua ngay",
    price: "1.800.000đ",
    buyer: "streamer_kid_95",
    soldDate: "26/03/2026",
    status: "Đã bán",
    statusClass:
      "bg-orange-500/20 text-orange-400 border border-orange-500/30",
  },
];

const columns: Column<Product>[] = [
  {
    key: "name",
    label: "Sản phẩm",
    render: (value) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-slate-800" />
        <span className="font-medium text-white">{value}</span>
      </div>
    ),
  },
  {
    key: "category",
    label: "Danh mục",
  },
  {
    key: "type",
    label: "Kiểu bán",
    render: (value) => (
      <span
        className={`px-3 py-1 rounded-lg text-xs font-semibold ${
          value === "Đấu giá"
            ? "bg-amber-500/20 text-amber-400"
            : "bg-purple-500/20 text-purple-400"
        }`}
      >
        {value}
      </span>
    ),
  },
  {
    key: "price",
    label: "Giá bán",
    render: (value) => (
      <span className="font-semibold text-white">{value}</span>
    ),
  },
  {
    key: "buyer",
    label: "Người mua",
    render: (value) => (
      <span className="text-slate-300">{value}</span>
    ),
  },
  {
    key: "soldDate",
    label: "Ngày bán",
    render: (value) => (
      <span className="text-slate-400">{value}</span>
    ),
  },
  {
    key: "status",
    label: "Trạng thái",
    render: (_, row) => (
      <span
        className={`px-3 py-1 rounded-lg text-xs font-semibold ${row.statusClass}`}
      >
        {row.status}
      </span>
    ),
  },
];

const statItems: StatItem[] = [
  {
    title: "Tổng doanh thu",
    value: "48.250.000đ",
    subText: "+12.4%",
    color: "white",
  },
  {
    title: "Sản phẩm đã bán",
    value: 38,
    subText: "+5 tháng này",
    color: "white",
  },
  {
    title: "Đang đấu giá",
    value: 6,
    subText: "2 sắp kết thúc",
    color: "white",
  },
  {
    title: "Tỷ lệ đánh giá",
    value: "98.7%",
    subText: "124 đánh giá",
    color: "white",
  },
];

type RevenueItem = {
  label: string;
  value: number;
  color: "orange" | "blue" | "green" | "purple";
};

const auctionItems = [
  {
    name: "Razer DeathAdder V3",
    price: "1.250.000đ",
    time: "02:14:33",
  },
  {
    name: "HyperX Cloud Alpha S",
    price: "1.550.000đ",
    time: "03:30:15",
  },
  {
    name: "Corsair K100 RGB",
    price: "4.200.000đ",
    time: "08:00:00",
  },
  {
    name: "Secretlab Titan Evo",
    price: "9.800.000đ",
    time: "23:11:44",
  },
];

const dataDiagram = [
  { day: 1, value: 120 },
  { day: 2, value: 90 },
  { day: 3, value: 150 },
  { day: 4, value: 80 },
  { day: 5, value: 200 },
  { day: 6, value: 170 },
  { day: 7, value: 140 },
  { day: 8, value: 180 },
  { day: 9, value: 110 },
  { day: 10, value: 160 },

  { day: 11, value: 130 },
  { day: 12, value: 175 },
  { day: 13, value: 95 },
  { day: 14, value: 210 },
  { day: 15, value: 190 },
  { day: 16, value: 160 },
  { day: 17, value: 145 },
  { day: 18, value: 170 },
  { day: 19, value: 125 },
  { day: 20, value: 155 },

  { day: 21, value: 180 },
  { day: 22, value: 200 },
  { day: 23, value: 140 },
  { day: 24, value: 165 },
  { day: 25, value: 185 },
  { day: 26, value: 150 },
  { day: 27, value: 135 },
  { day: 28, value: 175 },
  { day: 29, value: 190 },
  { day: 30, value: 220 },
];

export default function DashBoard() {
    const router = useRouter();
    const [activeFilter, setActiveFilter] = useState<
  "all" | "auction" | "buyNow" | "month"
>("all");

const filteredProducts = useMemo(() => {
  switch (activeFilter) {
    case "auction":
      return products.filter(
        (product) => product.type === "Đấu giá"
      );

    case "buyNow":
      return products.filter(
        (product) => product.type === "Mua ngay"
      );

    case "month":
      return products.filter((product) => {
        const [day, month, year] =
          product.soldDate.split("/");

        const productDate = new Date(
          Number(year),
          Number(month) - 1,
          Number(day)
        );

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
    <div className="min-h-screen bg-[#0b0c10] text-white p-6">

      {/* Header */}
      <SellerNavbar
        pageTitle="Tổng quan"
        pageSubtitle="Tổng quan sản phẩm đang đấu giá"
        actionLabel="Thêm sản phẩm"
        onBack={() => router.back()}
        onAction={() => router.push("./")}
        userName="K"
        />
      {/* Stats */}
      <div style={{ marginTop: 20 }}></div>
      <StatList  items = {statItems}/>
      {/* CHART + BREAKDOWN (placeholder layout giống ảnh) */}
      <div style={{ marginTop: 20 }}></div>

      <div className="grid grid-cols-12 gap-4">
            <div className="col-span-8 bg-[#14161d] p-4 rounded-xl ">
                <p className="text-sm text-gray-300 mb-2">
                Doanh thu theo ngày
                </p>

                <ResponsiveContainer width="100%" height="90%">
                <BarChart data={dataDiagram}>
                    <XAxis dataKey="day" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip />

                    <Bar
                    dataKey="value"
                    fill="#f97316"
                    radius={[4, 4, 0, 0]}
                    />
                </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Đang đấu giá */}
            <div className="col-span-4 bg-[#14161d] p-4 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold text-white">
                    Đang đấu giá (6)
                </p>

                <button className="text-orange-400 text-sm hover:text-orange-300">
                    Tất cả
                </button>
                </div>

                <div className="space-y-3">
                {auctionItems.map((item) => (
                    <div
                    key={item.name}
                    className="bg-[#0f1117] rounded-xl px-4 py-3 flex items-center justify-between"
                    >
                    <div>
                        <p className="text-white text-sm font-medium">
                        {item.name}
                        </p>

                        <p className="text-orange-400 font-semibold mt-1">
                        {item.price}
                        </p>
                    </div>

                    <div className="bg-[#1a1d29] px-3 py-2 rounded-lg text-red-400 text-sm font-semibold">
                        {item.time}
                    </div>
                    </div>
                ))}
                </div>
            </div>
        </div>
      {/* Table */}
      <div style={{ marginTop: 20 }}></div>

      <div className="bg-[#14161d] rounded-xl p-4">
        <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">
          Lịch sử bán hàng
        </h2>

        <div className="flex gap-2">
            <button
                onClick={() => setActiveFilter("all")}
                className={`px-4 py-2 rounded-xl font-medium transition ${
                activeFilter === "all"
                    ? "bg-orange-500 text-white"
                    : "bg-slate-800 text-slate-300"
                }`}
            >
                Tất cả
            </button>

            <button
                onClick={() => setActiveFilter("auction")}
                className={`px-4 py-2 rounded-xl font-medium transition ${
                activeFilter === "auction"
                    ? "bg-orange-500 text-white"
                    : "bg-slate-800 text-slate-300"
                }`}
            >
                Đấu giá
            </button>

            <button
                onClick={() => setActiveFilter("buyNow")}
                className={`px-4 py-2 rounded-xl font-medium transition ${
                activeFilter === "buyNow"
                    ? "bg-orange-500 text-white"
                    : "bg-slate-800 text-slate-300"
                }`}
            >
                Mua ngay
            </button>

            <button
                onClick={() => setActiveFilter("month")}
                className={`px-4 py-2 rounded-xl font-medium transition ${
                activeFilter === "month"
                    ? "bg-orange-500 text-white"
                    : "bg-slate-800 text-slate-300"
                }`}
            >
                Tháng này
            </button>
            </div>
      </div>
        <GenericTable data = {filteredProducts} columns = {columns}/>  
      </div>
    </div>
  );
}