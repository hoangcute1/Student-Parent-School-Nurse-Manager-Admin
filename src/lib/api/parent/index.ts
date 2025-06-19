import {
  GetAllParentsResponse,
  Parent,
  UpdateParentForm,
  UpdateParentResponse,
} from "@/lib/type/parents";
import { fetchData } from "../api";

export const getAllParents = (
  page: number = 1,
  pageSize: number = 10
): Promise<GetAllParentsResponse> => {
  return fetchData<GetAllParentsResponse>(
    `/parents?page=${page}&pageSize=${pageSize}`
  );
};

export const createParent = (
  data: Omit<Parent, "_id" | "createdAt" | "updatedAt">
): Promise<Parent> => {
  return fetchData<Parent>("/parents", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateParent = (
  id: string,
  data: UpdateParentForm
): Promise<UpdateParentResponse> => {
  return fetchData<UpdateParentResponse>(`/parents/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deleteParent = (id: string): Promise<void> => {
  return fetchData<void>(`/parents/${id}`, {
    method: "DELETE",
  });
};
