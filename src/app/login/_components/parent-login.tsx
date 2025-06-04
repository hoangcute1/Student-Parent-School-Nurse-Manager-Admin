"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/components/ui/use-toast";

export function ParentLoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ thông tin");
      setLoading(false);
      return;
    }

    try {
      // Mô phỏng API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email === "parent@example.com" && password === "password") {
        toast({
          title: "Đăng nhập thành công",
          description: "Chào mừng bạn quay trở lại!",
        });
        router.push("/dashboard");
      } else {
        setError("Email hoặc mật khẩu không chính xác");
      }
    } catch (err) {
      setError("Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="parent-email">Email phụ huynh</Label>
        <Input
          ref={emailRef}
          id="parent-email"
          type="email"
          placeholder="name@example.com"
          required
          className="border-blue-100 focus-visible:ring-blue-400"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="parent-password">Mật khẩu</Label>
        <Input
          ref={passwordRef}
          id="parent-password"
          type="password"
          required
          className="border-blue-100 focus-visible:ring-blue-400"
        />
      </div>

      <Button 
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        disabled={loading}
      >
        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
      </Button>
    </form>
  );
}
