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

export default function ParentsPage() {
  const { parents, isLoading, error, fetchParents, addParent } =
    useParentStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [healthFilter, setHealthFilter] = useState("all");
  const [openAddParent, setOpenAddParent] = useState(false);



  useEffect(() => {
    // Chỉ fetch khi chưa có data
    if (parents.length === 0) {
      fetchParents();
    }
  }, [fetchParents, parents.length]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-sky-800">
          Quản lý phụ huynh
        </h1>
        <p className="text-sky-600">
          Danh sách phụ huynh và thông tin liên hệ
        </p>
      </div>

      <Card className="border-sky-100">
        <CardHeader>
          <CardTitle className="text-sky-800">Danh sách phụ huynh</CardTitle>
          <CardDescription className="text-sky-600">
            Quản lý thông tin và liên lạc với phụ huynh trong trường
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <Button
                className="bg-sky-600 hover:bg-sky-700 text-white py-2 px-4 rounded-lg flex items-center gap-2 shadow transition-all duration-150 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-300 font-normal"
                onClick={() => setOpenAddParent(true)}
              >
                <Plus className="mr-2 h-4 w-4" /> Thêm phụ huynh
              </Button>
            </div>
            <AddParentDialog
              open={openAddParent}
              onOpenChange={setOpenAddParent}
              onSubmit={async (data) => {
                await addParent(data);
                await fetchParents(); // Reload lại danh sách nhân viên sau khi thêm thành công
                setOpenAddParent(false);
              }}
              onCancel={() => setOpenAddParent(false)}
            />
          </div>
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
