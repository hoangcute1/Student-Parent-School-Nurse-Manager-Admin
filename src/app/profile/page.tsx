"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Mail, Shield, Calendar } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { updateProfile } from "@/lib/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { User, UserProfile } from "@/lib/types";

const profileFormSchema = z.object({
  name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  gender: z.enum(["male", "female"]),
  birth: z.string(),
  address: z.string().min(5, "Địa chỉ phải có ít nhất 5 ký tự"),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfilePage() {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
  });

  useEffect(() => {
    // Get user data from localStorage
    const authData = localStorage.getItem("authData");
    if (!authData) {
      toast({
        title: "Lỗi xác thực",
        description: "Vui lòng đăng nhập lại",
        variant: "destructive",
      });
      router.push("/login");
      return;
    }

    try {
      const data = JSON.parse(authData);
      if (data.user && data.profile) {
        setUser(data.user);
        setProfile(data.profile);

        // Set form values from existing profile
        form.reset({
          name: data.profile.name,
          gender: data.profile.gender,
          birth: data.profile.birth.split("T")[0], // Get only the date part
          address: data.profile.address,
        });
      }
    } catch (error) {
      console.error("Error parsing auth data:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải thông tin cá nhân",
        variant: "destructive",
      });
    }
    setLoading(false);
  }, [form, router, toast]);

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      setFormLoading(true);
      const updatedProfile = await updateProfile(data);

      // Update local storage with new profile data
      const authData = localStorage.getItem("authData");
      if (authData) {
        const currentData = JSON.parse(authData);
        localStorage.setItem(
          "authData",
          JSON.stringify({
            ...currentData,
            profile: updatedProfile,
          })
        );
      }

      setProfile(updatedProfile);

      toast({
        title: "Cập nhật thành công",
        description: "Thông tin cá nhân đã được cập nhật",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật thông tin. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  };

  if (loading || !user || !profile) {
    return <div className="flex justify-center p-8">Đang tải thông tin...</div>;
  }

  return (
    <div className="px-4 space-y-8 py-8">
      <Card>
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile.avatar} alt={profile.name} />
              <AvatarFallback>
                {profile.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{profile.name}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {user.email}
              </CardDescription>
              <CardDescription className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span className="capitalize">{user.userType}</span>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              Tham gia ngày{" "}
              {new Date(profile.createdAt).toLocaleDateString("vi-VN")}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Chỉnh sửa thông tin cá nhân</CardTitle>
          <CardDescription>
            Cập nhật thông tin cá nhân của bạn tại đây
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Họ và tên</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập họ và tên" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Giới tính</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn giới tính" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Nam</SelectItem>
                          <SelectItem value="female">Nữ</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="birth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ngày sinh</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Địa chỉ</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập địa chỉ" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" disabled={formLoading}>
                {formLoading ? "Đang cập nhật..." : "Lưu thay đổi"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
