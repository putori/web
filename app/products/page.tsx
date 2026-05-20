"use client";

import { useRouter } from "next/navigation";
import Homepage from "@/app/buyer/Homepage";

export default function ProductsRoute() {
  const router = useRouter();

  return (
    <Homepage
      onProductClick={(product) => router.push(`/product/${product.id}`)}
    />
  );
}
