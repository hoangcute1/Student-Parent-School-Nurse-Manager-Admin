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
  const { addMedicineDelivery } = useMedicineDeliveryStore();
  const { studentsData } = useParentStudentsStore(); // danh sách học sinh của tài khoản này
  const { staffs, fetchStaffs } = useStaffStore(); // danh sách staff
  const { medications, fetchMedications } = useMedicationStore(); // để lấy medicine ID
  const { fetchMedicineDeliveryByParentId } = useMedicineDeliveryStore();

  const [form, setForm] = useState<CreateMedicineDelivery>({
    name: "",
    total: 1,
    status: "pending",
    per_dose: "",
    per_day: "",
    note: "", // Thành phần thuốc
    reason: "",
    student: "",
    parent: "",
    staff: "",
  });

  // State for medicine times
  const [medicineTimes, setMedicineTimes] = useState({
    morning: false,
    noon: false,
    afternoon: false,
    evening: false,
  });

  // State for nurse note
  const [nurseNote, setNurseNote] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTimeChange = (time: string, checked: boolean) => {
    const newTimes = { ...medicineTimes, [time]: checked };
    setMedicineTimes(newTimes);

    // Update per_day based on selected times
    const selectedTimes = Object.entries(newTimes)
      .filter(([_, isSelected]) => isSelected)
      .map(([time, _]) => {
        switch (time) {
          case "morning":
            return "Sáng";
          case "noon":
            return "Trưa";
          case "afternoon":
            return "Chiều";
          case "evening":
            return "Tối";
          default:
            return "";
        }
      });

    setForm({ ...form, per_day: selectedTimes.join(", ") });
  };

  const handleSelect = (name: string, value: string) => {
    if (name === "student") {
      // Tìm parentId tương ứng với học sinh được chọn
      const selectedStudent = studentsData.find((s) => s.student._id === value);
      setForm({
        ...form,
        student: value,
        parent: selectedStudent?.parent?._id || "",
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    // Validate bắt buộc
    if (!form.parent) {
      setError("Vui lòng chọn học sinh!");
      setLoading(false);
      return;
    }

    if (!form.per_day) {
      setError("Vui lòng chọn ít nhất một thời gian dùng thuốc!");
      setLoading(false);
      return;
    }

    try {
      // Validate required fields before submission
      if (!form.reason || form.reason.trim() === "") {
        alert("Vui lòng nhập lý do sử dụng thuốc");
        return;
      }

      // Đảm bảo medications đã được load
      if (!medications || medications.length === 0) {
        console.log("Đang load danh sách thuốc...");
        await fetchMedications();
      }

      // Chuyển date sang ISO string
      const combinedNote =
        form.note + (nurseNote ? `\n\n[Lưu ý cho y tá]:\n${nurseNote}` : "");

      // Tạo dates mặc định
      const currentDate = new Date();
      const endDate = new Date();
      endDate.setDate(currentDate.getDate() + 7); // 7 ngày sau

      // Lấy medicine ID đầu tiên trong danh sách, hoặc tạo ObjectId mặc định
      let defaultMedicineId = "675d8a1b123456789abcdef0"; // ObjectId mặc định có format đúng

      if (medications && medications.length > 0) {
        defaultMedicineId = medications[0]._id;
      } else {
        // Nếu không có medicine nào, log warning
        console.warn(
          "Không có medicine nào trong hệ thống, sử dụng ID mặc định"
        );
      }

      const payload = {
        ...form,
        note: combinedNote,
        status: "pending" as const,
        // Thêm các trường bắt buộc cho backend với giá trị mặc định
        date: currentDate.toISOString(),
        end_at: endDate.toISOString(),
        medicine: defaultMedicineId,
      };
      console.log("Payload being sent:", payload);
      await addMedicineDelivery(payload);
      setForm({
        name: "",
        total: 1,
        status: "pending",
        per_dose: "",
        per_day: "",
        note: "",
        reason: "",
        student: "",
        parent: "",
        staff: "",
      });
      setMedicineTimes({
        morning: false,
        noon: false,
        afternoon: false,
        evening: false,
      });
      setNurseNote("");
      alert("Thêm đơn thuốc thành công!");
      await fetchMedicineDeliveryByParentId();
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  // Lấy danh sách staff khi mở dialog nếu chưa có
  useEffect(() => {
    if (!staffs || staffs.length === 0) {
      fetchStaffs();
    }
    if (!medications || medications.length === 0) {
      fetchMedications();
    }
  }, [staffs, fetchStaffs, medications, fetchMedications]);

  return (
    <div className="bg-gradient-to-br from-sky-50 to-blue-50 p-6 rounded-2xl">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="block text-sky-800 font-semibold text-sm">
            Tên đơn thuốc
          </label>
          <Input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="border-sky-200 focus:border-sky-400 focus:ring-sky-200 rounded-lg"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sky-800 font-semibold text-sm">
            Thành phần thuốc (Ghi chú)
          </label>
          <Textarea
            name="note"
            value={form.note}
            onChange={handleChange}
            placeholder="Mô tả thành phần, công dụng và cách sử dụng thuốc..."
            className="border-sky-200 focus:border-sky-400 focus:ring-sky-200 rounded-lg min-h-[80px]"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="block text-sky-800 font-semibold text-sm">
              Tổng số liều
            </label>
            <Input
              type="number"
              name="total"
              value={form.total}
              min={1}
              onChange={handleChange}
              required
              className="border-sky-200 focus:border-sky-400 focus:ring-sky-200 rounded-lg"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sky-800 font-semibold text-sm">
              Liều/lần
            </label>
            <Input
              name="per_dose"
              value={form.per_dose}
              onChange={handleChange}
              placeholder="1 viên, 5ml..."
              required
              className="border-sky-200 focus:border-sky-400 focus:ring-sky-200 rounded-lg"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sky-800 font-semibold text-sm">
            Thời gian dùng thuốc trong ngày
          </label>
          <div className="grid grid-cols-2 gap-3 p-4 bg-white rounded-lg border border-sky-200">
            {[
              { key: "morning", label: "Sáng", time: "(6:00 - 10:00)" },
              { key: "noon", label: "Trưa", time: "(11:00 - 13:00)" },
              { key: "afternoon", label: "Chiều", time: "(14:00 - 17:00)" },
              { key: "evening", label: "Tối", time: "(18:00 - 22:00)" },
            ].map((timeSlot) => (
              <div key={timeSlot.key} className="flex items-center space-x-3">
                <Checkbox
                  id={timeSlot.key}
                  checked={
                    medicineTimes[timeSlot.key as keyof typeof medicineTimes]
                  }
                  onCheckedChange={(checked) =>
                    handleTimeChange(timeSlot.key, checked as boolean)
                  }
                  className="border-sky-300 data-[state=checked]:bg-sky-500 data-[state=checked]:border-sky-500"
                />
                <label
                  htmlFor={timeSlot.key}
                  className="text-sm font-medium text-sky-800 cursor-pointer flex flex-col"
                >
                  <span>{timeSlot.label}</span>
                  <span className="text-xs text-sky-600">{timeSlot.time}</span>
                </label>
              </div>
            ))}
          </div>
          {form.per_day && (
            <div className="mt-2 p-2 bg-sky-100 rounded-lg">
              <span className="text-sm text-sky-700 font-medium">
                Đã chọn: {form.per_day}
              </span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sky-800 font-semibold text-sm">
            Lý do sử dụng <span className="text-red-500">*</span>
          </label>
          <Input
            name="reason"
            value={form.reason}
            onChange={handleChange}
            placeholder="Điều trị cảm lạnh, giảm đau..."
            required
            className="border-sky-200 focus:border-sky-400 focus:ring-sky-200 rounded-lg"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sky-800 font-semibold text-sm">
            Học sinh
          </label>
          <Select
            value={form.student}
            onValueChange={(v) => handleSelect("student", v)}
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

        <div className="space-y-2">
          <label className="block text-sky-800 font-semibold text-sm">
            Nhân viên phụ trách
          </label>
          <Select
            value={form.staff}
            onValueChange={(v) => handleSelect("staff", v)}
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

        <div className="space-y-2">
          <label className="block text-sky-800 font-semibold text-sm">
            👩‍⚕️ Lưu ý cho y tá
          </label>
          <Textarea
            value={nurseNote}
            onChange={(e) => setNurseNote(e.target.value)}
            placeholder="Ghi rõ cách dùng
            (trước/sau ăn), liều lượng chính xác, triệu chứng cần theo dõi, số
            điện thoại liên hệ khẩn cấp..."
            className="border-sky-200 focus:border-sky-400 focus:ring-sky-200 rounded-lg min-h-[80px]"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
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
