"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "sonner";
import {
  User,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
} from "lucide-react";

export default function AuthTestPage() {
  const { user, profile, isLoading, isAuthenticated, clearAuth } =
    useAuthStore();
  const [authStatus, setAuthStatus] = useState<
    "loading" | "success" | "error" | "timeout"
  >("loading");
  const [timeoutReached, setTimeoutReached] = useState(false);

  useEffect(() => {
    // Set timeout to check auth status
    const timer = setTimeout(() => {
      setTimeoutReached(true);
      if (isLoading) {
        setAuthStatus("timeout");
      }
    }, 10000); // 10 seconds

    return () => clearTimeout(timer);
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && user) {
        setAuthStatus("success");
      } else {
        setAuthStatus("error");
      }
    }
  }, [isLoading, isAuthenticated, user]);

  const handleClearAuth = () => {
    clearAuth();
    toast.success("Đã xóa thông tin xác thực");
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const getStatusIcon = () => {
    switch (authStatus) {
      case "loading":
        return <RefreshCw className="h-6 w-6 animate-spin text-blue-500" />;
      case "success":
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case "error":
        return <XCircle className="h-6 w-6 text-red-500" />;
      case "timeout":
        return <Clock className="h-6 w-6 text-orange-500" />;
      default:
        return <RefreshCw className="h-6 w-6 animate-spin text-blue-500" />;
    }
  };

  const getStatusText = () => {
    switch (authStatus) {
      case "loading":
        return "Đang tải thông tin xác thực...";
      case "success":
        return "Xác thực thành công";
      case "error":
        return "Lỗi xác thực";
      case "timeout":
        return "Timeout - Quá thời gian chờ";
      default:
        return "Đang kiểm tra...";
    }
  };

  const getStatusColor = () => {
    switch (authStatus) {
      case "loading":
        return "bg-blue-100 text-blue-800";
      case "success":
        return "bg-green-100 text-green-800";
      case "error":
        return "bg-red-100 text-red-800";
      case "timeout":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Auth Test Page</h1>
          <p className="text-gray-600 mt-2">Kiểm tra trạng thái xác thực</p>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleClearAuth} variant="destructive">
            <XCircle className="h-4 w-4 mr-2" />
            Clear Auth
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Auth Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Trạng thái xác thực
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              {getStatusIcon()}
              <div>
                <p className="font-medium">{getStatusText()}</p>
                <Badge className={getStatusColor()}>
                  {authStatus.toUpperCase()}
                </Badge>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Loading:</span>
                <span className={isLoading ? "text-blue-600" : "text-gray-600"}>
                  {isLoading ? "True" : "False"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Authenticated:</span>
                <span
                  className={
                    isAuthenticated ? "text-green-600" : "text-red-600"
                  }
                >
                  {isAuthenticated ? "True" : "False"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Timeout Reached:</span>
                <span
                  className={
                    timeoutReached ? "text-orange-600" : "text-gray-600"
                  }
                >
                  {timeoutReached ? "True" : "False"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Thông tin người dùng
            </CardTitle>
          </CardHeader>
          <CardContent>
            {user ? (
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{user.email || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Role</p>
                  <Badge variant="outline">{user.role || "N/A"}</Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium">{profile?.name || "N/A"}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Không có thông tin người dùng</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Debug Info */}
      <Card>
        <CardHeader>
          <CardTitle>Debug Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm font-mono">
            <div>
              <span className="text-gray-600">Environment:</span>{" "}
              {process.env.NODE_ENV}
            </div>
            <div>
              <span className="text-gray-600">API URL:</span>{" "}
              {process.env.NEXT_PUBLIC_API_URL}
            </div>
            <div>
              <span className="text-gray-600">Skip Auth:</span>{" "}
              {process.env.NEXT_PUBLIC_SKIP_AUTH}
            </div>
            <div>
              <span className="text-gray-600">Current URL:</span>{" "}
              {typeof window !== "undefined" ? window.location.href : "N/A"}
            </div>
            <div>
              <span className="text-gray-600">Local Storage Token:</span>{" "}
              {typeof window !== "undefined"
                ? localStorage.getItem("authToken")
                  ? "Present"
                  : "Not found"
                : "N/A"}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <Card>
        <CardHeader>
          <CardTitle>Navigation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            <Button asChild variant="outline">
              <a href="/events-noauth">Events (No Auth)</a>
            </Button>
            <Button asChild variant="outline">
              <a href="/cms/events">CMS Events</a>
            </Button>
            <Button asChild variant="outline">
              <a href="/admin/events">CMS Copy Events</a>
            </Button>
            <Button asChild variant="outline">
              <a href="/admin/events?skipauth=true">
                CMS Copy Events (Skip Auth)
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
