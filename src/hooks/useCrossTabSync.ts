import { useEffect } from "react";
import { useMedicationStore } from "@/stores/medication-store";
import { useExportHistoryStore } from "@/stores/export-history-store";

/**
 * Hook để đồng bộ dữ liệu giữa các tabs/pages
 */
export const useCrossTabSync = () => {
  const { fetchMedications } = useMedicationStore();

  useEffect(() => {
    // Lắng nghe sự kiện medication export từ các tab khác
    const handleMedicationExported = (event: CustomEvent) => {
      console.log(
        "🔄 [CROSS-TAB SYNC] Medication exported event received:",
        event.detail
      );
      // Refetch medications để cập nhật số lượng
      fetchMedications().catch(console.error);
    };

    // Lắng nghe sự kiện export history update từ các tab khác
    const handleExportHistoryUpdated = (event: CustomEvent) => {
      console.log(
        "📋 [CROSS-TAB SYNC] Export history updated event received:",
        event.detail
      );
      // Force refresh export history để trigger re-render
      useForceRefresh();
    };

    // Lắng nghe storage events (khi localStorage thay đổi từ tab khác)
    const handleStorageChange = (event: StorageEvent) => {
      if (
        event.key === "medication-storage" ||
        event.key === "export-history-storage"
      ) {
        console.log("💾 [CROSS-TAB SYNC] Storage changed:", event.key);
        // Refetch data khi storage thay đổi
        fetchMedications().catch(console.error);
      }
    };

    // Đăng ký event listeners
    if (typeof window !== "undefined") {
      window.addEventListener(
        "medication-exported",
        handleMedicationExported as EventListener
      );
      window.addEventListener(
        "export-history-updated",
        handleExportHistoryUpdated as EventListener
      );
      window.addEventListener("storage", handleStorageChange);
    }

    // Cleanup event listeners
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "medication-exported",
          handleMedicationExported as EventListener
        );
        window.removeEventListener(
          "export-history-updated",
          handleExportHistoryUpdated as EventListener
        );
        window.removeEventListener("storage", handleStorageChange);
      }
    };
  }, [fetchMedications, useForceRefresh]);
};

/**
 * Hook để force refresh dữ liệu
 */
export const useForceRefresh = () => {
  const { fetchMedications } = useMedicationStore();

  const forceRefresh = () => {
    fetchMedications().catch(console.error);
  };

  return { forceRefresh };
};
