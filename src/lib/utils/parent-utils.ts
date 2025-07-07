import { useAuthStore } from "@/stores/auth-store";

/**
 * Lấy parent ID từ auth store
 * @returns string | null - Parent ID hoặc null nếu không tìm thấy
 */
export const getParentId = (): string | null => {
  const { user, profile } = useAuthStore.getState();
  
  // Kiểm tra nếu user là parent
  if (user?.role !== 'parent') {
    console.warn('User is not a parent, cannot get parent ID');
    return null;
  }

  // Trả về user ID nếu user là parent
  if (user?.parent) {
    return user.parent._id || null;
  }


  console.warn('No parent ID found in user or profile');
  return null;
};

/**
 * Hook để lấy parent ID trong React component
 * @returns string | null - Parent ID hoặc null nếu không tìm thấy
 */
export const useParentId = (): string | null => {
  const { user, profile } = useAuthStore();
  
  // Kiểm tra nếu user là parent
  if (user?.role !== 'parent') {
    return null;
  }

  // Trả về user ID nếu user là parent
  if (user?.parent) {
    return user.parent._id || null;
  }

  return null;
};

/**
 * Kiểm tra xem user hiện tại có phải là parent không
 * @returns boolean
 */
export const isParentUser = (): boolean => {
  const { user } = useAuthStore.getState();
  return user?.role === 'parent';
};

/**
 * Hook để kiểm tra xem user hiện tại có phải là parent không
 * @returns boolean
 */
export const useIsParent = (): boolean => {
  const { user } = useAuthStore();
  return user?.role === 'parent';
};
