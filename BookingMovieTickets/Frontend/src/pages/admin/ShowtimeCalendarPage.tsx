import { useEffect, useState } from "react";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Edit,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cinemaApis } from "@/services/cinemaApis";
import {
  showtimeCalendarApi,
  type ShowtimeCalendarResponseDTO,
} from "@/services/showtimeCalendarApi";
import { movieApis, type Movie } from "@/services/movieApis";
import { ShowtimeDialog } from "./components/ShowtimeDialog";
import dayjs from "dayjs";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export default function ShowtimeCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [cinemas, setCinemas] = useState<any[]>([]);
  const [selectedCinema, setSelectedCinema] = useState<string>("");
  const [calendar, setCalendar] = useState<ShowtimeCalendarResponseDTO | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState<{
    roomId: string;
    timeSlotId: string;
    date: string;
    showtime?: any;
  } | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; showtimeId?: string }>({ open: false });

  // Fetch cinemas and movies on mount
  useEffect(() => {
    (async () => {
      const res = await cinemaApis.getCinemas();
      const cinemaList = Array.isArray(res.items) ? res.items : [];
      setCinemas(cinemaList);
      if (cinemaList.length > 0) setSelectedCinema(cinemaList[0].cinemaId);
    })();
    (async () => {
      const res = await movieApis.getOdataMovies("");
      const movieList = Array.isArray(res) ? res : [];
      setMovies(movieList);
    })();
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

  // Fetch calendar data when cinema or week changes
  useEffect(() => {
    if (!selectedCinema) return;
    setLoading(true);
    const from = dayjs(weekDates[0]).format("YYYY-MM-DD");
    const to = dayjs(weekDates[6]).format("YYYY-MM-DD");
    showtimeCalendarApi
      .getCalendar(selectedCinema, from, to)
      .then(setCalendar)
      .finally(() => setLoading(false));
  }, [selectedCinema, currentDate]);

  const reloadCalendar = () => {
    if (!selectedCinema) return;
    const from = dayjs(weekDates[0]).format("YYYY-MM-DD");
    const to = dayjs(weekDates[6]).format("YYYY-MM-DD");
    showtimeCalendarApi.getCalendar(selectedCinema, from, to).then(setCalendar);
  };

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === "next" ? 7 : -7));
    setCurrentDate(newDate);
  };

  // Lấy showtime cho slot
  const getShowtimeForSlot = (
    roomId: string,
    timeSlotId: string,
    date: string
  ) => {
    return calendar?.showtimes.find(
      (st) =>
        st.roomId === roomId &&
        st.timeSlotId === timeSlotId &&
        st.date.slice(0, 10) === date
    );
  };

  // Sắp xếp timeslot theo thời gian tăng dần
  const sortedTimeSlots = (calendar?.timeSlots || [])
    .slice()
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const now = dayjs();

  const handleDeleteShowtime = async () => {
    if (!deleteDialog.showtimeId) return;
    try {
      await showtimeCalendarApi.deleteShowtime(deleteDialog.showtimeId);
      toast.success("Đã xóa lịch chiếu!");
      reloadCalendar();
    } catch {
      toast.error("Xóa lịch chiếu thất bại!");
    } finally {
      setDeleteDialog({ open: false });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Showtime Calendar</h1>
          <p className="text-muted-foreground">Visual schedule management</p>
        </div>
      </div>
      <div className="flex gap-2 mb-4">
        {cinemas.map((cinema) => (
          <Button
            key={cinema.cinemaId}
            variant={
              selectedCinema === cinema.cinemaId ? "destructive" : "outline"
            }
            onClick={() => setSelectedCinema(cinema.cinemaId)}
          >
            <MapPin className="h-4 w-4 mr-2" />
            {cinema.name}
          </Button>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => navigateWeek("prev")}>
          {" "}
          <ChevronLeft className="h-4 w-4" />{" "}
        </Button>
        <h2 className="text-xl font-semibold">
          {weekDates[0].toLocaleDateString()} -{" "}
          {weekDates[6].toLocaleDateString()}
        </h2>
        <Button variant="outline" onClick={() => navigateWeek("next")}>
          {" "}
          <ChevronRight className="h-4 w-4" />{" "}
        </Button>
      </div>
      <Card>
        <CardContent className="p-0">
          {calendar?.rooms.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center text-muted-foreground">
              <AlertTriangle className="h-10 w-10 text-yellow-500 mb-4" />
              <div className="text-lg font-semibold mb-2">
                Rạp này chưa có phòng chiếu nào
              </div>
              <div className="text-sm">
                Vui lòng tạo phòng chiếu trước khi quản lý lịch chiếu.
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-8 border-b">
                <div className="p-4 font-semibold border-r">Room / Time</div>
                {weekDates.map((date, index) => (
                  <div
                    key={index}
                    className="p-4 text-center border-r last:border-r-0"
                  >
                    <div className="font-semibold">
                      {date.toLocaleDateString("en", { weekday: "short" })}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {date.getDate()}
                    </div>
                  </div>
                ))}
              </div>
              {calendar?.rooms.map((room) => (
                <div key={room.roomId}>
                  <div className="grid grid-cols-8 border-b">
                    <div className="p-4 font-medium border-r bg-muted/50">
                      Room {room.roomNumber}
                      <div className="text-sm text-muted-foreground">
                        {room.totalSeats} seats
                      </div>
                    </div>
                    {weekDates.map((date, dateIndex) => {
                      const dateStr = date.toISOString().split("T")[0];
                      return (
                        <div
                          key={dateIndex}
                          className="border-r last:border-r-0 min-h-[200px]"
                        >
                          <div className="p-2 space-y-1">
                            {sortedTimeSlots.map((timeSlot) => {
                              const showtime = getShowtimeForSlot(
                                room.roomId,
                                timeSlot.timeSlotId,
                                dateStr
                              );
                              const slotDateTime = dayjs(`${dateStr}T${timeSlot.startTime}`);
                              const isPast = slotDateTime.isBefore(now);
                              return (
                                <div key={timeSlot.timeSlotId} className="mb-2">
                                  {showtime ? (
                                    isPast ? (
                                      <div className="bg-gray-200 border border-gray-300 rounded p-2 text-xs opacity-60 cursor-not-allowed select-none relative">
                                        <div className="font-medium truncate">{showtime.movieTitle}</div>
                                        <div className="flex items-center gap-1 text-muted-foreground">
                                          <Clock className="h-3 w-3" />
                                          {timeSlot.startTime} - {timeSlot.endTime}
                                        </div>
                                        <div className="text-muted-foreground">${showtime.ticketPrice}</div>
                                        <Badge variant="secondary" className="text-xs">
                                          {showtime.bookedSeats ?? "-"}/{room.totalSeats}
                                        </Badge>
                                        <div className="text-[10px] text-red-500 mt-1">Không thể chỉnh sửa quá khứ</div>
                                      </div>
                                    ) : (
                                      <div
                                        className="bg-green-100 border border-green-300 rounded p-2 text-xs hover:bg-green-200 cursor-pointer group relative"
                                        onClick={() => {
                                          setDialogData({
                                            roomId: room.roomId,
                                            timeSlotId: timeSlot.timeSlotId,
                                            date: dateStr,
                                            showtime,
                                          });
                                          setDialogOpen(true);
                                        }}
                                      >
                                        <button
                                          className="absolute top-1 right-1 p-1 rounded hover:bg-red-200 z-10"
                                          onClick={e => {
                                            e.stopPropagation();
                                            setDeleteDialog({ open: true, showtimeId: showtime.showtimeId });
                                          }}
                                          title="Xóa lịch chiếu"
                                        >
                                          <Trash2 className="h-4 w-4 text-red-500" />
                                        </button>
                                        <div className="font-medium truncate">{showtime.movieTitle}</div>
                                        <div className="flex items-center gap-1 text-muted-foreground">
                                          <Clock className="h-3 w-3" />
                                          {timeSlot.startTime} - {timeSlot.endTime}
                                        </div>
                                        <div className="text-muted-foreground">${showtime.ticketPrice}</div>
                                        <Badge variant="secondary" className="text-xs">
                                          {showtime.bookedSeats ?? "-"}/{room.totalSeats}
                                        </Badge>
                                      </div>
                                    )
                                  ) : isPast ? (
                                    <div className="border border-dashed rounded p-2 text-xs text-center text-muted-foreground bg-gray-100 opacity-60 cursor-not-allowed select-none">
                                      {timeSlot.startTime} <br />
                                      <span className="text-[10px]">
                                        Không thể thêm vào quá khứ
                                      </span>
                                    </div>
                                  ) : (
                                    <div
                                      className="border border-dashed rounded p-2 text-xs text-center text-muted-foreground cursor-pointer hover:bg-muted/30"
                                      onClick={() => {
                                        setDialogData({
                                          roomId: room.roomId,
                                          timeSlotId: timeSlot.timeSlotId,
                                          date: dateStr,
                                        });
                                        setDialogOpen(true);
                                      }}
                                    >
                                      {timeSlot.startTime} <br />+ Add
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </>
          )}
        </CardContent>
      </Card>
      {/* Dialog thêm/chỉnh sửa showtime */}
      {dialogData && (
        <ShowtimeDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSuccess={reloadCalendar}
          roomId={dialogData.roomId}
          timeSlotId={dialogData.timeSlotId}
          date={dialogData.date}
          movies={movies}
          showtime={dialogData.showtime}
        />
      )}
      {/* Dialog xác nhận xóa */}
      <Dialog open={deleteDialog.open} onOpenChange={open => setDeleteDialog({ open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa lịch chiếu?</DialogTitle>
          </DialogHeader>
          <div>Bạn có chắc chắn muốn xóa lịch chiếu này? Hành động này không thể hoàn tác.</div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog({ open: false })}>Hủy</Button>
            <Button variant="destructive" onClick={handleDeleteShowtime}>Xóa</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
