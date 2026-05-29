"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProductDetailPage from "@/app/buyer/ProductDetailPage";
import { getUser } from "@/lib/api";

export default function ProductDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  useEffect(() => {
    const user = getUser();
    if (!user) {
      router.replace("/");
    }
  }, [router]);

  return (
    <ProductDetailPage
      auctionId={id}
      onPlaceBid={() => {}}
      onBuyNow={() => router.push("/payment")}
    />
  );
}
