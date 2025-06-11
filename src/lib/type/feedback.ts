export interface Feedback {
  _id: string;
  childId: string;
  parent: string;
  title: string;
  description: string;
  response: string;
}

export interface FeedbackResponse {
  data: Feedback[];
  total: number;
}
