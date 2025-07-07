import { useState, useEffect, useCallback } from 'react';
import { getAllStudents } from '@/lib/api/student';
import { Student } from '@/lib/type/students';
import { useToast } from '@/hooks/use-toast';

interface UseStudentsReturn {
  students: Student[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  isInitialLoading: boolean;
}

export function useStudents(): UseStudentsReturn {
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const fetchStudents = useCallback(async (showToast = false) => {
    try {
      setLoading(true);
      setError(null);

      const data = await getAllStudents();
      console.log("Students fetched successfully:", data);
      setStudents(data);

      // Show success toast only on manual retry
      if (showToast) {
        toast({
          title: "Thành công",
          description: `Đã tải ${data.length} sinh viên`,
          variant: "default",
        });
      }
    } catch (error: any) {
      const errorMessage = error?.message || "Không thể tải danh sách sinh viên";
      console.error("Error fetching students:", error);
      setError(errorMessage);
      setStudents([]);

      // Show error toast
      toast({
        title: "Lỗi",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setIsInitialLoading(false);
    }
  }, [toast]);

  const refetch = useCallback(() => fetchStudents(true), [fetchStudents]);

  // Chỉ chạy một lần khi component mount
  useEffect(() => {
    fetchStudents(false);
  }, []); // Empty dependency array để chỉ chạy một lần

  return {
    students,
    loading,
    error,
    refetch,
    isInitialLoading,
  };
}
