"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface OTPDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVerify: (otp: string) => Promise<void>;
  onResend: () => Promise<void>;
}

export function OTPDialog({
  open,
  onOpenChange,
  onVerify,
  onResend,
}: OTPDialogProps) {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError("Vui lòng nhập đủ 6 chữ số");
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      await onVerify(otp);
      // OTP verification successful will be handled by parent component
    } catch (err) {
      setError("Mã OTP không chính xác. Vui lòng thử lại.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    try {
      await onResend();
      toast({
        title: "Đã gửi lại mã OTP",
        description: "Vui lòng kiểm tra email của bạn",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Không thể gửi lại mã OTP",
        description: "Vui lòng thử lại sau ít phút",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Xác thực OTP</DialogTitle>
          <DialogDescription>
            Vui lòng nhập mã OTP 6 chữ số đã được gửi đến email của bạn.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <InputOTP
            maxLength={6}
            value={otp}
            onChange={(value) => {
              setOtp(value);
              setError(null);
            }}            render={({ slots }) => (
              <InputOTPGroup className="gap-2">
                {slots.map((slot, idx) => (
                  <InputOTPSlot key={idx} {...slot} />
                ))}
              </InputOTPGroup>
            )}
          />
        </div>

        <DialogFooter className="flex flex-col gap-2 sm:flex-row">
          <Button
            onClick={handleResend}
            variant="outline"
            className="w-full sm:w-auto"
          >
            Gửi lại mã
          </Button>
          <Button
            onClick={handleVerify}
            className="w-full sm:w-auto"
            disabled={isVerifying}
          >
            {isVerifying ? "Đang xác thực..." : "Xác thực"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
