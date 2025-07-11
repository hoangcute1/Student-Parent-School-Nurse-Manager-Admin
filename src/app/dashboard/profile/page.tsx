"use client";
import { useParentStudentsStore } from "@/stores/parent-students-store";
import Overall from "./_components/overall";
import RegularResultsPage from "./_components/regular-result";
import VaccinationResults from "./_components/vaccination-results";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Syringe } from "lucide-react";

export default function RegularResult() {
  const { fetchStudentsByParent } = useParentStudentsStore();
  const [activeTab, setActiveTab] = useState("health");

  useEffect(() => {
    fetchStudentsByParent();
  }, [fetchStudentsByParent]);

  return (
    <div className="flex flex-col gap-12">
      <Overall />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="health" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Kết quả khám sức khỏe
          </TabsTrigger>
          <TabsTrigger value="vaccination" className="flex items-center gap-2">
            <Syringe className="h-4 w-4" />
            Kết quả tiêm chủng
          </TabsTrigger>
        </TabsList>

        <TabsContent value="health" className="mt-6">
          <RegularResultsPage />
        </TabsContent>

        <TabsContent value="vaccination" className="mt-6">
          <VaccinationResults />
        </TabsContent>
      </Tabs>
    </div>
  );
}
