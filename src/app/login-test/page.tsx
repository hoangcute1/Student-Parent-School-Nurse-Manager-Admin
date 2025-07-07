"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth-store";
import { setAuthToken } from "@/lib/api/auth/token";
import { User, Shield, LogIn, LogOut } from "lucide-react";

// Function to create a fake JWT token
function createFakeToken(userData: any) {
  const header = { alg: "HS256", typ: "JWT" };
  const payload = {
    sub: userData.id,
    email: userData.email,
    role: userData.role,
    name: userData.name,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
  };

  // Simple base64 encoding (not secure, just for testing)
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));
  const signature = "fake-signature-for-testing";

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

export default function LoginTestPage() {
  const { user, isAuthenticated, clearAuth, updateUserInfo, updateUserRole } = useAuthStore();
  const [email, setEmail] = useState("admin@example.com");
  const [name, setName] = useState("Test Admin");
  const [role, setRole] = useState<"admin" | "staff" | "parent">("admin");

  const handleLogin = () => {
    const userData = {
      id: "test-user-id",
      email,
      name,
      role
    };

    // Create fake token
    const fakeToken = createFakeToken(userData);
    
    // Save token to localStorage
    setAuthToken(fakeToken);
    
    // Update auth store
    updateUserRole(role);
    updateUserInfo(userData, null);
    
    toast.success("Đăng nhập thành công!");
  };

  const handleLogout = () => {
    clearAuth();
    localStorage.removeItem('authToken');
    toast.success("Đã đăng xuất!");
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Login Test Page</h1>
          <p className="text-gray-600 mt-2">Tạo token giả để test auth system</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LogIn className="h-5 w-5" />
              Đăng nhập giả
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
              />
            </div>
            
            <div>
              <Label htmlFor="name">Tên</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Test Admin"
              />
            </div>
            
            <div>
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={(value: "admin" | "staff" | "parent") => setRole(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="parent">Parent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button onClick={handleLogin} className="w-full">
              <LogIn className="h-4 w-4 mr-2" />
              Đăng nhập
            </Button>
          </CardContent>
        </Card>

        {/* Current Auth Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Trạng thái hiện tại
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isAuthenticated && user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-green-600">
                  <Shield className="h-4 w-4" />
                  <span className="font-medium">Đã đăng nhập</span>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tên</p>
                    <p className="font-medium">{user.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Role</p>
                    <p className="font-medium">{user.role}</p>
                  </div>
                </div>
                
                <Button onClick={handleLogout} variant="destructive" className="w-full">
                  <LogOut className="h-4 w-4 mr-2" />
                  Đăng xuất
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Chưa đăng nhập</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Navigation */}
      <Card>
        <CardHeader>
          <CardTitle>Test Navigation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            <Button asChild variant="outline">
              <a href="/auth-test">Auth Test</a>
            </Button>
            <Button asChild variant="outline">
              <a href="/cms/events">CMS Events</a>
            </Button>
            <Button asChild variant="outline">
              <a href="/cmscopy/events">CMS Copy Events</a>
            </Button>
            <Button asChild variant="outline">
              <a href="/events-noauth">Events (No Auth)</a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Token Info */}
      <Card>
        <CardHeader>
          <CardTitle>Token Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm font-mono">
            <div>
              <span className="text-gray-600">Token exists:</span> {typeof window !== 'undefined' ? (localStorage.getItem('authToken') ? 'Yes' : 'No') : 'N/A'}
            </div>
            {typeof window !== 'undefined' && localStorage.getItem('authToken') && (
              <div>
                <span className="text-gray-600">Token preview:</span>
                <div className="mt-1 p-2 bg-gray-100 rounded text-xs break-all">
                  {localStorage.getItem('authToken')?.substring(0, 100)}...
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
