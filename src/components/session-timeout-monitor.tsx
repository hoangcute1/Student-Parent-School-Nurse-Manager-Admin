import { useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

/**
 * SessionTimeoutMonitor: Tự động logout/chuyển hướng khi hết phiên đăng nhập (inactivity)
 * - Mặc định: 60 phút không hoạt động sẽ logout
 * - Có thể custom qua props
 * - Khi hết hạn sẽ hiện toast thông báo
 */
export default function SessionTimeoutMonitor({
  timeoutMinutes = 60,
  onTimeout,
}: {
  timeoutMinutes?: number;
  onTimeout?: () => void;
}) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const resetTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        toast({
          title: "Phiên đăng nhập đã hết hạn",
          description: "Bạn sẽ được chuyển về trang đăng nhập.",
          variant: "destructive",
        });
        setTimeout(() => {
          if (onTimeout) {
            onTimeout();
          } else {
            window.location.href = "/";
          }
        }, 2000); // Đợi 2s cho user đọc thông báo
      }, timeoutMinutes * 60 * 1000);
    };

    // Reset timer khi có hoạt động
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach((event) => window.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [timeoutMinutes, onTimeout, toast]);

  return null;
}
