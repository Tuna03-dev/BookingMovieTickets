import { useEffect, useState } from "react";
import { Plus, ChevronLeft, ChevronRight, Clock, MapPin, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AdminLayout } from "@/layouts/AdminLayout";
// import { ShowtimeDialog } from "@/pages/admin/components/ShowtimeDialog";
import { cinemaApis } from "@/services/cinemaApis";
import { movieApis } from "@/services/movieApis";
import { httpClient } from "@/config/httpClient";

export default function ShowtimeCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [cinemas, setCinemas] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [timeSlots, setTimeSlots] = useState<any[]>([]);
  const [movies, setMovies] = useState<any[]>([]);
  const [showtimes, setShowtimes] = useState<any[]>([]);
  const [selectedCinema, setSelectedCinema] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedShowtime, setSelectedShowtime] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Fetch all data on mount
  useEffect(() => {
    setLoading(true);
    Promise.all([
      cinemaApis.getCinemas(),
      httpClient.get("/Room?skip=0&top=100").then((res) => res.data.value),
      httpClient.get("/TimeSlot?skip=0&top=100").then((res) => res.data.value),
      movieApis.getOdataMovies("").then((data) => data),
      httpClient.get("/Showtime?skip=0&top=1000").then((res) => res.data.value),
    ]).then(([cinemas, rooms, timeSlots, movies, showtimes]) => {
      setCinemas(cinemas.value || cinemas); // value nếu trả về paginated
      setRooms(rooms);
      setTimeSlots(timeSlots);
      setMovies(movies);
      setShowtimes(showtimes);
      setSelectedCinema((cinemas.value?.[0]?.cinemaId || cinemas[0]?.cinemaId) ?? "");
    }).finally(() => setLoading(false));
  }, []);

  // Generate dates for the week
  const getWeekDates = (date: Date) => {
    const week = [];
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  };
  const weekDates = getWeekDates(currentDate);

  // Filter rooms/showtimes theo cinema
  const filteredRooms = rooms.filter((r) => r.cinemaId === selectedCinema);
  const filteredShowtimes = showtimes.filter((st) => filteredRooms.some((r) => r.roomId === st.roomId));

  // Lấy showtime cho slot
  const getShowtimeForSlot = (roomId: string, timeSlotId: string, date: string) => {
    return filteredShowtimes.find(
      (st) => st.roomId === roomId && st.timeSlotId === timeSlotId && st.date?.slice(0, 10) === date
    );
  };

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === "next" ? 7 : -7));
    setCurrentDate(newDate);
  };

  // Thêm/sửa showtime
  const handleSaveShowtime = async (data: any) => {
    setLoading(true);
    try {
      if (data.showtimeId) {
        // Update
        await httpClient.put(`/Showtime/${data.showtimeId}`, data);
      } else {
        // Create
        await httpClient.post("/Showtime", data);
      }
      // Reload showtimes
      const res = await httpClient.get("/Showtime?skip=0&top=1000");
      setShowtimes(res.data.value);
      setIsDialogOpen(false);
    } catch (e) {
      alert("Có lỗi khi lưu showtime");
    } finally {
      setLoading(false);
    }
  };

  // Xóa showtime
  const handleDeleteShowtime = async (showtimeId: string) => {
    if (!window.confirm("Bạn có chắc muốn xóa lịch chiếu này?")) return;
    setLoading(true);
    try {
      await httpClient.delete(`/Showtime/${showtimeId}`);
      const res = await httpClient.get("/Showtime?skip=0&top=1000");
      setShowtimes(res.data.value);
    } catch (e) {
      alert("Có lỗi khi xóa showtime");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Showtime Calendar</h1>
            <p className="text-muted-foreground">Visual schedule management</p>
          </div>
          <Button
            onClick={() => {
              setSelectedShowtime(null);
              setIsDialogOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Showtime
          </Button>
        </div>
        <div className="flex gap-2">
          {cinemas.map((cinema) => (
            <Button
              key={cinema.cinemaId}
              variant={selectedCinema === cinema.cinemaId ? "default" : "outline"}
              onClick={() => setSelectedCinema(cinema.cinemaId)}
            >
              <MapPin className="h-4 w-4 mr-2" />
              {cinema.name}
            </Button>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => navigateWeek("prev")}> <ChevronLeft className="h-4 w-4" /> </Button>
          <h2 className="text-xl font-semibold">
            {weekDates[0].toLocaleDateString()} - {weekDates[6].toLocaleDateString()}
          </h2>
          <Button variant="outline" onClick={() => navigateWeek("next")}> <ChevronRight className="h-4 w-4" /> </Button>
        </div>
        <Card>
          <CardContent className="p-0">
            <div className="grid grid-cols-8 border-b">
              <div className="p-4 font-semibold border-r">Room / Time</div>
              {weekDates.map((date, index) => (
                <div key={index} className="p-4 text-center border-r last:border-r-0">
                  <div className="font-semibold">{date.toLocaleDateString("en", { weekday: "short" })}</div>
                  <div className="text-sm text-muted-foreground">{date.getDate()}</div>
                </div>
              ))}
            </div>
            {filteredRooms.map((room) => (
              <div key={room.roomId}>
                <div className="grid grid-cols-8 border-b">
                  <div className="p-4 font-medium border-r bg-muted/50">
                    Room {room.roomNumber}
                    <div className="text-sm text-muted-foreground">{room.totalSeats} seats</div>
                  </div>
                  {weekDates.map((date, dateIndex) => (
                    <div key={dateIndex} className="border-r last:border-r-0 min-h-[200px]">
                      <div className="p-2 space-y-1">
                        {timeSlots.map((timeSlot) => {
                          const dateStr = date.toISOString().split("T")[0];
                          const showtime = getShowtimeForSlot(room.roomId, timeSlot.timeSlotId, dateStr);
                          const movie = showtime ? movies.find((m) => m.movieId === showtime.movieId) : null;
                          return (
                            <div key={timeSlot.timeSlotId} className="mb-2">
                              {showtime && movie ? (
                                <div className="bg-blue-100 border border-blue-200 rounded p-2 text-xs hover:bg-blue-200 cursor-pointer group relative">
                                  <div className="font-medium truncate">{movie.title}</div>
                                  <div className="flex items-center gap-1 text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    {timeSlot.startTime} - {timeSlot.endTime}
                                  </div>
                                  <div className="text-muted-foreground">${showtime.ticketPrice}</div>
                                  <Badge variant="secondary" className="text-xs">
                                    {/* bookedSeats/totalSeats nếu có */}
                                    {showtime.bookedSeats ?? "-"}/{room.totalSeats}
                                  </Badge>
                                  <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 flex gap-1">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-6 w-6 p-0"
                                      onClick={() => {
                                        setSelectedShowtime(showtime);
                                        setIsDialogOpen(true);
                                      }}
                                    >
                                      <Edit className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-6 w-6 p-0 text-red-600"
                                      onClick={() => handleDeleteShowtime(showtime.showtimeId)}
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <div
                                  className="border-2 border-dashed border-gray-200 rounded p-2 text-xs text-center text-muted-foreground hover:border-gray-300 cursor-pointer"
                                  onClick={() => {
                                    setSelectedShowtime({
                                      roomId: room.roomId,
                                      timeSlotId: timeSlot.timeSlotId,
                                      date: dateStr,
                                    });
                                    setIsDialogOpen(true);
                                  }}
                                >
                                  <div>{timeSlot.startTime} - {timeSlot.endTime}</div>
                                  <div>+ Add</div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        {/* <ShowtimeDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          showtime={selectedShowtime}
          onSave={handleSaveShowtime}
          movies={movies}
          rooms={filteredRooms}
          timeSlots={timeSlots}
        /> */}
        {loading && <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"><div className="bg-white p-4 rounded shadow">Loading...</div></div>}
      </div>
    </>
  );
} 