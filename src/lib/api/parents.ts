import { fetchData } from "./api";
import { Parent, ParentResponse } from "../../type/parents";

export const getParents = (
  page: number = 1,
  pageSize: number = 10
): Promise<ParentResponse> => {
  return fetchData<ParentResponse>(
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
// export const updateStudent = (
//   id: string,
//   data: Partial<Omit<StudentResponse, "_id" | "createdAt" | "updatedAt">>
// ): Promise<StudentResponse> => {
//   return fetchData<StudentResponse>(`/students/${id}`, {
//     method: "PUT",
//     body: JSON.stringify(data),
//   });
// };
export const deleteStudent = (id: string): Promise<void> => {
  return fetchData<void>(`/students/${id}`, {
    method: "DELETE",
  });
};
