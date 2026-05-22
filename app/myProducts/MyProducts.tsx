import { useRouter } from "next/navigation";
import SellerNavbar from "../../components/seller/SellerNavbar"
import GenericTable from "../../components/seller/GenericTable";
import type { Column } from "../../components/seller/GenericTable";
import StatList from "../../components/seller/StatList";
import type { StatItem } from "../../components/seller/StatList";

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
    name: "PlayStation 5 Digital Edition 825GB SSD",
    category: "Thiết bị điện tử",
    startPrice: "10.000.000đ",
    currentPrice: "8.200.000đ",
    status: "Đang đấu giá",
    statusColor: "text-green-400 bg-green-500/10",
    end: "28/04/2026 20:00",
  },
  {
    name: "Nintendo Switch OLED - Limited Edition",
    category: "Thiết bị điện tử",
    startPrice: "6.000.000đ",
    currentPrice: "8.200.000đ",
    status: "Đang đấu giá",
    statusColor: "text-green-400 bg-green-500/10",
    end: "28/04/2026 20:00",
  },
  {
    name: "Xbox Series X 1TB - Carbon Black",
    category: "Thiết bị điện tử",
    startPrice: "12.000.000đ",
    currentPrice: "12.500.000đ",
    status: "Chờ duyệt",
    statusColor: "text-orange-400 bg-orange-500/10",
    end: "28/04/2026 20:00",
  },
  {
    name: "Steam Deck OLED 1TB - Gaming Handheld",
    category: "Thiết bị điện tử",
    startPrice: "7.000.000đ",
    currentPrice: "9.500.000đ",
    status: "Đã bán xong",
    statusColor: "text-blue-400 bg-blue-500/10",
    end: "28/04/2026 20:00",
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
    title: "Tổng sản phẩm",
    value: 24,
    subText: "+3 tuần này",
    color: "orange",
  },
  {
    title: "Đang đấu giá",
    value: 8,
    color: "green",
  },
  {
    title: "Đã bán",
    value: 156,
    color: "blue",
  },
  {
    title: "Chờ duyệt",
    value: 2,
    color: "red",
  },
];

export default function MyProducts() {
    const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0b0c10] text-white p-6">

      {/* Header */}
      <SellerNavbar
        pageTitle="Sản Phẩm"
        pageSubtitle="Quản lý sản phẩm đang đấu giá"
        actionLabel="Thêm sản phẩm"
        onBack={() => router.back()}
        onAction={() => router.push("./")}
        userName="K"
        />
      {/* Stats */}
      <div style={{ marginTop: 20 }}></div>
      <StatList  items = {statItems}/>
      {/* Table */}
      <GenericTable data = {products} columns = {columns}/>  
    </div>
  );
}