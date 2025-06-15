"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import Header from "@/components/layout/header/header";
import type { User as AppUser, UserProfile } from "@/lib/types";
import { getAuthToken } from "@/lib/auth";
import Link from "next/link";

interface ProfileLayoutProps {
  children: React.ReactNode;
}

export default function ProfileLayout({ children }: ProfileLayoutProps) {
  const router = useRouter();
  const [user, setUser] = useState<AppUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    // Check auth token first
    if (!getAuthToken()) {
      // router.push("/login");
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
