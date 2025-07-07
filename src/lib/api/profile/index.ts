import { fetchData } from "../api";
import { UserProfile } from "@/lib/type/users";

// Lấy thông tin profile của user hiện tại
export const getMyProfile = async (): Promise<UserProfile> => {
  return await fetchData<UserProfile>("/profile/me");
};

// Cập nhật profile user hiện tại
export const updateMyProfile = async (data: Partial<UserProfile>): Promise<UserProfile> => {
  return await fetchData<UserProfile>("/profile/me", {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

// Cập nhật profile theo userId
export const updateProfileByUserId = async (userId: string, data: Partial<UserProfile>): Promise<UserProfile> => {
  return await fetchData<UserProfile>(`/profiles/user/${userId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};
