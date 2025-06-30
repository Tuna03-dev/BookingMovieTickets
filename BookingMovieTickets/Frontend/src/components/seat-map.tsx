import { useBooking } from "@/hooks/useBooking";

interface SeatMapProps {
  onSeatClick: (seatId: string) => void;
  className?: string;
}

export function SeatMap({ onSeatClick, className = "" }: SeatMapProps) {
  const { booking, getSeatStatus } = useBooking();

  // Tạo rows và columns từ seat data
  const seatRows = [...new Set(booking.seatData.seats.map(seat => seat.row))].sort();
  const maxColumns = Math.max(...booking.seatData.seats.map(s => s.seatColumn));

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Màn hình */}
      <div className="w-full max-w-3xl h-8 bg-gradient-to-b from-gray-500 to-transparent mb-8 rounded-t-full text-center text-sm text-gray-300">
        MÀN HÌNH
      </div>

      {/* Sơ đồ ghế */}
      <div className="grid gap-6 mb-8">
        {seatRows.map((row) => (
          <div key={row} className="flex items-center gap-2">
            <div className="w-6 text-center font-bold">{row}</div>
            <div className="flex gap-2">
              {Array.from({ length: maxColumns }).map((_, i) => {
                const col = i + 1;
                const seat = booking.seatData.seats.find(s => s.row === row && s.seatColumn === col);
                
                if (!seat) {
                  return <div key={`${row}${col}`} className="w-8 h-8" />;
                }

                const status = getSeatStatus(seat.seatId);
                
                return (
                  <button
                    key={`${row}${col}`}
                    className={`w-8 h-8 rounded-t-lg flex items-center justify-center text-xs font-bold transition-colors ${
                      status === "available"
                        ? "bg-gray-700 hover:bg-gray-600 cursor-pointer"
                        : status === "selected"
                        ? "bg-red-600 hover:bg-red-700 cursor-pointer"
                        : "bg-gray-800 opacity-50 cursor-not-allowed"
                    }`}
                    onClick={() =>
                      status !== "occupied" &&
                      onSeatClick(seat.seatId)
                    }
                    disabled={status === "occupied"}
                    title={`Ghế ${seat.seatNumber}`}
                  >
                    {col}
                  </button>
                );
              })}
            </div>
            <div className="w-6 text-center font-bold">{row}</div>
          </div>
        ))}
      </div>

      {/* Chú thích */}
      <div className="flex gap-8 justify-center mb-8">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-t-sm bg-gray-700"></div>
          <span className="text-sm">Ghế trống</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-t-sm bg-red-600"></div>
          <span className="text-sm">Đã chọn</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-t-sm bg-gray-800 opacity-50"></div>
          <span className="text-sm">Đã đặt</span>
        </div>
      </div>
    </div>
  );
} 