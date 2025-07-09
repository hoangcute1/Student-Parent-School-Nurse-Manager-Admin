export interface Notification {
  _id: string;
  parent:
    | string
    | {
        _id: string;
        name: string;
        email: string;
        phone?: string;
      };
  student:
    | string
    | {
        _id: string;
        name: string;
        studentId: string;
        class?: string;
      };
  content: string;
  notes: string;
  type: string;
  relatedId?: string;
  isRead?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
