import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CreditCard,
  User,
  Calendar,
  MapPin,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useBooking } from "@/hooks/useBooking";
import { useAppSelector } from "@/store";
import { BookingSummary } from "@/components/booking-summary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { bookingApi } from "@/services/bookingApi";
import { toast } from "sonner";

export default function CheckoutPage() {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { booking, isBookingComplete, hasSelectedSeats } = useBooking();
  const user = useAppSelector((state) => state.auth.user);

  // State cho trạng thái thanh toán
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Redirect if no booking details or no seats selected
  useEffect(() => {
    if (!isBookingComplete()) {
      navigate(`/movies/${params.id}`);
      return;
    }

    if (!hasSelectedSeats()) {
      navigate(`/movies/${params.id}/booking`);
      return;
    }
  }, [isBookingComplete, hasSelectedSeats, navigate, params.id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Hôm nay";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Ngày mai";
    } else {
      return date.toLocaleDateString("vi-VN", {
        weekday: "long",
        day: "2-digit",
        month: "short",
      });
    }
  };

  const handlePayment = async () => {
    if (!user || !user.id) {
      setError("Bạn cần đăng nhập để đặt vé!");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const payload = {
        showtimeId: booking.selectedShowtime!.showtimeId,
        selectedSeatIds: booking.selectedSeats.map((s: any) => s.seatId || s),
        totalPrice: booking.totalPrice,
        userId: user.id,
        paymentMethod: "momo",
      };
      const result = await bookingApi.createPayment(payload);
      toast.success("Đặt vé thành công!");
      console.log("Payment result:", result);
      setSuccess(true);
      setTimeout(() => navigate("/success"), 2000);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err?.response?.data?.message || "Đặt vé thất bại!");
    } finally {
      setLoading(false);
    }
  };

  if (
    !booking.movieId ||
    !booking.selectedShowtime ||
    booking.selectedSeats.length === 0
  ) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Đang tải...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="container mx-auto py-4 px-4">
        <Link
          to={`/movies/${params.id}/booking`}
          className="flex items-center gap-2 text-gray-400 hover:text-white"
        >
          <ArrowLeft className="h-5 w-5 text-white" />
          <span className="text-white">Quay lại chọn ghế</span>
        </Link>
      </header>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-2 text-white">Thanh toán</h1>
        <p className="text-gray-400 mb-8">
          Vui lòng kiểm tra thông tin và hoàn tất thanh toán
        </p>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Payment Form */}
          <div className="space-y-6">
            {/* Customer Information */}
            <Card className="bg-gray-900 border-gray-800 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <User className="h-5 w-5 text-white" />
                  Thông tin khách hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-white">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">Họ tên</Label>
                    <Input
                      value={user?.fullName || ""}
                      disabled
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-white">Email</Label>
                    <Input
                      value={user?.email || ""}
                      disabled
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-white">Số điện thoại</Label>
                  <Input
                    value={user?.phoneNumber || ""}
                    disabled
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="bg-gray-900 border-gray-800 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <CreditCard className="h-5 w-5 text-white" />
                  Phương thức thanh toán
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-white">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="momo"
                      name="payment"
                      value="momo"
                      defaultChecked
                      disabled
                    />
                    <Label htmlFor="momo" className="text-white">
                      Ví MoMo (demo)
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Movie Information */}
            <Card className="bg-gray-900 border-gray-800 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Calendar className="h-5 w-5 text-white" />
                  Thông tin suất chiếu
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-white">
                <div className="flex justify-between">
                  <span className="text-gray-400">Phim:</span>
                  <span className="text-white">{booking.movieTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Ngày:</span>
                  <span className="text-white">
                    {formatDate(booking.selectedDate!)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Giờ:</span>
                  <span className="text-white">
                    {booking.selectedShowtime.timeSlot.startTime.slice(0, 5)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Phòng:</span>
                  <span className="text-white">
                    {booking.seatData.roomNumber}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Cinema Information */}
            <Card className="bg-gray-900 border-gray-800 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <MapPin className="h-5 w-5 text-white" />
                  Thông tin rạp
                </CardTitle>
              </CardHeader>
              <CardContent className="text-white">
                <div className="space-y-2">
                  <div className="font-semibold text-white">
                    {booking.selectedCinema?.cinemaName}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {booking.selectedCinema?.cinemaAddress}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Booking Summary */}
          <div className="space-y-6">
            <BookingSummary showSeats={true} showTotal={true} />

            {/* Terms and Conditions */}
            <Card className="bg-gray-900 border-gray-800 text-white">
              <CardHeader>
                <CardTitle className="text-lg text-white">
                  Điều khoản và điều kiện
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-400 space-y-2">
                <p>• Vé đã mua không thể hoàn tiền hoặc đổi suất chiếu</p>
                <p>• Vui lòng đến rạp trước giờ chiếu 15 phút</p>
                <p>• Mang theo giấy tờ tùy thân khi nhận vé</p>
                <p>• Không được mang đồ ăn, thức uống vào rạp</p>
                <p>• Tắt điện thoại trong suốt buổi chiếu</p>
              </CardContent>
            </Card>

            {/* Payment Button & Status */}
            <div className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 text-red-400 text-white">
                  <XCircle className="h-5 w-5 text-white" />
                  {error}
                </div>
              )}
              {success && (
                <div className="flex items-center gap-2 text-green-400 text-white">
                  <CheckCircle2 className="h-5 w-5 text-white" />
                  Đặt vé thành công! Đang chuyển hướng...
                </div>
              )}
              <Button
                onClick={handlePayment}
                className="w-full bg-red-600 hover:bg-red-700 h-12 text-lg font-semibold text-white"
                disabled={loading || success}
              >
                {loading
                  ? "Đang xử lý..."
                  : `Thanh toán ${booking.totalPrice.toLocaleString("vi-VN")}₫`}
              </Button>
            </div>

            <p className="text-xs text-gray-500 text-center text-white">
              Bằng việc nhấn "Thanh toán", bạn đồng ý với các điều khoản và điều
              kiện của chúng tôi
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
