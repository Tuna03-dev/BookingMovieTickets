import { Info } from "lucide-react";
import { useBooking } from "@/hooks/useBooking";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BookingSummaryProps {
  showSeats?: boolean;
  showTotal?: boolean;
  className?: string;
}

export function BookingSummary({
  showSeats = true,
  showTotal = true,
  className = "",
}: BookingSummaryProps) {
  const { booking } = useBooking();

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

  // Lấy seatNumbers từ selectedSeats
  const getSelectedSeatNumbers = () => {
    if (booking.selectedSeats.length === 0) return [];
    
    return booking.selectedSeats
      .map(seatId => {
        const seat = booking.seatData.seats.find(s => s.seatId === seatId);
        return seat?.seatNumber || seatId; 
      })
      .sort();
  };

  if (!booking.movieId || !booking.selectedShowtime) {
    return null;
  }

  const selectedSeatNumbers = getSelectedSeatNumbers();

  return (
    <div className={`bg-gray-900 rounded-lg p-6 ${className}`}>
      <h2 className="text-xl font-bold mb-4">Thông tin đặt vé</h2>

      <div className="grid gap-4 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-400">Phim:</span>
          <span>{booking.movieTitle}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Ngày & Giờ:</span>
          <span>
            {formatDate(booking.selectedDate!)} •{" "}
            {booking.selectedShowtime.timeSlot.startTime.slice(0, 5)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Rạp:</span>
          <span>{booking.selectedCinema?.cinemaName}</span>
        </div>
        {showSeats && (
          <div className="flex justify-between">
            <div className="flex items-center gap-1">
              <span className="text-gray-400">Ghế:</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Bạn có thể chọn tối đa 6 ghế</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <span>
              {selectedSeatNumbers.length > 0
                ? selectedSeatNumbers.join(", ")
                : "Chưa chọn ghế"}
            </span>
          </div>
        )}
      </div>

      {showTotal && (
        <div className="border-t border-gray-800 pt-4 mb-6">
          <div className="flex justify-between text-lg font-bold">
            <span>Tổng cộng:</span>
            <span>{booking.totalPrice.toLocaleString("vi-VN")}₫</span>
          </div>
          <div className="text-xs text-gray-400 text-right">
            {booking.selectedSeats.length} ×{" "}
            {booking.selectedShowtime.ticketPrice.toLocaleString("vi-VN")}₫
          </div>
        </div>
      )}
    </div>
  );
}
