"use client";

import { useState } from "react";
import { User } from "@/lib/api";
import { RoleName } from "@/lib/roles";
import { RoleSelector } from "@/components/RoleSelector";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface UserProfileCardProps {
  user: User;
  onRoleChange?: (userId: string, newRole: RoleName) => Promise<void>;
  isAdmin?: boolean;
}

export function UserProfileCard({ 
  user, 
  onRoleChange,
  isAdmin = false 
}: UserProfileCardProps) {
  const [role, setRole] = useState<RoleName>(user.role);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Generate initials for avatar fallback
  const getInitials = (email: string) => {
    if (!email) return "U";
    return email.charAt(0).toUpperCase();
  };

  const handleRoleChange = async (newRole: RoleName) => {
    setRole(newRole);
  };

  const saveRoleChange = async () => {
    if (!onRoleChange || role === user.role) {
      setIsEditing(false);
      return;
    }

    setIsLoading(true);
    try {
      await onRoleChange(user.id, role);
      setIsEditing(false);
    } catch (error) {
      console.error("Không thể cập nhật vai trò:", error);
      // Reset to original role on error
      setRole(user.role);
    } finally {
      setIsLoading(false);
    }
  };

  // Get appropriate badge variant based on role
  const getBadgeVariant = (role: RoleName) => {
    switch(role) {
      case "admin": return "destructive";
      case "staff": return "default";
      case "parent": return "secondary";
      default: return "outline";
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/30 p-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src="/placeholder-user.jpg" alt={user.email} />
            <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <CardTitle className="text-lg">{user.email}</CardTitle>
            <div className="flex items-center space-x-2">
              {!isEditing ? (
                <Badge variant={getBadgeVariant(role)}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </Badge>
              ) : null}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">User ID: {user.id}</div>
          {isEditing && (
            <div className="pt-2">
              <RoleSelector
                value={role}
                onValueChange={handleRoleChange}
                disabled={isLoading}
              />
            </div>
          )}
        </div>
      </CardContent>
      {isAdmin && (
        <CardFooter className="flex justify-end gap-2 border-t bg-muted/30 p-4">
          {!isEditing ? (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsEditing(true)}
            >
              Thay đổi vai trò
            </Button>
          ) : (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setIsEditing(false);
                  setRole(user.role);
                }}
                disabled={isLoading}
              >
                Hủy
              </Button>
              <Button 
                variant="default" 
                size="sm" 
                onClick={saveRoleChange}
                disabled={isLoading || role === user.role}
              >
                {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
            </>
          )}
        </CardFooter>
      )}
    </Card>
  );
}