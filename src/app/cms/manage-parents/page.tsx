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
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddParentDialog } from "./_components/add-parent-dialog";

// Define the mapping function to transform parent data for display
const mapParentForDisplay = (parent: any) => {
  const user = parent.user || {};
  const profile = parent.profile || {};

  return {
    id: parent._id,
    name: profile.name || "",
    phone: profile.phone || "",
    address: profile.address || "",
    email: user.email || "",
    createdAt: user.created_at
      ? new Date(user.created_at).toLocaleDateString("vi-VN")
      : "Không rõ",
  };
};

export default function ParentsPage() {
  const { parents, isLoading, error, fetchParents, addParent } =
    useParentStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [healthFilter, setHealthFilter] = useState("all");
  const [openAddParent, setOpenAddParent] = useState(false);

  // Transform parent data for display
  const displayParents = parents.map(mapParentForDisplay).filter((parent) => {
    // Apply search filter if exists
    if (searchQuery && searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      return (
        parent.name.toLowerCase().includes(query) ||
        parent.email.toLowerCase().includes(query) ||
        parent.phone.toLowerCase().includes(query) ||
        parent.address.toLowerCase().includes(query)
      );
    }
    return true;
  });

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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center gap-2 shadow transition-all duration-150 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-300 font-normal"
                onClick={() => setOpenAddParent(true)}
              >
                <Plus className="mr-2 h-4 w-4" /> Thêm phụ huynh
              </Button>
            </div>
            <AddParentDialog
              open={openAddParent}
              onOpenChange={setOpenAddParent}
              onSubmit={addParent}
              onCancel={() => setOpenAddParent(false)}
            />
          </div>
          <FilterBar
            onSearchChange={setSearchQuery}
            onClassFilterChange={setClassFilter}
            onHealthStatusChange={setHealthFilter}
            onAddParent={addParent}
          />
          <ParentTable
            parents={parents}
            isLoading={isLoading}
            error={error}
          />
        </CardContent>
      </Card>
    </div>
  );
}
