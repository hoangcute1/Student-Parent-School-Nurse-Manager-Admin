"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getNotificationsByParentId,
  markNotificationAsRead,
} from "@/lib/api/notification";
import { getParentId } from "@/lib/utils/parent-utils";

export default function TestNotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const parentId = await getParentId();
      console.log("Parent ID:", parentId);

      const data = await getNotificationsByParentId(parentId);
      console.log("Fetched notifications:", data);
      setNotifications(data || []);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError("Không thể tải thông báo");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      console.log("Marking as read:", notificationId);
      await markNotificationAsRead(notificationId);
      console.log("Successfully marked as read");

      // Refresh data
      await fetchNotifications();
    } catch (err) {
      console.error("Error marking as read:", err);
      setError("Không thể đánh dấu đã đọc");
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Test Notifications API</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button onClick={fetchNotifications} disabled={loading}>
              {loading ? "Loading..." : "Refresh Notifications"}
            </Button>

            {error && (
              <div className="text-red-500 p-4 bg-red-50 rounded">{error}</div>
            )}

            <div className="space-y-2">
              <h3 className="font-semibold">
                Notifications ({notifications.length})
              </h3>
              {notifications.map((notification) => (
                <div key={notification._id} className="p-4 border rounded">
                  <div className="flex justify-between items-start">
                    <div>
                      <p>
                        <strong>Type:</strong> {notification.type}
                      </p>
                      <p>
                        <strong>Content:</strong> {notification.content}
                      </p>
                      <p>
                        <strong>Is Read:</strong>{" "}
                        {notification.isRead ? "Yes" : "No"}
                      </p>
                      <p>
                        <strong>ID:</strong> {notification._id}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <Button
                        size="sm"
                        onClick={() => handleMarkAsRead(notification._id)}
                      >
                        Mark as Read
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
