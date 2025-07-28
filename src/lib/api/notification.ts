import { fetchData } from "./api";
import { getAuthToken } from "./auth/token";

/**
 * Tạo notification mới cho phụ huynh
 * @param data - Dữ liệu notification
 * @returns Promise<any>
 */
export const createNotification = async (data: {
  parent: string;
  student: string;
  content: string;
  notes: string;
  type: string;
  relatedId?: string;
  consultation_staff_id?: string; // Thêm trường này
}) => {
  const token = getAuthToken();
  console.log("Creating notification with data:", data);

  const res = await fetchData<any>("/simple-notifications", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return res;
};

/**
 * Lấy danh sách notifications theo parent ID
 * @param parentId - ID của phụ huynh
 * @returns Promise<any[]>
 */
export const getNotificationsByParentId = async (parentId: string) => {
  const token = getAuthToken();
  console.log("Getting notifications for parent ID:", parentId);

  const res = await fetchData<any>(`/simple-notifications/parent/${parentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return res;
};

/**
 * Lấy tất cả notifications (cho admin/staff)
 * @returns Promise<any[]>
 */
export const getAllNotifications = async () => {
  const token = getAuthToken();
  console.log("Getting all notifications");

  const res = await fetchData<any>("/simple-notifications", {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return res;
};

/**
 * Đánh dấu notification đã đọc
 * @param id - ID của notification
 * @returns Promise<any>
 */
export const markNotificationAsRead = async (id: string) => {
  const token = getAuthToken();
  console.log("Marking notification as read:", id);

  const res = await fetchData<any>(`/simple-notifications/${id}/read`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return res;
};
