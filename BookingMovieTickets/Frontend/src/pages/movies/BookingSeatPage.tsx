import { useEffect, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useBooking } from "@/hooks/useBooking";
import { BookingSummary } from "@/components/booking-summary";
import { SeatMap } from "@/components/seat-map";

import { Button } from "@/components/ui/button";

export default function SeatsPage() {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    booking,
    selectSeat,
    unselectSeat,
    isBookingComplete,
    loadSeatData,
    isLoadingSeats,
    seatError,
  } = useBooking();
  const selectedSeats = booking.selectedSeats;

  useEffect(() => {
    if (!isBookingComplete()) {
      navigate(`/movies/${params.id}`);
    }
  }, [isBookingComplete, navigate, params.id]);

  useEffect(() => {
    if (booking.selectedShowtime?.showtimeId) {
      loadSeatData(booking.selectedShowtime.showtimeId);
    }
  }, [booking.selectedShowtime?.showtimeId, loadSeatData]);

  const handleSeatClick = useCallback(
    (seatId: string) => {
      if (selectedSeats.includes(seatId)) {
        unselectSeat(seatId);
      } else {
        if (selectedSeats.length < 6) {
          selectSeat(seatId);
        }
      }
      // Log state booking mỗi lần chọn ghế
      console.log("Booking state:", booking);
    },
    [selectedSeats, unselectSeat, selectSeat, booking]
  );

  const handleContinueToCheckout = () => {
    if (selectedSeats.length > 0) {
      navigate(`/movies/${params.id}/checkout`);
    }
  };

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

  if (!booking.movieId || !booking.selectedShowtime) {
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
          to={`/movies/${params.id}`}
          className="flex items-center gap-2 text-gray-400 hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Quay lại phim</span>
        </Link>
      </header>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-2">Chọn ghế ngồi</h1>
        <p className="text-gray-400 mb-8">
          {booking.movieTitle} • {formatDate(booking.selectedDate!)} •{" "}
          {booking.selectedShowtime.timeSlot.startTime.slice(0, 5)} •{" "}
          {booking.selectedCinema?.cinemaName} • Phòng{" "}
          {booking.seatData.roomNumber}
        </p>

        {/* Loading state */}
        {isLoadingSeats && (
          <div className="text-center py-12">
            <div className="text-gray-400">Đang tải thông tin ghế ngồi...</div>
          </div>
        )}

        {/* Error state */}
        {seatError && (
          <div className="text-center py-12">
            <div className="text-red-400 mb-4">{seatError}</div>
            <Button
              onClick={() =>
                booking.selectedShowtime?.showtimeId &&
                loadSeatData(booking.selectedShowtime.showtimeId)
              }
              variant="outline"
            >
              Thử lại
            </Button>
          </div>
        )}

        {/* Seat Map */}
        {!isLoadingSeats && !seatError && (
          <SeatMap onSeatClick={handleSeatClick} className="mb-12" />
        )}

        {/* Thông tin đặt vé */}
        <div className="max-w-3xl mx-auto">
          <BookingSummary />

          <div className="flex gap-4 mt-6">
            <Button
              onClick={handleContinueToCheckout}
              className="flex-1 bg-red-600 hover:bg-red-700 h-12"
              disabled={selectedSeats.length === 0 || isLoadingSeats}
            >
              Tiếp tục thanh toán
            </Button>

            <Button
              variant="secondary"
              className="h-12"
              onClick={() => navigate(`/movies/${params.id}`)}
            >
              Chọn lại suất chiếu
            </Button>
          </div>

          {/* Seat selection tips */}
          {selectedSeats.length === 0 && !isLoadingSeats && !seatError && (
            <div className="mt-4 p-4 bg-gray-900 rounded-lg border border-gray-800">
              <h3 className="font-semibold mb-2">Hướng dẫn chọn ghế:</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Chọn ghế bằng cách click vào ghế mong muốn</li>
                <li>• Bạn có thể chọn tối đa 6 ghế</li>
                <li>• Ghế màu đỏ là ghế đã được đặt</li>
                <li>• Ghế màu xám là ghế còn trống</li>
                <li>• Ghế màu đỏ đậm là ghế bạn đã chọn</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
