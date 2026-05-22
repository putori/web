import { useRouter } from "next/navigation";
import SellerNavbar from "../../components/seller/SellerNavbar"
import GenericTable from "../../components/seller/GenericTable";
import type { Column } from "../../components/seller/GenericTable";
import StatList from "../../components/seller/StatList";
import type { StatItem } from "../../components/seller/StatList";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

type Product = {
  name: string;
  category: string;
  startPrice: string;
  currentPrice: string;
  status: string;
  statusColor: string;
  end: string;
};

const products: Product[] = [
    {
      name: "PlayStation 5 Digital Edition",
      category: "Bán đấu giá",
      startPrice: "12.000.000đ",
      currentPrice: "+14.200.000đ",
      status: "Hoàn tất",
      statusColor: "text-green-400",
      end: "20/04/2026",
    },
  ];

const columns: Column<Product>[] = [
  {
    key: "name",
    label: "Sản phẩm",
  },
  {
    key: "category",
    label: "Danh mục",
  },
  {
    key: "startPrice",
    label: "Giá khởi điểm",
  },
  {
    key: "currentPrice",
    label: "Giá hiện tại",
    render: (value) => (
      <span className="text-green-400 font-semibold">
        {value}
      </span>
    ),
  },
  {
    key: "status",
    label: "Trạng thái",
    render: (_, row) => (
      <span className={`px-2 py-1 rounded text-xs ${row.statusColor}`}>
        {row.status}
      </span>
    ),
  },
  {
    key: "end",
    label: "Kết thúc",
  },
];

const statItems: StatItem[] = [
  {
    title: "Tổng doanh thu",
    value: "284.500.000đ",
    subText: "18.3% so với tháng trước",
    color: "orange",
  },
  {
    title: "Lợi nhuận ròng",
    value: "186.375.000đ",
    subText: "75% margin",
    color: "green",
  },
  {
    title: "Sản phẩm đã bán",
    value: 156,
    color: "blue",
  },
  {
    title: "Phí giao dịch",
    value: "12.425.000đ",
    color: "red",
  },
];

type RevenueItem = {
  label: string;
  value: number;
  color: "orange" | "blue" | "green" | "purple";
};

const revenueItems: RevenueItem[] = [
  {
    label: "Chuột",
    value: 68,
    color: "orange",
  },
  {
    label: "Bàn phím",
    value: 48,
    color: "blue",
  },
  {
    label: "Tai nghe",
    value: 32,
    color: "green",
  },
  {
    label: "Console",
    value: 56,
    color: "purple",
  },
];

const colorMap = {
  orange: "bg-orange-500",
  blue: "bg-blue-500",
  green: "bg-green-500",
  purple: "bg-purple-500",
};

const dataDiagram = [
  { month: "Jan", value: 120 },
  { month: "Feb", value: 90 },
  { month: "Mar", value: 150 },
  { month: "Apr", value: 80 },
  { month: "May", value: 200 },
  { month: "Jun", value: 170 },
  { month: "Jul", value: 140 },
  { month: "Aug", value: 180 },
  { month: "Sep", value: 110 },
  { month: "Oct", value: 160 },
  { month: "Nov", value: 130 },
  { month: "Dec", value: 190 },
];

export default function ProductDashboard() {
    const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0b0c10] text-white p-6">

      {/* Header */}
      <SellerNavbar
        pageTitle="Doanh thu"
        pageSubtitle="Thống kê doanh thu và tổng hợp tài chính của bạn"
        actionLabel="Thêm sản phẩm"
        onBack={() => router.back()}
        onAction={() => router.push("./")}
        userName="K"
        />
      {/* Stats */}
          <div style={{ marginTop: 20 }}></div>
          <StatList  items = {statItems}/>
      {/* CHART + BREAKDOWN (placeholder layout giống ảnh) */}
      <div className="grid grid-cols-3 gap-4">

        <div className="col-span-2 bg-[#14161d] p-4 rounded-xl h-64">
            <p className="text-sm text-gray-300 mb-2">Doanh thu theo tháng</p>

            <ResponsiveContainer width="100%" height="90%">
                <BarChart data={dataDiagram}>
                <XAxis dataKey="month" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip />
                <Bar dataKey="value" fill="#f97316" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>

        <div className="bg-[#14161d] p-4 rounded-xl">
          <p className="text-sm text-gray-300 mb-4">Phân loại doanh thu</p>

          <div className="space-y-3 text-xs">
            {revenueItems.map((item) => (
              <div key={item.label}>
                <div className="flex justify-between mb-1">
                  <span>{item.label}</span>
                  <span>{item.value}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded">
                  <div className={`h-2 rounded ${colorMap[item.color]}`} style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Stats */}
      <div style={{ marginTop: 20 }}></div>
      <StatList  items = {statItems}/>
      {/* Table */}
      <div className="bg-[#14161d] rounded-xl p-4">
        <p className="text-sm font-medium mb-4">Lịch sử thanh toán</p>
        <GenericTable data = {products} columns = {columns}/>  
      </div>
    </div>
  );
}