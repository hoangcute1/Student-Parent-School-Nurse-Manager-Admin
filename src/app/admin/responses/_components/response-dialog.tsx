"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface ResponseDialogProps {
  title: string;
  description: string;
  onSubmit: (response: string) => Promise<void>;
}

export function ResponseDialog({
  title,
  description,
  onSubmit,
}: ResponseDialogProps) {
  const [open, setOpen] = useState(false);
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      await onSubmit(response);
      setOpen(false);
      setResponse("");
    } catch (error) {
      console.error("Failed to submit response:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white shadow-lg transition-all duration-300"
        >
          Phản hồi
        </Button>
      </DialogTrigger>
      <DialogContent className="border-sky-200 bg-white/95 backdrop-blur-sm">
        <DialogHeader className="border-b border-sky-100 pb-4">
          <DialogTitle className="text-sky-800 text-lg font-semibold">
            {title}
          </DialogTitle>
          <DialogDescription className="text-sky-600">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Textarea
            placeholder="Nhập nội dung phản hồi..."
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            className="min-h-[120px] border-sky-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 rounded-lg transition-all duration-200"
          />
        </div>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isLoading}
            className="border-sky-200 hover:bg-sky-50 transition-all duration-200"
          >
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white shadow-lg transition-all duration-300"
            disabled={isLoading || !response.trim()}
          >
            {isLoading ? "Đang gửi..." : "Gửi phản hồi"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
