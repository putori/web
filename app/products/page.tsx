"use client";

import { useRouter } from "next/navigation";
import Homepage from "@/app/buyer/Homepage";
import { useEffect, useState } from "react";
import { listAuctions, searchAuctions, listCategories, getUser, type AuctionDto, type CategoryDto } from "@/lib/api";

export default function ProductsRoute() {
  const router = useRouter();
  const [auctions, setAuctions] = useState<AuctionDto[]>([]);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Auth guard: redirect to login if not authenticated
    const user = getUser();
    if (!user) {
      router.replace("/");
      return;
    }

    Promise.all([
      listAuctions(),
      listCategories(),
    ])
      .then(([auctionList, categoryList]) => {
        setAuctions(auctionList);
        setCategories(categoryList);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      // reset to full list
      listAuctions().then(setAuctions).catch(console.error);
      return;
    }
    try {
      const results = await searchAuctions(query, "OPEN", 40);
      // Convert SearchAuctionDto → AuctionDto shape for display
      const mapped: AuctionDto[] = results.map((r) => ({
        id: r.auctionId,
        product: r.product,
        startTime: "",
        endTime: "",
        startingPrice: r.currentPrice,
        minimumStep: 0,
        currentPrice: r.currentPrice,
        highestBidderId: null,
        version: 0,
        status: r.status,
        enableExtentTime: false,
        threshhold: 0,
      }));
      setAuctions(mapped);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Homepage
      auctions={auctions}
      categories={categories}
      loading={loading}
      onProductClick={(auction) => router.push(`/product/${auction.id}`)}
      onSearch={handleSearch}
    />
  );
}
