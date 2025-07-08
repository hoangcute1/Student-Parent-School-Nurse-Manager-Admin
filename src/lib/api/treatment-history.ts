import { TreatmentHistory } from "../type/treatment-history";
import { getParentId } from "../utils/parent-utils";
import { getAuthToken } from "./auth/token";

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
  return res.json();
};

export const getAllTreatmentHistories = async () => {
  const token = getAuthToken();
  console.log("Token:", token);
  const res = await fetch("http://[::1]:3001/treatment-histories", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(await res.text()); // ← err.message có nội dung server trả về
  return res.json();
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
    `http://localhost:3001/treatment-histories/${id}/status`,
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
