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
  const { staffs,fetchStaffs } = useStaffStore(); // danh sách staff// tài khoản đã đăng nhập (parent)
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
      if (end <= start) {
        setError("Ngày kết thúc phải sau ngày bắt đầu!");
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
    <form className="space-y-3" onSubmit={handleSubmit}>
      <div>
        <label className="block font-medium mb-1">Tên đơn thuốc</label>
        <Input name="name" value={form.name} onChange={handleChange} required />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block font-medium mb-1">Ngày bắt đầu</label>
          <Input
            type="date"
            name="date"
            value={form.date?.slice(0, 10) || ""}
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Ngày kết thúc</label>
          <Input
            type="date"
            name="end_at"
            value={form.end_at?.slice(0, 10) || ""}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block font-medium mb-1">Tổng số liều</label>
          <Input
            type="number"
            name="total"
            value={form.total}
            min={1}
            onChange={handleChange}
            required
          />
        </div>
        {/* Ẩn trường chọn trạng thái, luôn là chờ duyệt */}
        {/*
        <div>
          <label className="block font-medium mb-1">Trạng thái</label>
          <Select
            value={form.status}
            onValueChange={(v) => handleSelect("status", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Chờ duyệt</SelectItem>
              <SelectItem value="completed">Hoàn thành</SelectItem>
              <SelectItem value="cancelled">Đã hủy</SelectItem>
            </SelectContent>
          </Select>
        </div>
        */}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block font-medium mb-1">Liều/lần</label>
          <Input
            name="per_dose"
            value={form.per_dose}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Số lần/ngày</label>
          <Input
            name="per_day"
            value={form.per_day}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <div>
        <label className="block font-medium mb-1">Lý do</label>
        <Input name="reason" value={form.reason} onChange={handleChange} />
      </div>
      <div>
        <label className="block font-medium mb-1">Ghi chú</label>
        <Textarea name="note" value={form.note} onChange={handleChange} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block font-medium mb-1">Học sinh</label>
          <Select
            value={form.student}
            onValueChange={(v) => handleSelect("student", v)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn học sinh" />
            </SelectTrigger>
            <SelectContent>
              {studentsData.map((s) => (
                <SelectItem key={s.student._id} value={s.student._id}>
                  {s.student.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block font-medium mb-1">Thuốc</label>
          <Select
            value={form.medicine}
            onValueChange={(v) => handleSelect("medicine", v)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn thuốc" />
            </SelectTrigger>
            <SelectContent>
              {medications.map((m) => (
                <SelectItem key={m._id} value={m._id}>
                  {m.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block font-medium mb-1">Nhân viên</label>
          <Select
            value={form.staff}
            onValueChange={(v) => handleSelect("staff", v)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn nhân viên" />
            </SelectTrigger>
            <SelectContent>
              {staffs.map((s) => (
                <SelectItem key={s._id} value={s._id}>
                  {s.profile?.name || "Không rõ"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="pt-2 flex justify-end">
        <Button
          type="submit"
          disabled={loading}
          className="bg-blue-700 text-white hover:bg-blue-800 font-semibold"
        >
          {loading ? "Đang lưu..." : "Lưu đơn thuốc"}
        </Button>
      </div>
      {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
    </form>
  );
}
