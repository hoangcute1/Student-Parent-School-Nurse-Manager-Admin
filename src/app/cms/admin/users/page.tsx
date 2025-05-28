"use client";

import { useState, useEffect } from "react";
import { getUsers, updateUserRole, User } from "@/lib/api";
import { RoleName } from "@/lib/roles";
import { UserProfileCard } from "@/components/UserProfileCard";
import { useAuth } from "@/lib/auth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth("admin");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const fetchedUsers = await getUsers();
        setUsers(fetchedUsers);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setError("Failed to load users. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: RoleName) => {
    try {
      // Call API to update user role
      await updateUserRole(userId, newRole);

      // Update local state
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );

      return Promise.resolve();
    } catch (error) {
      console.error("Failed to update user role:", error);
      return Promise.reject(error);
    }
  };

  // Filter users by role
  const adminUsers = users.filter((user) => user.role === "admin");
  const staffUsers = users.filter((user) => user.role === "staff");
  const parentUsers = users.filter((user) => user.role === "parent");

  if (!user) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="rounded-lg bg-background p-8 shadow-lg">
          <h1 className="text-xl font-bold">Quyền truy cập hạn chế</h1>
          <p className="mt-2 text-muted-foreground">
            Bạn cần quyền quản trị viên để truy cập trang này.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <h1 className="mb-6 text-2xl font-bold">Quản lý người dùng</h1>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Lỗi</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="flex h-32 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
          <p className="ml-2 text-muted-foreground">
            Đang tải danh sách người dùng...
          </p>
        </div>
      ) : (
        <Tabs defaultValue="all">
          <TabsList className="mb-6">
            <TabsTrigger value="all">Tất cả ({users.length})</TabsTrigger>
            <TabsTrigger value="admin">
              Quản trị viên ({adminUsers.length})
            </TabsTrigger>
            <TabsTrigger value="staff">
              Nhân viên ({staffUsers.length})
            </TabsTrigger>
            <TabsTrigger value="parent">
              Phụ huynh ({parentUsers.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {users.map((user) => (
                <UserProfileCard
                  key={user.id}
                  user={user}
                  onRoleChange={handleRoleChange}
                  isAdmin={true}
                />
              ))}
              {users.length === 0 && (
                <div className="col-span-full py-4 text-center text-muted-foreground">
                  Không tìm thấy người dùng nào.
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="admin">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {adminUsers.map((user) => (
                <UserProfileCard
                  key={user.id}
                  user={user}
                  onRoleChange={handleRoleChange}
                  isAdmin={true}
                />
              ))}
              {adminUsers.length === 0 && (
                <div className="col-span-full py-4 text-center text-muted-foreground">
                  Không tìm thấy quản trị viên nào.
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="staff">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {staffUsers.map((user) => (
                <UserProfileCard
                  key={user.id}
                  user={user}
                  onRoleChange={handleRoleChange}
                  isAdmin={true}
                />
              ))}
              {staffUsers.length === 0 && (
                <div className="col-span-full py-4 text-center text-muted-foreground">
                  Không tìm thấy nhân viên nào.
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="parent">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {parentUsers.map((user) => (
                <UserProfileCard
                  key={user.id}
                  user={user}
                  onRoleChange={handleRoleChange}
                  isAdmin={true}
                />
              ))}
              {parentUsers.length === 0 && (
                <div className="col-span-full py-4 text-center text-muted-foreground">
                  Không tìm thấy phụ huynh nào.
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
