import { TreatmentHistory } from "../type/treatment-history";
import { getParentId } from "../utils/parent-utils";
import { getAuthToken } from "./auth/token";
import { createNotification } from "./notification";
import { getStudentWithParent } from "./student/index";

/**
 * Gửi yêu cầu tạo mới một treatment history (sự kiện y tế)
 * @param data - Dữ liệu sự cố y tế cần tạo
 * @returns Promise<TreatmentHistory>
 */
export const createTreatmentHistory = async (
  data: Partial<TreatmentHistory>
) => {
  const token = getAuthToken();
  console.log("Creating treatment history with data:", data); // log dữ liệu để kiểm tra
  console.log("Token to create treatment history:", token); // dùng chung 1 hàm

  const res = await fetch("http://localhost:3001/treatment-histories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || `HTTP ${res.status}`);
  }

  const createdEvent = await res.json();

  // Tạo notification cho phụ huynh sau khi tạo sự kiện thành công
  try {
    const studentId =
      typeof data.student === "string" ? data.student : data.student?._id;

    if (studentId) {
      // Lấy thông tin student với parent
      const studentWithParent = await getStudentWithParent(studentId);
      console.log("Student with parent data:", studentWithParent);

      // Tìm parent ID từ student data
      const parentId =
        studentWithParent?.parent?._id || studentWithParent?.parent;

      if (parentId) {
        // Tạo notification cho phụ huynh
        await createNotification({
          parent: parentId,
          student: studentId,
          content: `Sự kiện y tế mới: ${data.title}`,
          notes: `Đã tạo sự kiện y tế mới cho học sinh. Mức độ ưu tiên: ${data.priority}. Vị trí: ${data.location}. Mô tả: ${data.description}`,
          type: "MEDICAL_EVENT",
          relatedId: createdEvent._id,
        });

        console.log("Notification created successfully for medical event");
      } else {
        console.warn("Parent ID not found for student:", studentId);
      }
    }
  } catch (notificationError) {
    console.error("Error creating notification:", notificationError);
    // Không throw error để không ảnh hưởng đến việc tạo treatment history
  }

  return createdEvent;
};

export const getAllTreatmentHistories = async () => {
  const token = getAuthToken();
  console.log("Token:", token);
  const res = await fetch("http://localhost:3001/treatment-histories", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(await res.text()); // ← err.message có nội dung server trả về

  const data = await res.json();
  // Thêm createdAt vào các trường hợp thiếu
  const processedData = data.map((item: TreatmentHistory) => ({
    ...item,
    createdAt: item.createdAt || new Date().toISOString(),
  }));

  console.log("Treatment histories fetched:", processedData);
  return processedData;
};

/**
 * Cập nhật treatment history theo ID
 * @param id - ID của treatment history cần cập nhật
 * @param data - Dữ liệu cần cập nhật
 * @returns Promise<TreatmentHistory>
 */
export const updateTreatmentHistory = async (
  id: string,
  data: Partial<TreatmentHistory>
) => {
  const token = getAuthToken();
  console.log("Updating treatment history with ID:", id, "Data:", data);
  console.log("Token to update treatment history:", token);

  const res = await fetch(
    `http://localhost:3001/treatment-histories/${id}`, // ✅ Sửa tại đây
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || `HTTP ${res.status}`);
  }
  return res.json();
};


/**
 * Lấy treatment history theo parent ID
 * @param parentId - ID của phụ huynh
 * @returns Promise<TreatmentHistory[]>
 */
export const getTreatmentHistoryByParentId = async (parentId: string) => {
  const token = getAuthToken();
  console.log("Getting treatment history for parent ID:", parentId);
  console.log("Token:", token);

  const res = await fetch(
    `http://localhost:3001/treatment-histories/parent/${parentId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || `HTTP ${res.status}`);
  }
  return res.json();
};

/**
 * Lấy treatment history cho parent hiện tại (từ auth store)
 * @returns Promise<TreatmentHistory[]>
 */
export const getCurrentParentTreatmentHistory = async () => {
  const parentId = await getParentId();
  if (!parentId) {
    throw new Error(
      "Không tìm thấy thông tin phụ huynh hoặc bạn không có quyền truy cập."
    );
  }

  return getTreatmentHistoryByParentId(parentId);
};
