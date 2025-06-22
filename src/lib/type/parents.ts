import { ParentFormValues } from "@/app/cms/manage-parents/_components/add-parent-dialog";
import { User, UserProfile } from "./users";

interface Parent {
  _id: string;
  user: User;
  profile: UserProfile;
}

interface ParentAccount extends User {}
interface ParentProfile extends UserProfile {}
interface ParentsTableRow {
  data: ParentAccount[];
  total: number;
  page: number;
  limit: number;
}
interface ParentStore {
  parents: Parent[];
  isLoading: boolean;
  error: string | null;
  fetchParents: () => Promise<void>;
  addParent: (data: ParentFormValues) => Promise<void>;
}

interface GetAllParentsResponse {
  data: Parent[];
  total: number;
  page: number;
  limit: number;
}

interface UpdateParentForm
  extends Partial<
    Omit<ParentAccount & ParentProfile, "_id" | "created_at" | "updated_at">
  > {}
interface UpdateParentResponse {
  message: string;
  email: string;
}
export type {
  Parent,
  ParentAccount,
  ParentProfile,
  ParentsTableRow,
  ParentStore,
  GetAllParentsResponse,
  UpdateParentResponse,
  UpdateParentForm,
};
