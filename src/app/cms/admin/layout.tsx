"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth("admin");
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading || !mounted) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
          <p className="text-sm text-muted-foreground">
            Đang kiểm tra quyền quản trị...
          </p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="max-w-md rounded-lg border bg-card p-6 shadow-lg">
          <h2 className="mb-2 text-xl font-bold">Yêu cầu quyền quản trị</h2>
          <p className="mb-4 text-muted-foreground">
            Bạn cần quyền quản trị viên để truy cập phần này.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            Quay lại Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const navItems = [
    { label: "Tổng quan", href: "/dashboard/admin" },
    { label: "Quản lý người dùng", href: "/dashboard/admin/users" },
    { label: "Vai trò hệ thống", href: "/dashboard/admin/roles" },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <div className="container mx-auto mt-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Bảng điều khiển quản trị</h1>
        <p className="text-muted-foreground">
          Quản lý hệ thống sức khỏe trường học
        </p>
      </div>

      <div className="mb-6 flex border-b">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`mr-4 border-b-2 px-2 py-2 text-sm font-medium transition-colors ${
              isActive(item.href)
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:border-gray-300 hover:text-foreground"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>

      <div className="min-h-[80vh]">{children}</div>
    </div>
  );
}
