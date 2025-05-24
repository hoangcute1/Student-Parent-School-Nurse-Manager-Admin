"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings2, UserCircle } from "lucide-react";
import { logout } from "@/lib/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { User, UserProfile } from "@/lib/types";

export default function User() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    // Get user data from localStorage
    const authData = localStorage.getItem("authData");
    if (!authData) {
      router.push("/login");
      return;
    }

    try {
      const data = JSON.parse(authData);
      if (data.user && data.profile) {
        setUser(data.user);
        setProfile(data.profile);
      }
    } catch (error) {
      console.error("Error parsing auth data:", error);
      router.push("/login");
    }
  }, [router]);

  if (!user || !profile) {
    return null;
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-auto gap-2 px-2 select-none"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={profile.avatar} alt={profile.name} />
            <AvatarFallback>
              {profile.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium">{profile.name}</span>
            <span className="text-xs text-muted-foreground">
              {user.userType === "admin"
                ? "Quản trị viên"
                : user.userType === "staff"
                ? "Nhân viên y tế"
                : "Phụ huynh"}
            </span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile" className="flex w-full items-center">
            <UserCircle className="mr-2 h-4 w-4" />
            <span>Thông tin cá nhân</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {(user.userType === "admin" || user.userType === "staff") && (
          <>
            <DropdownMenuItem asChild>
              <Link href="/dashboard" className="flex w-full items-center">
                <Settings2 className="mr-2 h-4 w-4" />
                <span>Bảng điều khiển</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem
          className="cursor-pointer text-red-600"
          onSelect={() => logout()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Đăng xuất</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
