import { useAuthStore } from "@/stores/auth-store";
import { getAllParents } from "../api/parent";
import { useState, useEffect } from "react";

/**
 * Lấy parent ID từ auth store
 * @returns string | null - Parent ID hoặc null nếu không tìm thấy
 */
export const getParentId = async (): Promise<string> => {
  const { user, profile } = useAuthStore.getState();
  console.log("user", user);
  console.log("profile", profile);

  try {
    // Gọi API lấy danh sách parent
    const data = await getAllParents();
    console.log("Parents data:", data);

    // Tìm parent có user._id trùng với user hiện tại
    const userAny = user as any;
    const foundParent = data.find((parent) => parent.user._id === userAny?._id);

    if (foundParent) {
      console.log("Found parent ID:", foundParent._id);
      return foundParent._id;
    }

    console.warn("No parent ID found in parents list");
    return "";
  } catch (error) {
    console.error("Error fetching parents:", error);
    return "";
  }
};

/**
 * Hook để lấy parent ID trong React component
 * @returns { parentId: string | null, loading: boolean }
 */
export const useParentId = () => {
  const [parentId, setParentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    if (user?.role === "parent") {
      setLoading(true);
      getParentId()
        .then((id) => {
          setParentId(id);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching parent ID:", error);
          setParentId(null);
          setLoading(false);
        });
    } else {
      setParentId(null);
      setLoading(false);
    }
  }, [user]);

  return { parentId, loading };
};

/**
 * Hàm đồng bộ để lấy parent ID (không gọi API)
 * Chỉ lấy từ data có sẵn trong auth store
 */
export const getParentIdSync = (): string | null => {
  const { user } = useAuthStore.getState();

  if (user?.role !== "parent") {
    return null;
  }

  const userAny = user as any;

  // Trả về user._id nếu có
  if (userAny?._id) {
    return userAny._id;
  }

  return null;
};

/**
 * Kiểm tra xem user hiện tại có phải là parent không
 * @returns boolean
 */
export const isParentUser = (): boolean => {
  const { user } = useAuthStore.getState();
  return user?.role === "parent";
};

/**
 * Hook để kiểm tra xem user hiện tại có phải là parent không
 * @returns boolean
 */
export const useIsParent = (): boolean => {
  const { user } = useAuthStore();
  return user?.role === "parent";
};
