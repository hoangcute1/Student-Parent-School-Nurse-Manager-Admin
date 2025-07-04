"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Edit } from "lucide-react";
import { useFeedbackStore } from "@/stores/feedback-store";
import { toast } from "@/components/ui/use-toast";

interface EditResponseDialogProps {
  feedbackId: string;
  currentResponse: string;
  onSuccess?: () => void;
}

export function EditResponseDialog({
  feedbackId,
  currentResponse,
  onSuccess,
}: EditResponseDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [response, setResponse] = useState(currentResponse);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { updateFeedbackResponse } = useFeedbackStore();

  const handleSubmit = async () => {
    if (!response.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập nội dung phản hồi",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Use default staff ID for testing
      await updateFeedbackResponse(feedbackId, {
        response: response.trim(),
        responderId: "684d08d98e8c9994a5e1ff43", // Staff ID
      });

      toast({
        title: "Thành công",
        description: "Phản hồi đã được cập nhật",
      });

      setIsOpen(false);
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật phản hồi. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="text-blue-600 border-blue-600 hover:bg-blue-50"
        >
          <Edit className="h-4 w-4 mr-1" />
          Chỉnh sửa
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-blue-800">
            Chỉnh sửa phản hồi
          </DialogTitle>
          <DialogDescription>
            Cập nhật nội dung phản hồi của bạn cho feedback này.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Nội dung phản hồi
            </label>
            <Textarea
              placeholder="Nhập phản hồi cập nhật..."
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              className="min-h-[120px] resize-none"
              disabled={isSubmitting}
            />
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !response.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? "Đang cập nhật..." : "Cập nhật"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
