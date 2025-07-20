import { useParentNotificationStore } from "@/stores/notification-store";
import { getParentId } from "@/lib/utils/parent-utils";
import { useEffect } from "react";

export default function Header() {
  const { notifications, fetchNotifications } = useParentNotificationStore();
  useEffect(() => {
    getParentId().then((parentId) => {
      if (parentId) fetchNotifications(parentId);
    });
  }, [fetchNotifications]);
  console.log("Parent notifications:", notifications);
  const emergencyNoti = notifications.find(
    (n) =>
      n.type === "MEDICAL_EVENT" &&
      (
        n.notes?.toLowerCase().includes("khẩn") ||
        n.notes?.toLowerCase().includes("cao") ||
        n.content?.toLowerCase().includes("khẩn") ||
        n.content?.toLowerCase().includes("cao")
      )
  );

  return (
    <header className="...">
      {/* ... existing code ... */}
      <div className="flex items-center gap-4">
        {/* ... các nút khác ... */}
        <button className="relative">
          <span role="img" aria-label="bell">🔔</span>
          {emergencyNoti && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full px-2 py-0.5 animate-pulse">
              🚨 KHẨN CẤP
            </span>
          )}
        </button>
      </div>
      {/* ... existing code ... */}
    </header>
  );
} 