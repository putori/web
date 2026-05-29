"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthPage from "./auth/AuthPage";
import { login, register } from "@/lib/api";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | undefined>();
  const [registerError, setRegisterError] = useState<string | undefined>();

  const handleLogin = async (data: { email: string; password: string }) => {
    setLoginError(undefined);
    setLoading(true);
    try {
      await login(data.email, data.password);
      router.push("/buyer/homepage");
    } catch (e: unknown) {
      setLoginError(e instanceof Error ? e.message : "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (data: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    setRegisterError(undefined);
    setLoading(true);
    try {
      await register(data.fullName, data.email, data.password);
      router.push("/buyer/homepage");
    } catch (e: unknown) {
      setRegisterError(
        e instanceof Error ? e.message : "Đăng ký thất bại"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPage
      onLogin={handleLogin}
      onRegister={handleRegister}
      onForgotPassword={() => alert("Tính năng đang phát triển")}
      loginError={loginError}
      registerError={registerError}
      loading={loading}
    />
  );
}
