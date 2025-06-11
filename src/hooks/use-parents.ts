"use client";

import { useState, useCallback } from "react";
import { getParents, createParent } from "@/lib/api/parents";
import type { Parent as ApiParent } from "../type/parents";
import type { ParentFormValues } from "@/app/cms/manage-parents/_components/add-parent-dialog";

interface DisplayParent {
  name: string;
  phone: string;
  address: string;
  email: string;
  createdAt: string;
}

interface UseParentsReturn {
  parents: DisplayParent[];
  isLoading: boolean;
  error: string | null;
  fetchParents: () => Promise<void>;
  addParent: (data: ParentFormValues) => Promise<void>;
}

const mapToDisplayParent = (apiParent: ApiParent): DisplayParent => ({
  name: apiParent.name,
  phone: apiParent.phone || "N/A",
  address: apiParent.address || "N/A",
  email: apiParent.email || "N/A",
  createdAt: new Date(apiParent.createdAt).toLocaleDateString("vi-VN"),
});

export function useParents(): UseParentsReturn {
  const [parents, setParents] = useState<DisplayParent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchParents = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getParents();
      const parentsList = Array.isArray(data) ? data : data.data || [];
      setParents(parentsList.map(mapToDisplayParent));
    } catch (err: any) {
      setError(err.message);
      console.error("Failed to fetch parents:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addParent = useCallback(async (data: ParentFormValues) => {
    try {
      setIsLoading(true);
      setError(null);
      const newParent = await createParent(data);
      setParents((prev) => [...prev, mapToDisplayParent(newParent)]);
    } catch (err: any) {
      setError(err.message);
      console.error("Failed to create parent:", err);
      throw err; // Re-throw để component có thể handle error nếu cần
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    parents,
    isLoading,
    error,
    fetchParents,
    addParent,
  };
}
