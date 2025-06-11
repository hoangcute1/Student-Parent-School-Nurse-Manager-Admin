import { CheckCircle, AlertTriangle, Clock } from "lucide-react";

export interface Notification {
  id: number;
  title: string;
  target: string;
  checkupDate: string;
  sentDate: string;
  status: "Đã gửi" | "Đã lên lịch" | "Bản nháp";
  responses: number;
  totalRecipients: number;
}

export interface CheckupSchedule {
  grade: string;
  period: string;
  date: string;
  location: string;
  status: "Hoàn thành" | "Đang tiến hành" | "Chưa bắt đầu";
  notified: number;
  total: number;
}

export interface ResponseStat {
  label: string;
  description: string;
  value: string;
  percentage: number;
  icon: any;
}

export interface ChannelEffectiveness {
  name: string;
  rate: number;
  sent: number;
  responses: number;
}

export interface NotificationResponse {
  studentName: string;
  class: string;
  parentName: string;
  status: "Đồng ý" | "Từ chối" | "Chưa phản hồi";
  responseTime: string;
  note: string;
}

export const notificationsList: Notification[] = [
  {
    id: 1,
    title: "Khám sức khỏe định kỳ học kỳ I",
    target: "Khối lớp 1",
    checkupDate: "25/12/2024",
    sentDate: "18/12/2024",
    status: "Đã gửi",
    responses: 45,
    totalRecipients: 50,
  },
  {
    id: 2,
    title: "Khám răng miệng định kỳ",
    target: "Tất cả học sinh",
    checkupDate: "30/12/2024",
    sentDate: "20/12/2024",
    status: "Đã gửi",
    responses: 180,
    totalRecipients: 250,
  },
  {
    id: 3,
    title: "Khám mắt cho học sinh cận thị",
    target: "Học sinh có vấn đề về mắt",
    checkupDate: "28/12/2024",
    sentDate: "Chưa gửi",
    status: "Bản nháp",
    responses: 0,
    totalRecipients: 25,
  },
];

export const checkupSchedule: CheckupSchedule[] = [
  {
    grade: "Khối lớp 1",
    period: "Học kỳ I",
    date: "25/12/2024",
    location: "Phòng y tế trường",
    status: "Đang tiến hành",
    notified: 45,
    total: 50,
  },
  {
    grade: "Khối lớp 2",
    period: "Học kỳ I",
    date: "26/12/2024",
    location: "Phòng y tế trường",
    status: "Chưa bắt đầu",
    notified: 0,
    total: 55,
  },
  {
    grade: "Khối lớp 3",
    period: "Học kỳ I",
    date: "20/12/2024",
    location: "Phòng y tế trường",
    status: "Hoàn thành",
    notified: 48,
    total: 48,
  },
];

export const responseStats: ResponseStat[] = [
  {
    label: "Đồng ý tham gia",
    description: "Phụ huynh đồng ý cho con khám",
    value: "195",
    percentage: 78,
    icon: CheckCircle,
  },
  {
    label: "Từ chối tham gia",
    description: "Phụ huynh từ chối hoặc có lý do",
    value: "25",
    percentage: 10,
    icon: AlertTriangle,
  },
  {
    label: "Chưa phản hồi",
    description: "Chưa nhận được phản hồi",
    value: "30",
    percentage: 12,
    icon: Clock,
  },
];

export const channelEffectiveness: ChannelEffectiveness[] = [
  { name: "SMS", rate: 85, sent: 250, responses: 213 },
  { name: "Thông báo trường", rate: 92, sent: 250, responses: 230 },
  { name: "Email", rate: 65, sent: 200, responses: 130 },
  { name: "Zalo", rate: 78, sent: 180, responses: 140 },
];

export const notificationResponses: NotificationResponse[] = [
  {
    studentName: "Nguyễn Văn An",
    class: "1A",
    parentName: "Nguyễn Thị B",
    status: "Đồng ý",
    responseTime: "19/12/2024 08:30",
    note: "Con em sẽ tham gia đầy đủ",
  },
  {
    studentName: "Trần Thị Bình",
    class: "1A",
    parentName: "Trần Văn C",
    status: "Từ chối",
    responseTime: "19/12/2024 10:15",
    note: "Con đang ốm, xin hoãn",
  },
  {
    studentName: "Lê Hoàng Cường",
    class: "1B",
    parentName: "Lê Thị D",
    status: "Đồng ý",
    responseTime: "19/12/2024 14:20",
    note: "Cảm ơn thông báo của trường",
  },
  {
    studentName: "Phạm Thị Dung",
    class: "1B",
    parentName: "Phạm Văn E",
    status: "Chưa phản hồi",
    responseTime: "",
    note: "",
  },
];
