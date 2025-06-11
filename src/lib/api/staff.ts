import { ApiStaff } from "../../type/staff";
import { fetchData } from "./api";

export const getStaffs = (): Promise<{ data: ApiStaff[]; total: number }> => {
  return fetchData<{ data: ApiStaff[]; total: number }>(`/staff`);
};

export const createStaff = (
  data: Omit<ApiStaff, "_id" | "createdAt">
): Promise<ApiStaff> => {
  return fetchData<ApiStaff>(`/staff`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};
