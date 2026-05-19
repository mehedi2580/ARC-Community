"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import ConnectWallet from "@/components/auth/ConnectWallet";
import RegisterForm from "@/components/auth/RegisterForm";

export default function LoginPage() {
  const { user, isNewUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) router.replace("/feed");
  }, [user, router]);

  return (
    <main className="min-h-screen bg-bg grid-overlay flex items-center justify-center px-4 relative overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-cyan/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {isNewUser ? <RegisterForm /> : <ConnectWallet />}
      </div>
    </main>
  );
}
