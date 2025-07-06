import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { useMedicationStore } from "@/stores/medication-store";
import { useStaffStore } from "@/stores/staff-store";

// TODO: Replace with real data from API/store

const getToday = () => {
  const d = new Date();
  return d.toISOString().slice(0, 10); // yyyy-MM-dd
};

export default function AddMedicineDeliveryForm() {
  const { addMedicineDelivery } = useMedicineDeliveryStore();
  const { studentsData } = useParentStudentsStore(); // danh sách học sinh của tài khoản này
  const { medications, fetchMedications } = useMedicationStore(); // tất cả thuốc trong kho
  const { staffs, fetchStaffs } = useStaffStore(); // danh sách staff// tài khoản đã đăng nhập (parent)
  const [form, setForm] = useState<CreateMedicineDelivery>({
    name: "",
    date: getToday(),
    total: 1,
    status: "pending",
    per_dose: "",
    per_day: "",
    note: "",
    reason: "",
    end_at: "",
    student: "",
    parent: "",
    medicine: "",
    staff: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
    if (!form.date || !form.parent) {
      setError("Vui lòng chọn học sinh và ngày bắt đầu!");
      setLoading(false);
      return;
    }
    if (form.end_at) {
      const start = new Date(form.date);
      const end = new Date(form.end_at);
      if (end < start) {
        setError("Ngày kết thúc phải bằng hoặc sau ngày bắt đầu!");
        setLoading(false);
        return;
      }
    }
    try {
      // Chuyển date và end_at sang ISO string
      const payload = {
        ...form,
        status: "pending" as const, // luôn là chờ duyệt, đúng type
        date: form.date ? new Date(form.date).toISOString() : "",
        end_at: form.end_at ? new Date(form.end_at).toISOString() : undefined,
      };
      await addMedicineDelivery(payload);
      setForm({
        name: "",
        date: getToday(),
        total: 1,
        status: "pending",
        per_dose: "",
        per_day: "",
        note: "",
        reason: "",
        end_at: "",
        student: "",
        parent: "",
        medicine: "",
        staff: "",
      });
      alert("Thêm đơn thuốc thành công!");
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  // Lấy danh sách thuốc khi mở dialog nếu chưa có
  useEffect(() => {
    if (!medications || medications.length === 0) {
      fetchMedications();
    }
  }, [medications, fetchMedications]);

  // Lấy danh sách staff khi mở dialog nếu chưa có
  useEffect(() => {
    if (!staffs || staffs.length === 0) {
      fetchStaffs();
    }
  }, [staffs, fetchStaffs]);

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

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="block text-sky-800 font-semibold text-sm">
              Ngày bắt đầu
            </label>
            <Input
              type="date"
              name="date"
              value={form.date?.slice(0, 10) || ""}
              onChange={handleChange}
              required
              className="border-sky-200 focus:border-sky-400 focus:ring-sky-200 rounded-lg"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sky-800 font-semibold text-sm">
              Ngày kết thúc
            </label>
            <Input
              type="date"
              name="end_at"
              value={form.end_at?.slice(0, 10) || ""}
              onChange={handleChange}
              className="border-sky-200 focus:border-sky-400 focus:ring-sky-200 rounded-lg"
            />
          </div>
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
              required
              className="border-sky-200 focus:border-sky-400 focus:ring-sky-200 rounded-lg"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sky-800 font-semibold text-sm">
            Số lần/ngày
          </label>
          <Input
            name="per_day"
            value={form.per_day}
            onChange={handleChange}
            required
            className="border-sky-200 focus:border-sky-400 focus:ring-sky-200 rounded-lg"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sky-800 font-semibold text-sm">
            Lý do
          </label>
          <Input
            name="reason"
            value={form.reason}
            onChange={handleChange}
            className="border-sky-200 focus:border-sky-400 focus:ring-sky-200 rounded-lg"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sky-800 font-semibold text-sm">
            Ghi chú
          </label>
          <Textarea
            name="note"
            value={form.note}
            onChange={handleChange}
            className="border-sky-200 focus:border-sky-400 focus:ring-sky-200 rounded-lg min-h-[80px]"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
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
              Thuốc
            </label>
            <Select
              value={form.medicine}
              onValueChange={(v) => handleSelect("medicine", v)}
              required
            >
              <SelectTrigger className="border-sky-200 focus:border-sky-400 focus:ring-sky-200 rounded-lg">
                <SelectValue placeholder="Chọn thuốc" />
              </SelectTrigger>
              <SelectContent className="rounded-lg border-sky-200">
                {medications.map((m) => (
                  <SelectItem
                    key={m._id}
                    value={m._id}
                    className="hover:bg-sky-50"
                  >
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sky-800 font-semibold text-sm">
            Nhân viên
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
