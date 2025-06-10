import ImportantNoti from "./_components/important-noti";
import NotiList from "./_components/noti-list";

export default function EventsPage() {
  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-blue-800">
            Quản lý sự kiện y tế
          </h1>
          <p className="text-blue-600">
            Quản lý các sự kiện y tế trong trường học
          </p>
        </div>
      </div>
      <ImportantNoti />
      <NotiList />
    </div>
  );
}
