"use client";
import { useParentStudentsStore } from "@/stores/parent-students-store";
import Overall from "./_components/overall";
import RegularResultsPage from "./_components/regular-result";
import VaccinationResults from "./_components/vaccination-results";
import { useEffect, useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
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

      {/* Xoá TabsList và TabsTrigger, chỉ giữ lại nội dung các tab */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
