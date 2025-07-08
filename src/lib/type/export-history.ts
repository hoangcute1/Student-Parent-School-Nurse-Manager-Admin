export interface ExportRecord {
  _id: string;
  medicationId: string;
  medicationName: string;
  quantity: number;
  unit: string;
  medicalStaffName: string;
  reason: string;
  exportDate: string;
  exportedBy?: string; // ID của người thực hiện xuất
}

export interface ExportHistoryFilter {
  dateFrom?: string;
  dateTo?: string;
  medicationName?: string;
  medicalStaffName?: string;
  limit?: number;
  offset?: number;
}
