import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import type { Movie } from "@/services/movieApis";
import { showtimeCalendarApi } from "@/services/showtimeCalendarApi";

export function ShowtimeDialog({
  open,
  onOpenChange,
  onSuccess,
  roomId,
  timeSlotId,
  date,
  movies,
  showtime,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSuccess: () => void;
  roomId: string;
  timeSlotId: string;
  date: string;
  movies: Movie[];
  showtime?: any;
}) {
  const [movieId, setMovieId] = useState("");
  const [ticketPrice, setTicketPrice] = useState(100000);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (showtime && showtime.movieId) {
      setMovieId(String(showtime.movieId));
      setTicketPrice(showtime.ticketPrice);
    } else {
      setMovieId("");
      setTicketPrice(100000);
    }
  }, [showtime, open]);

  const handleSubmit = async () => {
    if (!movieId || !ticketPrice) {
      toast.error("Vui lòng chọn phim và nhập giá vé");
      return;
    }
    setLoading(true);
    try {
      if (showtime) {
        await showtimeCalendarApi.updateShowtime({
          showtimeId: showtime.showtimeId,
          movieId,
          ticketPrice,
        });
        toast.success("Cập nhật lịch chiếu thành công!");
      } else {
        await showtimeCalendarApi.createShowtime({
          movieId,
          roomId,
          timeSlotId,
          date,
          ticketPrice,
        });
        toast.success("Tạo lịch chiếu thành công!");
      }
      onOpenChange(false);
      onSuccess();
    } catch (e) {
      toast.error(
        showtime ? "Cập nhật lịch chiếu thất bại!" : "Tạo lịch chiếu thất bại!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {showtime ? "Chỉnh sửa Lịch Chiếu" : "Thêm Lịch Chiếu"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {showtime && (
            <div className="flex items-center gap-4 p-2 border rounded bg-muted/30">
              {showtime.moviePoster && (
                <img
                  src={showtime.moviePoster}
                  alt="Poster"
                  className="w-16 h-24 object-cover rounded"
                />
              )}
              <div>
                <div className="font-semibold text-base">
                  {showtime.movieTitle}
                </div>
              </div>
            </div>
          )}
          <div>
            <label className="block mb-1">Phim</label>
            <Select value={movieId} onValueChange={setMovieId}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn phim" />
              </SelectTrigger>
              <SelectContent>
                {movies.map((movie) => (
                  <SelectItem
                    key={String(movie.movieId)}
                    value={String(movie.movieId)}
                  >
                    {movie.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block mb-1">Giá vé (VNĐ)</label>
            <Input
              type="number"
              value={ticketPrice}
              onChange={(e) => setTicketPrice(Number(e.target.value))}
              min={10000}
              step={1000}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Đang lưu..." : showtime ? "Lưu" : "Tạo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
