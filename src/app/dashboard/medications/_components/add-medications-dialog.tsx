import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMedicineDeliveryStore } from "@/stores/medicine-delivery-store";
import { CreateMedicineDelivery } from "@/lib/type/medicine-delivery";
import { useParentStudentsStore } from "@/stores/parent-students-store";
import { useStaffStore } from "@/stores/staff-store";
import { useMedicationStore } from "@/stores/medication-store";

export default function AddMedicineDeliveryForm() {
  const { addManyMedicineDelivery } = useMedicineDeliveryStore();
  const { studentsData } = useParentStudentsStore(); // danh sách học sinh của tài khoản này
  const { staffs, fetchStaffs } = useStaffStore(); // danh sách staff
  const { medications, fetchMedications } = useMedicationStore(); // để lấy medicine ID
  const { fetchMedicineDeliveryByParentId } = useMedicineDeliveryStore();

  // State cho nhiều form
  const [forms, setForms] = useState([
    {
      name: "",
      total: 1,
      status: "pending",
      per_day: "",
      note: "",
      reason: "",
      student: "",
      parent: "",
      staff: "",
    },
  ]);
  const [medicineTimes, setMedicineTimes] = useState([
    { morning: false, noon: false, afternoon: false, evening: false },
  ]);
  const [nurseNotes, setNurseNotes] = useState([""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State cho chọn học sinh và nhân viên ngoài forms
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedStaff, setSelectedStaff] = useState("");

  // Handler cho từng form
  const handleFormChange = (idx: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForms((prev) => prev.map((f, i) => i === idx ? { ...f, [name]: value } : f));
  };
  const handleTimeChange = (idx: number, time: string, checked: boolean) => {
    setMedicineTimes((prev) => prev.map((t, i) => i === idx ? { ...t, [time]: checked } : t));
    // Update per_day
    const newTimes = { ...medicineTimes[idx], [time]: checked };
    const selectedTimes = Object.entries(newTimes)
      .filter(([_, isSelected]) => isSelected)
      .map(([time, _]) => {
        switch (time) {
          case "morning": return "Sáng";
          case "noon": return "Trưa";
          default: return "";
        }
      });
    setForms((prev) => prev.map((f, i) => i === idx ? { ...f, per_day: selectedTimes.join(", ") } : f));
  };
  const handleNurseNoteChange = (idx: number, value: string) => {
    setNurseNotes((prev) => prev.map((n, i) => i === idx ? value : n));
  };
  // Khi chọn học sinh ngoài form
  const handleSelectStudent = (studentId: string) => {
    setSelectedStudent(studentId);
    // Tìm parentId tương ứng với học sinh
    const selectedStudentObj = studentsData.find((s) => s.student._id === studentId);
    const parentId = selectedStudentObj?.parent?._id || "";
    setForms(prev => prev.map(f => ({ ...f, student: studentId, parent: parentId })));
  };
  // Khi chọn nhân viên ngoài form
  const handleSelectStaff = (staffId: string) => {
    setSelectedStaff(staffId);
    setForms(prev => prev.map(f => ({ ...f, staff: staffId })));
  };
  // Sửa handleAddForm để gán student/staff mặc định
  const handleAddForm = () => {
    setForms((prev) => [
      ...prev,
      {
        name: "",
        total: 1,
        status: "pending",
        per_day: "",
        note: "",
        reason: "",
        student: selectedStudent,
        parent: "",
        staff: selectedStaff,
      },
    ]);
    setMedicineTimes((prev) => [...prev, { morning: false, noon: false, afternoon: false, evening: false }]);
    setNurseNotes((prev) => [...prev, ""]);
  };

  const handleRemoveForm = (idx: number) => {
    setForms(prev => prev.filter((_, i) => i !== idx));
    setMedicineTimes(prev => prev.filter((_, i) => i !== idx));
    setNurseNotes(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Validate từng form
      for (let i = 0; i < forms.length; i++) {
        if (!selectedStudent) {
          setError(`Vui lòng chọn học sinh!`);
          setLoading(false);
          return;
        }
        if (!selectedStaff) {
          setError(`Vui lòng chọn nhân viên phụ trách!`);
          setLoading(false);
          return;
        }
        if (!forms[i].per_day) {
          setError(`Vui lòng chọn ít nhất một thời gian dùng thuốc cho đơn thứ ${i + 1}!`);
          setLoading(false);
          return;
        }
        if (!forms[i].reason || forms[i].reason.trim() === "") {
          setError(`Vui lòng nhập lý do sử dụng cho đơn thứ ${i + 1}!`);
          setLoading(false);
          return;
        }
      }
      // Đảm bảo medications đã được load
      if (!medications || medications.length === 0) {
        await fetchMedications();
      }
      // Chuẩn bị payloads
      const currentDate = new Date();
      const endDate = new Date();
      endDate.setDate(currentDate.getDate() + 7);
      let defaultMedicineId = "675d8a1b123456789abcdef0";
      if (medications && medications.length > 0) {
        defaultMedicineId = medications[0]._id;
      }
      const payloads = forms.map((form, idx) => ({
        student: selectedStudent,
        staff: form.staff,
        parent: form.parent || "",
        name: form.name,
        total: form.total,
        per_day: form.per_day,
        note: form.note + (nurseNotes[idx] ? `\n\n[Lưu ý cho y tá]:\n${nurseNotes[idx]}` : ""),
        reason: form.reason,
        status: "pending" as const,
        date: currentDate.toISOString(),
        // Không có end_at
      }));
      console.log('Payloads gửi lên:', payloads);
      await addManyMedicineDelivery(payloads);
      setForms([
        {
          name: "",
          total: 1,
          status: "pending",

          per_day: "",
          note: "",
          reason: "",
          student: "",
          parent: "",
          staff: "",
        },
      ]);
      setMedicineTimes([{ morning: false, noon: false, afternoon: false, evening: false }]);
      setNurseNotes([""]);
      setSelectedStudent("");
      setSelectedStaff("");
      alert("Thêm đơn thuốc thành công!");
      await fetchMedicineDeliveryByParentId();
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!staffs || staffs.length === 0) {
      fetchStaffs();
    }
    if (!medications || medications.length === 0) {
      fetchMedications();
    }
  }, [staffs, fetchStaffs, medications, fetchMedications]);

  // Thêm type cho medicineTimes
  type MedicineTimes = { morning: boolean; noon: boolean; };

  return (
    <div className="bg-gradient-to-br from-sky-50 to-blue-50 p-6 rounded-2xl">
      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Select học sinh ngoài forms.map */}
        <div className="space-y-2">
          <label className="block text-sky-800 font-semibold text-sm">Tên học sinh</label>
          <Select
            value={selectedStudent}
            onValueChange={handleSelectStudent}
            required
          >
            <SelectTrigger className="border-sky-200 focus:border-sky-400 focus:ring-sky-200 rounded-lg">
              <SelectValue placeholder="Chọn học sinh" />
            </SelectTrigger>
            <SelectContent className="rounded-lg border-sky-200">
              {studentsData.map((s) => (
                <SelectItem
                  key={s.student._id}
                  value={s.student._id}
                  className="hover:bg-sky-50"
                >
                  {s.student.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {forms.map((form, idx) => (
          <div key={idx} className="p-4 mb-4 rounded-xl border border-sky-200 bg-white shadow-sm space-y-4 relative">
            {/* Nút trừ ở góc phải trên */}
            {forms.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveForm(idx)}
                className="absolute top-2 right-2 p-1 group"
                title="Xoá đơn này"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 group-hover:text-sky-600 transition-colors duration-150">
                  <line x1="4" y1="4" x2="16" y2="16" />
                  <line x1="16" y1="4" x2="4" y2="16" />
                </svg>
              </button>
            )}
            {/* Khối thông tin đơn thuốc */}
            <div className="p-4 mt-2 mb-2 rounded-lg border border-sky-100 bg-sky-50 space-y-4">
              <div className="space-y-2">
                <label className="block text-sky-800 font-semibold text-sm">Tên đơn thuốc</label>
                <Input name="name" value={form.name} onChange={e => handleFormChange(idx, e)} required className="border-sky-200 focus:border-sky-400 focus:ring-sky-200 rounded-lg" />
              </div>
              <div className="space-y-2">
                <label className="block text-sky-800 font-semibold text-sm">Tổng số liều</label>
                <Input type="number" name="total" value={form.total} min={1} onChange={e => handleFormChange(idx, e)} required className="border-sky-200 focus:border-sky-400 focus:ring-sky-200 rounded-lg" />
              </div>
              <div className="space-y-2">
                <label className="block text-sky-800 font-semibold text-sm">Thời gian dùng thuốc trong ngày</label>
                <div className="grid grid-cols-2 gap-3 p-4 bg-white rounded-lg border border-sky-200">
                  {[
                    { key: "morning", label: "Sáng", time: "(6:00 - 10:00)" },
                    { key: "noon", label: "Trưa", time: "(11:00 - 13:00)" },
                  ].map((timeSlot) => (
                    <div key={timeSlot.key} className="flex items-center space-x-3">
                      <Checkbox
                        id={`${timeSlot.key}-${idx}`}
                        checked={medicineTimes[idx][timeSlot.key as keyof MedicineTimes]}
                        onCheckedChange={checked => handleTimeChange(idx, timeSlot.key, checked as boolean)}
                        className="border-sky-300 data-[state=checked]:bg-sky-500 data-[state=checked]:border-sky-500"
                      />
                      <label htmlFor={`${timeSlot.key}-${idx}`} className="text-sm font-medium text-sky-800 cursor-pointer flex flex-col">
                        <span>{timeSlot.label}</span>
                        <span className="text-xs text-sky-600">{timeSlot.time}</span>
                      </label>
                    </div>
                  ))}
                </div>
                {form.per_day && (
                  <div className="mt-2 p-2 bg-sky-100 rounded-lg">
                    <span className="text-sm text-sky-700 font-medium">Đã chọn: {form.per_day}</span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label className="block text-sky-800 font-semibold text-sm">Lý do sử dụng <span className="text-red-500">*</span></label>
                <Input
                  name="reason"
                  value={form.reason}
                  onChange={e => handleFormChange(idx, e)}
                  placeholder="Điều trị cảm lạnh, giảm đau..."
                  required
                  className="border-sky-200 focus:border-sky-400 focus:ring-sky-200 rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sky-800 font-semibold text-sm">👩‍⚕️ Lưu ý cho y tá</label>
                <Textarea
                  value={nurseNotes[idx]}
                  onChange={e => handleNurseNoteChange(idx, e.target.value)}
                  placeholder="Ghi rõ cách dùng\n(trước/sau ăn), liều lượng chính xác, triệu chứng cần theo dõi, số\nđiện thoại liên hệ khẩn cấp..."
                  className="border-sky-200 focus:border-sky-400 focus:ring-sky-200 rounded-lg min-h-[80px]"
                />
              </div>
              {/* Nút cộng nằm dưới lưu ý cho y tá */}
              {idx === forms.length - 1 && (
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={handleAddForm}
                    className="mt-2 bg-sky-100 hover:bg-sky-200 text-sky-600 rounded-full w-8 h-8 flex items-center justify-center shadow"
                  >
                    <span className="text-2xl font-bold">+</span>
                  </button>
                </div>
              )}


            </div>
          </div>
        ))}
        {/* Select nhân viên phụ trách ngoài forms.map */}
        <div className="space-y-2">
          <label className="block text-sky-800 font-semibold text-sm">Nhân viên phụ trách</label>
          <Select
            value={selectedStaff}
            onValueChange={handleSelectStaff}
            required
          >
            <SelectTrigger className="border-sky-200 focus:border-sky-400 focus:ring-sky-200 rounded-lg">
              <SelectValue placeholder="Chọn nhân viên" />
            </SelectTrigger>
            <SelectContent className="rounded-lg border-sky-200">
              {staffs.map((s) => (
                <SelectItem
                  key={s._id}
                  value={s._id}
                  className="hover:bg-sky-50"
                >
                  {s.profile?.name || "Không rõ"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
        )}
        <div className="pt-4 flex justify-end">
          <Button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold px-6 py-2 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl"
          >
            {loading ? "Đang lưu..." : "💾 Lưu đơn thuốc"}
          </Button>
        </div>
      </form>
    </div>
  );
}
