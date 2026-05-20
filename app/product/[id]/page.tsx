"use client";

import { useRouter } from "next/navigation";
import ProductDetailPage from "@/app/buyer/ProductDetailPage";

export default function ProductDetailRoute() {
  const router = useRouter();

  return (
    <ProductDetailPage
      onPlaceBid={() => router.push("/payment")}
      onBuyNow={() => router.push("/payment")}
    />
  );
}
