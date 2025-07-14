"use client";

import { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { RefreshCw, Bell } from 'lucide-react';
import { useTreatmentHistoryStore } from '@/stores/treatment-history-store';

interface TreatmentHistoryUpdateNotifierProps {
  onRefresh?: () => void;
  className?: string;
}

export const TreatmentHistoryUpdateNotifier = ({ 
  onRefresh, 
  className = "" 
}: TreatmentHistoryUpdateNotifierProps) => {
  const { lastUpdated, treatmentHistories } = useTreatmentHistoryStore();
  const [showNotification, setShowNotification] = useState(false);
  const [previousCount, setPreviousCount] = useState(0);

  useEffect(() => {
    // Kiểm tra nếu có thêm treatment history mới
    if (treatmentHistories.length > previousCount && previousCount > 0) {
      setShowNotification(true);
      
      // Tự động ẩn thông báo sau 5 giây
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
    
    setPreviousCount(treatmentHistories.length);
  }, [treatmentHistories.length, previousCount]);

  const handleRefresh = () => {
    setShowNotification(false);
    onRefresh?.();
  };

  if (!showNotification) {
    return null;
  }

  return (
    <Alert className={`mb-4 border-blue-200 bg-blue-50 ${className}`}>
      <Bell className="h-4 w-4 text-blue-600" />
      <AlertDescription className="text-blue-800">
        <div className="flex items-center justify-between">
          <span>Có cập nhật mới về lịch sử bệnh án!</span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="ml-2 h-8 px-3 text-blue-600 border-blue-300 hover:bg-blue-100"
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            Làm mới
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}; 