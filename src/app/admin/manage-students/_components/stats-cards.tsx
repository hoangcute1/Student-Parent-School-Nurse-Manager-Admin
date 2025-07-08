"use client";

import { Users, UserCircle2, UserRoundCog } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface StatsCardsProps {
  totalStudents: number;
  maleStudents: number;
  femaleStudents: number;
  isLoading: boolean;
}

export function StatsCards({
  totalStudents,
  maleStudents,
  femaleStudents,
  isLoading,
}: StatsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="border-blue-100">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-blue-600" />
            <div>
              <div className="text-2xl font-bold text-blue-800">
                {totalStudents}
              </div>
              <div className="text-sm text-blue-600">Total Students</div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="border-sky-100">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <UserCircle2 className="h-8 w-8 text-sky-600" />
            <div>
              <div className="text-2xl font-bold text-sky-800">
                {maleStudents}
              </div>
              <div className="text-sm text-sky-600">Male Students</div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="border-pink-100">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <UserRoundCog className="h-8 w-8 text-pink-600" />
            <div>
              <div className="text-2xl font-bold text-pink-800">
                {femaleStudents}
              </div>
              <div className="text-sm text-pink-600">Female Students</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
