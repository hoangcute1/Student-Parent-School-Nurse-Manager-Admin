"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import CheckParentAuth from "./check-parent-auth";

export default function ParentLayout({
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
    { label: "Tổng quan", href: "/dashboard/parent" },
    { label: "Hồ sơ con", href: "/dashboard/parent/children" },
    { label: "Lịch tiêm chủng", href: "/dashboard/parent/vaccinations" },
    { label: "Sự kiện trường học", href: "/dashboard/parent/events" },
  ];

  const isActive = (href: string) => pathname === href;

  if (!mounted) return null;

  return (
    <CheckParentAuth>
      <div className="container mx-auto mt-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Hệ thống theo dõi sức khỏe</h1>
          <p className="text-muted-foreground">
            Theo dõi sức khỏe và tiêm chủng của con bạn
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
    </CheckParentAuth>
  );
}
