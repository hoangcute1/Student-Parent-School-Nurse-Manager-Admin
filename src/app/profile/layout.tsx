"use client";

import type React from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/header/header";

import { getAuthToken } from "@/lib/api";
import { useAuthStore } from "@/stores/auth-store";

interface ProfileLayoutProps {
  children: React.ReactNode;
}

export default function ProfileLayout({ children }: ProfileLayoutProps) {
  const router = useRouter();
  const { setUser, setProfile } = useAuthStore();

  useEffect(() => {
    if (!getAuthToken) {
      return;
    }

    // Get user data from localStorage
    const authData = localStorage.getItem("authData");
    if (authData) {
      try {
        const data = JSON.parse(authData);
        if (data.user && data.profile) {
          setUser(data.user);
          setProfile(data.profile);
        }
      } catch (error) {
        console.error("Error parsing auth data:", error);
      }
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>{children}</main>
    </div>
  );
}
