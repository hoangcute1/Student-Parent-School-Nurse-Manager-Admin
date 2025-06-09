export interface Parent {
  name: string;
  phone: string;
  address: string;
  email: string;
  createdAt: string;
}

export interface ParentResponse {
  data: Parent[];
  total: number;
  page: number;
  limit: number;
}

export interface ApiParent {
  _id: string;
  name: string;
  phone?: string;
  address?: string;
  email?: string;
  createdAt: string;
}

export interface DisplayParent {
  name: string;
  phone: string;
  address: string;
  email: string;
  createdAt: string;
}

