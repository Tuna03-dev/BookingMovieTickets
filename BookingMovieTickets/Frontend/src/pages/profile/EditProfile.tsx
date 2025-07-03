import type React from "react";

import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Camera, Save, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

import authAPI from "@/services/auth/authAPI";
import { useAppSelector, useAppDispatch } from "@/store";
import { setUser } from "@/store/slices/authSlice";
import type { User } from "@/store/slices/authSlice";

const profileSchema = z.object({
  fullName: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().min(10, "Số điện thoại phải có ít nhất 10 số"),
  dateOfBirth: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Ngày sinh không hợp lệ"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function EditProfilePage() {
  const user = useAppSelector((state) => state.auth.user);
  const currentUser = user
    ? {
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phoneNumber || "",
        dateOfBirth: user.dateOfBirth
          ? user.dateOfBirth.slice(0, 10)
          : "1990-01-01",
        avatar: user.imageUrl || "/placeholder.svg?height=120&width=120",
      }
    : {
        fullName: "",
        email: "",
        phone: "",
        dateOfBirth: "1990-01-01",
        avatar: "/placeholder.svg?height=120&width=120",
      };

  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>(currentUser.avatar);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: currentUser.fullName,
      email: currentUser.email,
      phone: currentUser.phone,
      dateOfBirth: currentUser.dateOfBirth,
    },
  });

  const dispatch = useAppDispatch();

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      let uploadedAvatarUrl = avatarUrl;
      if (avatarFile) {
        const res = await authAPI.uploadAvatar(avatarFile);
        const uploaded = res.data as { imageUrl: string };
        uploadedAvatarUrl = uploaded.imageUrl;
        setAvatarUrl(uploadedAvatarUrl);
        setAvatarFile(null);
        setAvatarPreview(null);
      }
      const resUpdate = await authAPI.updateProfile({
        fullName: data.fullName,
        phoneNumber: data.phone,
        dateOfBirth: new Date(data.dateOfBirth).toISOString(),
      });
      // Validate the response
      if (resUpdate && typeof resUpdate === "object") {
        const userData = resUpdate as User;
        const updatedUser: User = {
          ...userData,
          email: data.email,
          roles: userData.roles || [],
          imageUrl: uploadedAvatarUrl,
        };
        dispatch(setUser(updatedUser));
        toast.success("Cập nhật hồ sơ thành công!");
      } else {
        throw new Error("Invalid user data returned from API");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Có lỗi khi cập nhật hồ sơ");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="container mx-auto py-4 px-4">
        <div className="flex items-center justify-between">
          <Link
            to="/profile"
            className="flex items-center gap-2 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Về trang cá nhân</span>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Chỉnh sửa hồ sơ
            </h1>
            <p className="text-gray-400">
              Cập nhật thông tin cá nhân và tùy chọn của bạn
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Profile Picture Section */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Ảnh đại diện</CardTitle>
                  <CardDescription>
                    Cập nhật ảnh đại diện của bạn
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <Avatar className="w-24 h-24">
                        <AvatarImage
                          src={avatarPreview || avatarUrl}
                          alt="Ảnh đại diện"
                        />
                        <AvatarFallback className="text-2xl bg-white">
                          {currentUser.fullName
                            .split(" ")
                            .map((w) => w[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <label
                        htmlFor="avatar-upload"
                        className="absolute -bottom-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 cursor-pointer transition-colors"
                      >
                        <Camera className="h-4 w-4" />
                      </label>
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-1">
                        Đổi ảnh đại diện
                      </h3>
                      <p className="text-sm text-gray-400 mb-3">
                        Tải lên ảnh đại diện mới. Kích thước khuyến nghị:
                        400x400px
                      </p>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            document.getElementById("avatar-upload")?.click()
                          }
                        >
                          Tải ảnh mới
                        </Button>
                        {avatarPreview && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              setAvatarPreview(null);
                              setAvatarFile(null);
                            }}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Xóa ảnh
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Personal Information */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">
                    Thông tin cá nhân
                  </CardTitle>
                  <CardDescription>
                    Thông tin hồ sơ cơ bản của bạn
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">
                            Họ và tên
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="bg-gray-800 border-gray-700 text-white"
                              placeholder="Nhập họ và tên"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Email</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              className="bg-gray-800 border-gray-700 text-white"
                              placeholder="Nhập email"
                              disabled
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">
                            Số điện thoại
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="tel"
                              className="bg-gray-800 border-gray-700 text-white"
                              placeholder="Nhập số điện thoại"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem className="flex flex-col text-white">
                          <FormLabel>Ngày sinh</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="date"
                              className="bg-gray-800 border-gray-700 text-white"
                              placeholder="Chọn ngày sinh"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <Link to="/profile">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full sm:w-auto bg-transparent"
                  >
                    Hủy
                  </Button>
                </Link>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Lưu thay đổi
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
