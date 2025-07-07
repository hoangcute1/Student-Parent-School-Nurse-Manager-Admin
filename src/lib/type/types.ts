






export interface Child {
  id: string;
  name: string;
  dob: string;
  gender: "male" | "female";
  grade: string;
  class: string;
  parentId: string;
  healthRecordId?: string;
  createdAt: string;
  updatedAt: string;
}
