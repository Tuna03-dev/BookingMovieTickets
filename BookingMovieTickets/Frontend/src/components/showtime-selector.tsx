import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useBooking } from "@/hooks/useBooking";

import { showtimeApi } from "@/services/showTimeApi";
interface ShowtimeSelectorProps {
  movieId: string;
  movieTitle?: string;
}

interface TimeSlotDTO {
  timeSlotId: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

interface ShowtimeResponseDTO {
  showtimeId: string;
  date: string;
  timeSlotId: string;
  timeSlot: TimeSlotDTO;
  ticketPrice: number;
  roomId: string;
  roomNumber?: string;
}

interface CinemaShowtimeDTO {
  cinemaId: string;
  cinemaName: string;
  cinemaAddress?: string;
  showtimes: ShowtimeResponseDTO[];
}

const getDateList = () => {
  const today = new Date();
  const result = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    result.push({
      id: d.toISOString().split("T")[0],
      label:
        i === 0
          ? "Hôm nay"
          : i === 1
          ? "Ngày mai"
          : d.toLocaleDateString("vi-VN", { weekday: "long" }),
      date: d.toLocaleDateString("vi-VN", { day: "2-digit", month: "short" }),
      value: d,
    });
  }
  return result;
};

export function ShowtimeSelector({ movieId, movieTitle }: ShowtimeSelectorProps) {
  const { setMovie, setBooking } = useBooking();
  const [selectedDate, setSelectedDate] = useState(getDateList()[0].id);
  const [selectedCinema, setSelectedCinema] = useState<string | undefined>(
    undefined
  );
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [cinemas, setCinemas] = useState<CinemaShowtimeDTO[]>([]);
  const [loading, setLoading] = useState(false);

  const dates = getDateList();

  useEffect(() => {
    // Set movie info when component mounts
    if (movieTitle) {
      setMovie(movieId, movieTitle);
    }
  }, [movieId, movieTitle, setMovie]);

  useEffect(() => {
    async function fetchShowtimes() {
      setLoading(true);
      setSelectedCinema(undefined);
      setSelectedTime("");
      try {
        const res = await showtimeApi.getShowtimes(movieId, selectedDate);
        const data = Array.isArray(res) ? res : [];
        console.log("Fetched showtimes:", data);
        setCinemas(data);
        if (data.length > 0) {
          setSelectedCinema(data[0].cinemaId);
        }
      } catch (err) {
        console.error(err);
        setCinemas([]);
      } finally {
        setLoading(false);
      }
    }
    fetchShowtimes();
  }, [movieId, selectedDate]);

  const handleShowtimeSelect = (cinema: CinemaShowtimeDTO, showtime: ShowtimeResponseDTO) => {
    const timeKey = `${cinema.cinemaId}-${showtime.showtimeId}`;
    setSelectedTime(timeKey);

    // Set booking details using hook
    setBooking({
      date: selectedDate,
      cinema: {
        cinemaId: cinema.cinemaId,
        cinemaName: cinema.cinemaName,
        cinemaAddress: cinema.cinemaAddress,
      },
      showtime: {
        showtimeId: showtime.showtimeId,
        timeSlot: showtime.timeSlot,
        ticketPrice: showtime.ticketPrice,
        roomId: showtime.roomId,
        roomNumber: showtime.roomNumber || "",
      },
    });
  };

  return (
    <div>
      {/* Chọn ngày */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Chọn ngày</h3>
        <div className="grid grid-cols-3 md:grid-cols-7 gap-2">
          {dates.map((date) => (
            <Button
              key={date.id}
              variant={selectedDate === date.id ? "default" : "secondary"}
              className={`flex flex-col h-auto py-3 ${
                selectedDate === date.id ? "bg-red-600 hover:bg-red-700" : ""
              }`}
              onClick={() => setSelectedDate(date.id)}
            >
              <span className="text-sm font-normal">{date.label}</span>
              <span className="text-xs opacity-80">{date.date}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Chọn rạp */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Chọn rạp</h3>
        {loading ? (
          <div>Đang tải dữ liệu...</div>
        ) : cinemas.length === 0 ? (
          <div>Không có suất chiếu cho ngày này.</div>
        ) : (
          <Tabs
            value={selectedCinema}
            onValueChange={setSelectedCinema}
            className="w-full"
          >
            <TabsList className={`w-full grid grid-cols-${cinemas.length}`}>
              {cinemas.map((cinema) => (
                <TabsTrigger
                  key={cinema.cinemaId}
                  value={cinema.cinemaId}
                  className="data-[state=active]:bg-red-600"
                >
                  {cinema.cinemaName}
                </TabsTrigger>
              ))}
            </TabsList>
            {cinemas.map((cinema) => (
              <TabsContent
                key={cinema.cinemaId}
                value={cinema.cinemaId}
                className="mt-4"
              >
                <Card className="border-gray-800 bg-gray-800/50">
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-3 flex items-center gap-2 text-white">
                      <Calendar className="h-4 w-4" />
                      Suất chiếu cho{" "}
                      {dates.find((d) => d.id === selectedDate)?.date}
                    </h4>
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                      {cinema.showtimes.map((showtime) => (
                        <Button
                          key={showtime.showtimeId}
                          variant={
                            selectedTime ===
                            `${cinema.cinemaId}-${showtime.showtimeId}`
                              ? "default"
                              : "outline"
                          }
                          className={`flex flex-col h-auto py-2 ${
                            selectedTime ===
                            `${cinema.cinemaId}-${showtime.showtimeId}`
                              ? "bg-red-600 hover:bg-red-700"
                              : ""
                          }`}
                          onClick={() => handleShowtimeSelect(cinema, showtime)}
                        >
                          <span className="text-sm font-medium">
                            {showtime.timeSlot?.startTime?.slice(0, 5)}
                          </span>
                          <span className="text-xs opacity-80">
                            {showtime.ticketPrice.toLocaleString()}₫
                          </span>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>

      {/* Nút tiếp tục */}
      <div className="flex justify-end">
        <Link to={selectedTime ? `/movies/${movieId}/seats` : "#"}>
          <Button
            className="bg-red-600 hover:bg-red-700 px-8"
            disabled={!selectedTime}
          >
            Tiếp tục
          </Button>
        </Link>
      </div>
    </div>
  );
}
