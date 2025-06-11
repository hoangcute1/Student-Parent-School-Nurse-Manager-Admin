"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ParentTable } from "./_components/parent-table";
import { FilterBar } from "./_components/filter-bar";
import { useParentStore } from "@/stores/parent-store";

export default function ParentsPage() {
  const { parents, isLoading, error, fetchParents, addParent } =
    useParentStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [healthFilter, setHealthFilter] = useState("all");

  useEffect(() => {
    // Chỉ fetch khi chưa có data
    if (parents.length === 0) {
      fetchParents();
    }
  }, [fetchParents, parents.length]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-blue-800">
          Quản lý phụ huynh
        </h1>
        <p className="text-blue-600">
          Danh sách phụ huynh và thông tin liên hệ
        </p>
      </div>

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
            onAddParent={addParent}
          />
          <ParentTable parents={parents} isLoading={isLoading} error={error} />
        </CardContent>
      </Card>
    </div>
  );
}
