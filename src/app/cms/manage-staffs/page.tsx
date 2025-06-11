"use client";

import { useEffect, useState } from "react";
import type { Parent as ApiParent } from "../../../type/parents";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ParentTable } from "./_components/parent-table";
import { FilterBar } from "./_components/filter-bar";
import type { ParentFormValues } from "./_components/add-parent-dialog";
import { createParent, getParents } from "@/lib/api/parents";

interface DisplayParent {
  name: string;
  phone: string;
  address: string;
  email: string;
  createdAt: string;
}

const mapToDisplayParent = (apiParent: ApiParent): DisplayParent => ({
  name: apiParent.name,
  phone: apiParent.phone || "N/A",
  address: apiParent.address || "N/A",
  email: apiParent.email || "N/A",
  createdAt: new Date(apiParent.createdAt).toLocaleDateString("vi-VN"),
});

export default function ParentsPage() {
  const [parentData, setParentData] = useState<DisplayParent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [healthFilter, setHealthFilter] = useState("all");
  useEffect(() => {
    const fetchParents = async () => {
      try {
        setIsLoading(true);

        const data = await getParents();
        console.log("API response:", data);

        if (Array.isArray(data)) {
          // Map API response to the local display format
          const parents = data.map(mapToDisplayParent);
          console.log("Transformed parent data:", parents);
          setParentData(parents);
        } else if (data.data && Array.isArray(data.data)) {
          // Handle response with data wrapper
          const parents = data.data.map(mapToDisplayParent);
          console.log("Transformed parent data:", parents);
          setParentData(parents);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err: any) {
        console.error("Failed to fetch parents:", err);
        setError(err.message);

        // Handle authentication errors specifically
        if (
          err.message.includes("401") ||
          err.message.toLowerCase().includes("unauthorized")
        ) {
          console.log("Authentication error detected, redirecting to login...");
          // Optional: Redirect to login page
          // window.location.href = "/login";
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchParents();
  }, []);

  const onSubmit = async (data: ParentFormValues) => {
    try {
      setIsLoading(true);
      setError(null);

      const newParent = await createParent({
        name: data.name,
        phone: data.phone,
        address: data.address,
        email: data.email,
      });

      const newDisplayParent = mapToDisplayParent(newParent);
      setParentData((prev) => [...prev, newDisplayParent]);
    } catch (err: any) {
      console.error("Failed to create parent:", err);
      setError(err.message);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-2">
        {" "}
        <h1 className="text-3xl font-bold tracking-tight text-blue-800">
          Quản lý phụ huynh
        </h1>
        <p className="text-blue-600">
          Danh sách phụ huynh và thông tin liên hệ
        </p>
      </div>

      {/* Bộ lọc và tìm kiếm */}
      <Card className="border-blue-100">
        <CardHeader>
          <CardTitle className="text-blue-800">Danh sách phụ huynh</CardTitle>
          <CardDescription className="text-blue-600">
            Quản lý thông tin và liên lạc với phụ huynh trong trường
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FilterBar
            onSearchChange={setSearchQuery}
            onClassFilterChange={setClassFilter}
            onHealthStatusChange={setHealthFilter}
            onAddParent={onSubmit}
          />
          <ParentTable
            parents={parentData}
            isLoading={isLoading}
            error={error}
          />
        </CardContent>
      </Card>
    </div>
  );
}
