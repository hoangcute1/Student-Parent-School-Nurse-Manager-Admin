"use client";

import { useAuth } from "@/lib/auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CheckStaffAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth(["staff", "admin"]);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      console.log("Không có quyền nhân viên, chuyển hướng đến trang login");
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
          <p className="text-sm text-muted-foreground">
            Đang kiểm tra quyền nhân viên...
          </p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  // Only staff and admin can access
  if (user.role !== "staff" && user.role !== "admin") {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="max-w-md rounded-lg border bg-card p-6 shadow-lg">
          <h2 className="mb-2 text-xl font-bold">Quyền truy cập hạn chế</h2>
          <p className="mb-4 text-muted-foreground">
            Chỉ nhân viên y tế mới có thể truy cập phần này.
          </p>
          <button
            onClick={() => router.replace("/dashboard")}
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            Quay lại Dashboard
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
