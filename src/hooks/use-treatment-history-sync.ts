import { useEffect, useCallback } from 'react';
import { useTreatmentHistoryStore } from '@/stores/treatment-history-store';
import { useParentId, useIsParent } from '@/lib/utils/parent-utils';

export const useTreatmentHistorySync = () => {
  const { parentId, loading: parentIdLoading } = useParentId();
  const isParent = useIsParent();
  
  const { 
    fetchAllTreatmentHistories,
    fetchTreatmentHistoryByParentId,
    lastUpdated 
  } = useTreatmentHistoryStore();

  // Auto refresh function
  const refreshData = useCallback(async () => {
    if (isParent && parentId && !parentIdLoading) {
      console.log("🔄 Auto refreshing treatment history for parent:", parentId);
      await fetchTreatmentHistoryByParentId(parentId);
    } else if (!isParent) {
      console.log("🔄 Auto refreshing all treatment histories");
      await fetchAllTreatmentHistories();
    }
  }, [isParent, parentId, parentIdLoading, fetchTreatmentHistoryByParentId, fetchAllTreatmentHistories]);

  // Set up auto refresh interval
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [refreshData]);

  // Manual refresh function
  const manualRefresh = useCallback(async () => {
    console.log("🔄 Manual refresh triggered");
    await refreshData();
  }, [refreshData]);

  return {
    refreshData,
    manualRefresh,
    lastUpdated,
    isParent,
    parentId,
    parentIdLoading
  };
}; 