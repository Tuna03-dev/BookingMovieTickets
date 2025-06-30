import { useAppSelector, useAppDispatch } from "@/store";
import { useCallback, useState } from "react";
import {
  setMovieInfo,
  setBookingDetails,
  setSelectedSeats,
  addSelectedSeat,
  removeSelectedSeat,
  setSeatData,
  clearBooking,
} from "@/store/slices/bookingSlice";
import { seatApi, type SeatStatusDTO } from "@/services/seatApi";

export const useBooking = () => {
  const dispatch = useAppDispatch();
  const booking = useAppSelector((state) => state.booking);
  const [isLoadingSeats, setIsLoadingSeats] = useState(false);
  const [seatError, setSeatError] = useState<string | null>(null);

  const setMovie = (movieId: string, movieTitle: string) => {
    dispatch(setMovieInfo({ movieId, movieTitle }));
  };

  const setBooking = (details: {
    date: string;
    cinema: {
      cinemaId: string;
      cinemaName: string;
      cinemaAddress?: string;
    };
    showtime: {
      showtimeId: string;
      timeSlot: {
        timeSlotId: string;
        startTime: string;
        endTime: string;
      };
      ticketPrice: number;
      roomId: string;
      roomNumber: string;
    };
  }) => {
    dispatch(setBookingDetails(details));
  };

  const selectSeat = (seatId: string) => {
    dispatch(addSelectedSeat(seatId));
  };

  const unselectSeat = (seatId: string) => {
    dispatch(removeSelectedSeat(seatId));
  };

  const setSeats = (seats: string[]) => {
    dispatch(setSelectedSeats(seats));
  };

  const clear = () => {
    dispatch(clearBooking());
  };

  const loadSeatData = useCallback(
    async (showtimeId: string) => {
      if (!showtimeId) return;

      setIsLoadingSeats(true);
      setSeatError(null);

      try {
        const seatStatus: SeatStatusDTO = await seatApi.getSeatStatusByShowtime(
          showtimeId
        );

        const seats = seatStatus.seats.map((seat) => ({
          seatId: seat.seatId,
          seatNumber: seat.seatNumber || `${seat.row}${seat.seatColumn}`,
          row: seat.row,
          seatColumn: seat.seatColumn,
          isAvailable: seat.isAvailable,
          isBooked: seatStatus.bookedSeatIds.includes(seat.seatId),
        }));

        const roomId = booking.selectedShowtime?.roomId || "";
        const roomNumber = booking.selectedShowtime?.roomNumber || "A1";
        const totalSeats = seats.length;

        dispatch(
          setSeatData({
            roomId,
            roomNumber,
            totalSeats,
            seats,
          })
        );
      } catch (error) {
        console.error("Error loading seat data:", error);
        setSeatError("Không thể tải thông tin ghế ngồi");

        const fallbackSeats = generateFallbackSeats();
        dispatch(
          setSeatData({
            roomId: booking.selectedShowtime?.roomId || "",
            roomNumber: "A1",
            totalSeats: fallbackSeats.length,
            seats: fallbackSeats,
          })
        );
      } finally {
        setIsLoadingSeats(false);
      }
    },
    [dispatch, booking.selectedShowtime?.roomId]
  );

  const generateFallbackSeats = () => {
    const seats = [];
    const rows = ["A", "B", "C", "D", "E"];
    const seatsPerRow = 10;

    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      for (let col = 1; col <= seatsPerRow; col++) {
        const seatId = `fallback-${rows[rowIndex]}-${col}`;
        seats.push({
          seatId,
          seatNumber: `${rows[rowIndex]}${col}`,
          row: rows[rowIndex],
          seatColumn: col,
          isAvailable: true,
          isBooked: false,
        });
      }
    }
    return seats;
  };

  const updateSeatData = (data: {
    roomId: string;
    roomNumber: string;
    totalSeats: number;
    seats: Array<{
      seatId: string;
      seatNumber: string;
      row: string;
      seatColumn: number;
      isAvailable: boolean;
      isBooked: boolean;
    }>;
  }) => {
    dispatch(setSeatData(data));
  };

  const isBookingComplete = () => {
    return !!(
      booking.movieId &&
      booking.selectedShowtime &&
      booking.selectedCinema &&
      booking.selectedDate
    );
  };

  const hasSelectedSeats = () => {
    return booking.selectedSeats.length > 0;
  };

  const getSeatStatus = useCallback(
    (seatId: string): "available" | "occupied" | "selected" => {
      const seat = booking.seatData.seats.find((s) => s.seatId === seatId);
      if (!seat) return "available";

      if (seat.isBooked || !seat.isAvailable) return "occupied";
      if (booking.selectedSeats.includes(seatId)) return "selected";
      return "available";
    },
    [booking.seatData.seats, booking.selectedSeats]
  );

  return {
    booking,
    setMovie,
    setBooking,
    selectSeat,
    unselectSeat,
    setSeats,
    clear,
    updateSeatData,
    loadSeatData,
    isLoadingSeats,
    seatError,
    isBookingComplete,
    hasSelectedSeats,
    getSeatStatus,
  };
};
