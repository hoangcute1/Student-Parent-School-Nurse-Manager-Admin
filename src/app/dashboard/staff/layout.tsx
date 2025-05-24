"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import CheckStaffAuth from "./check-staff-auth";

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { label: "Tổng quan", href: "/dashboard/staff" },
    { label: "Hồ sơ sức khỏe", href: "/dashboard/staff/health-records" },
    { label: "Tiêm chủng", href: "/dashboard/staff/vaccinations" },
    { label: "Sự kiện y tế", href: "/dashboard/staff/events" },
  ];

  const isActive = (href: string) => pathname === href;

  if (!mounted) return null;

  return (
    <CheckStaffAuth>
      <div className="container mx-auto mt-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Quản lý y tế trường học</h1>
          <p className="text-muted-foreground">
            Hệ thống quản lý sức khỏe cho nhân viên y tế
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
    </CheckStaffAuth>
  );
}
