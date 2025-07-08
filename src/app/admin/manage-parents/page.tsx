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
import { StatsCards } from "./_components/stats-cards";
import { useParentStore } from "@/stores/parent-store";
import { Button } from "@/components/ui/button";
import { Plus, Users, Phone, Mail } from "lucide-react";
import { AddParentDialog } from "./_components/add-parent-dialog";

export default function ParentsPage() {
  const { parents, isLoading, error, fetchParents, addParent } =
    useParentStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [healthFilter, setHealthFilter] = useState("all");
  const [openAddParent, setOpenAddParent] = useState(false);

  useEffect(() => {
    if (parents.length === 0) {
      fetchParents();
    }
  }, [fetchParents, parents.length]);

  // Calculate stats
  const totalParents = parents.length;
  const parentsWithEmail = parents.filter(
    (parent) => parent.user?.email
  ).length;
  const parentsWithPhone = parents.filter(
    (parent) => parent.profile?.phone
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-sky-500 to-sky-600 rounded-2xl shadow-lg mb-4">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-700 to-sky-800 bg-clip-text text-transparent">
            Quản lý phụ huynh
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Quản lý thông tin phụ huynh, theo dõi liên lạc và hỗ trợ gia đình
            học sinh
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Tổng phụ huynh
                  </p>
                  <p className="text-3xl font-bold text-sky-700">
                    {totalParents}
                  </p>
                </div>
                <div className="p-3 bg-sky-100 rounded-xl">
                  <Users className="w-6 h-6 text-sky-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Có email</p>
                  <p className="text-3xl font-bold text-sky-700">
                    {parentsWithEmail}
                  </p>
                </div>
                <div className="p-3 bg-sky-100 rounded-xl">
                  <Mail className="w-6 h-6 text-sky-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Có số điện thoại
                  </p>
                  <p className="text-3xl font-bold text-sky-700">
                    {parentsWithPhone}
                  </p>
                </div>
                <div className="p-3 bg-sky-100 rounded-xl">
                  <Phone className="w-6 h-6 text-sky-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="pb-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-800">
                  Danh sách phụ huynh
                </CardTitle>
                <CardDescription className="text-gray-600 mt-1">
                  Quản lý thông tin và liên lạc với phụ huynh trong trường
                </CardDescription>
              </div>
              <Button
                onClick={() => setOpenAddParent(true)}
                className="bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Plus className="w-4 h-4 mr-2" />
                Thêm phụ huynh
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
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

        <AddParentDialog
          open={openAddParent}
          onOpenChange={setOpenAddParent}
          onSubmit={async (data) => {
            await addParent(data);
            await fetchParents();
            setOpenAddParent(false);
          }}
          onCancel={() => setOpenAddParent(false)}
        />
      </div>
    </div>
  );
}
