import ImportantNoti from "./_components/important-noti";
import NotiList from "./_components/noti-list";
import TreatmentHistoryComponent from "./_components/treatment-history";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function EventsPage() {
  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-blue-800">
            Sự cố y tế & Lịch sử bệnh án
          </h1>
          <p className="text-blue-600">
            Theo dõi thông báo và lịch sử bệnh án của con em bạn
          </p>
        </div>
      </div>

      <Tabs defaultValue="notifications" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="notifications" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            Thông báo sự cố
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            Lịch sử bệnh án
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-6">
          <ImportantNoti />
          <NotiList />
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <TreatmentHistoryComponent />
        </TabsContent>
      </Tabs>
    </div>
  );
}
