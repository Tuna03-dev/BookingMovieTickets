import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Ticket,
  CreditCard,
  Bell,
  Heart,
  Edit,
  Camera,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppSelector } from "@/store";

export default function ProfilePage() {
  const user = useAppSelector((state) => state.auth.user);
  const avatar = user?.imageUrl || "/placeholder.svg?height=120&width=120";
  const fullName = user?.fullName || "Chưa cập nhật";
  const email = user?.email || "Chưa cập nhật";
  const phone = user?.phoneNumber || "Chưa cập nhật";
  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("vi-VN")
    : "-";
  const totalBookings = user?.totalBookings ?? 0;
  const totalSpent = user?.totalSpent ?? 0;

  const quickStats = [
    { label: "Lượt đặt vé", value: totalBookings, icon: Ticket },
    {
      label: "Tổng chi tiêu",
      value: `${totalSpent.toLocaleString()}₫`,
      icon: CreditCard,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">
      {/* Header */}
      <header className="container mx-auto py-4 px-4">
        <Link
          to="/"
          className="flex items-center gap-2 text-gray-400 hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Về trang chủ</span>
        </Link>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-900 border-gray-800 shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="relative mx-auto mb-4">
                  <Avatar className="w-24 h-24 border-4 border-red-600 shadow">
                    <AvatarImage src={avatar} alt={fullName} />
                    <AvatarFallback className="text-2xl bg-white">
                      {fullName
                        .split(" ")
                        .map((w) => w[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-white text-xl font-bold">
                  {fullName}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 text-white">
                {/* Thông tin liên hệ */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">Tham gia: {joinDate}</span>
                  </div>
                </div>

                {/* Hành động nhanh */}
                <div className="flex flex-col space-y-2 ">
                  <Link to="/profile/edit">
                    <Button
                      variant="secondary"
                      className="w-full  justify-start"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Chỉnh sửa hồ sơ
                    </Button>
                  </Link>
                  <Link to="/profile/edit">
                    <Button
                      variant="secondary"
                      className="w-full  justify-start"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Đổi mật khẩu
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Nội dung chính */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {/* Thống kê nhanh */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickStats.map((stat, index) => (
                  <Card
                    key={index}
                    className="bg-gray-900 border-gray-800 shadow"
                  >
                    <CardContent className="p-4 text-center text-white">
                      <stat.icon className="h-8 w-8 text-red-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">
                        {String(stat.value)}
                      </div>
                      <div className="text-xs text-gray-400">{stat.label}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Liên kết nhanh */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Link to="/bookings">
                  <Card className="bg-gray-900 border-gray-800 hover:border-red-600 transition-colors cursor-pointer shadow">
                    <CardContent className="p-6 text-center text-white">
                      <Ticket className="h-12 w-12 text-red-500 mx-auto mb-4" />
                      <h3 className="font-semibold text-white mb-2">
                        Vé đã đặt
                      </h3>
                      <p className="text-sm text-gray-400">
                        Xem và quản lý vé xem phim của bạn
                      </p>
                    </CardContent>
                  </Card>
                </Link>

                <Link to="/favorites">
                  <Card className="bg-gray-900 border-gray-800 hover:border-red-600 transition-colors cursor-pointer shadow">
                    <CardContent className="p-6 text-center text-white">
                      <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
                      <h3 className="font-semibold text-white mb-2">
                        Yêu thích
                      </h3>
                      <p className="text-sm text-gray-400">
                        Danh sách phim yêu thích của bạn
                      </p>
                    </CardContent>
                  </Card>
                </Link>

                <Link to="/notifications">
                  <Card className="bg-gray-900 border-gray-800 hover:border-red-600 transition-colors cursor-pointer shadow">
                    <CardContent className="p-6 text-center text-white">
                      <Bell className="h-12 w-12 text-red-500 mx-auto mb-4" />
                      <h3 className="font-semibold text-white mb-2">
                        Thông báo
                      </h3>
                      <p className="text-sm text-gray-400">
                        Cập nhật tin tức và ưu đãi mới nhất
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
