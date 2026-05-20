"use client";

import { useRouter } from "next/navigation";
import PaymentPage from "@/app/buyer/PaymentPage";

export default function PaymentRoute() {
  const router = useRouter();

  return <PaymentPage onConfirm={() => router.push("/history")} />;
}
