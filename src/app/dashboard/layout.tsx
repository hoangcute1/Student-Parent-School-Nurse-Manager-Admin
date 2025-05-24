"use client";

import type React from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Home, Menu, Users, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { User as AppUser, UserProfile } from "@/lib/types";
import { getAuthToken } from "@/lib/auth";
import CheckAuth from "./check-auth";
import User from "@/components/layout/header/user";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();

  // Effect for handling initial state
  useEffect(() => {
    // Check auth token first
    if (!getAuthToken()) {
      return;
    }

    // Get sidebar state from localStorage
    const savedSidebarState = localStorage.getItem("sidebarOpen");
    if (savedSidebarState !== null) {
      setIsSidebarOpen(JSON.parse(savedSidebarState));
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
  }, []);

  // Save sidebar state to localStorage when it changes
  const toggleSidebar = () => {
    const newState = !isSidebarOpen;
    setIsSidebarOpen(newState);
    localStorage.setItem("sidebarOpen", JSON.stringify(newState));
  };

  const navLinks = [
    { href: "/dashboard", icon: Home, label: "Trang chủ" },
    { href: "/dashboard/health-records", icon: Heart, label: "Hồ sơ sức khỏe" },
    { href: "/dashboard/users", icon: Users, label: "Người dùng" },
  ];

  return (
    <CheckAuth>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed left-0 top-0 z-40 h-screen w-64 transform border-r bg-background transition-all duration-200 ease-in-out",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex h-16 items-center justify-between gap-2 border-b px-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 font-semibold"
            >
              <Heart className="h-6 w-6" />
              <span>HEALTH CARE</span>
            </Link>
          </div>
          <nav className="space-y-1 px-2 py-4">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 transition-all hover:bg-accent",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        {/* Main content */}
        <div
          className={cn(
            "flex min-h-screen flex-1 flex-col transition-all duration-200 ease-in-out",
            isSidebarOpen ? "lg:ml-64" : "lg:ml-0"
          )}
        >
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background  pl-2 pr-4 md:pr-6">
            <div className="flex items-center gap-4">
              <div
                onClick={toggleSidebar}
                className=" size-10 flex justify-center items-center hover:bg-slate-100 rounded-md"
              >
                {isSidebarOpen ? <ChevronLeft size={25} /> : <Menu size={25} />}
              </div>
            </div>

            <div className="flex items-center gap-4">
              {user && profile ? <User /> : null}
            </div>
          </header>
          <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
        </div>
        {/* Mobile overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm lg:hidden"
            onClick={toggleSidebar}
          />
        )}
      </div>
    </CheckAuth>
  );
}
