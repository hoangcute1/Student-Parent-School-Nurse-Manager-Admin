"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { UserNav } from "@/components/user-nav";
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
      router.push("/login");
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
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4">
        <div className="flex items-center gap-2 pl-4">
            <Heart className="h-6 w-6 text-red-500" />
            <span className="text-xl font-bold">Y Tế Học Đường</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
              Trang chủ
            </Link>
            <Link href="#features" className="text-sm font-medium transition-colors hover:text-primary">
              Tính năng
            </Link>
            <Link href="#resources" className="text-sm font-medium transition-colors hover:text-primary">
              Tài liệu
            </Link>
            <Link href="#blog" className="text-sm font-medium transition-colors hover:text-primary">
              Blog
            </Link>
            <Link href="#contact" className="text-sm font-medium transition-colors hover:text-primary">
              Liên hệ
            </Link>
          </nav>
        <div className="flex items-center gap-4">
          {user && profile ? <UserNav user={user} profile={profile} /> : null}
        </div>
      </header>

      {/* Main content */}
      <main>{children}</main>
    </div>
  );
}
