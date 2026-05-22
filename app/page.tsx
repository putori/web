"use client";

import { useRouter } from "next/navigation";
import AuthPage from "./auth/AuthPage";



export default function Home() {
  const router = useRouter();

  return (
    <AuthPage
      onLogin={() => router.push("/dashboard")}
      onRegister={() => router.push("/dashboard")}
      onGoogleAuth={() => router.push("/dashboard")}
      onForgotPassword={() => router.push("/auth/forgot-password")}
    />
  );
}
