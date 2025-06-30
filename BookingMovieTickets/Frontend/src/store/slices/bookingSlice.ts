import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface SeatStatus {
  seatId: string;
  seatNumber: string;
  row: string;
  seatColumn: number;
  isAvailable: boolean;
  isBooked: boolean;
}

export interface BookingState {
  movieId: string | null;
  movieTitle: string | null;
  selectedDate: string | null;
  selectedCinema: {
    cinemaId: string;
    cinemaName: string;
    cinemaAddress?: string;
  } | null;
  selectedShowtime: {
    showtimeId: string;
    timeSlot: {
      timeSlotId: string;
      startTime: string;
      endTime: string;
    };
    ticketPrice: number;
    roomId: string;
    roomNumber: string;
  } | null;
  selectedSeats: string[];
  totalPrice: number;
  seatData: {
    roomId: string | null;
    roomNumber: string | null;
    totalSeats: number;
    seats: SeatStatus[];
  };
}

const initialState: BookingState = {
  movieId: null,
  movieTitle: null,
  selectedDate: null,
  selectedCinema: null,
  selectedShowtime: null,
  selectedSeats: [],
  totalPrice: 0,
  seatData: {
    roomId: null,
    roomNumber: null,
    totalSeats: 0,
    seats: [],
  },
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setMovieInfo(state, action: PayloadAction<{ movieId: string; movieTitle: string }>) {
      state.movieId = action.payload.movieId;
      state.movieTitle = action.payload.movieTitle;
    },

    setBookingDetails(
      state,
      action: PayloadAction<{
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
      }>
    ) {
      state.selectedDate = action.payload.date;
      state.selectedCinema = action.payload.cinema;
      state.selectedShowtime = action.payload.showtime;
      state.totalPrice = 0;
      state.selectedSeats = [];
      state.seatData = {
        roomId: null,
        roomNumber: null,
        totalSeats: 0,
        seats: [],
      };
    },

    setSelectedSeats(state, action: PayloadAction<string[]>) {
      state.selectedSeats = action.payload;
      state.totalPrice = action.payload.length * (state.selectedShowtime?.ticketPrice || 0);
    },

    addSelectedSeat(state, action: PayloadAction<string>) {
      if (!state.selectedSeats.includes(action.payload) && state.selectedSeats.length < 6) {
        state.selectedSeats.push(action.payload);
        state.totalPrice = state.selectedSeats.length * (state.selectedShowtime?.ticketPrice || 0);
      }
    },

    removeSelectedSeat(state, action: PayloadAction<string>) {
      state.selectedSeats = state.selectedSeats.filter(seat => seat !== action.payload);
      state.totalPrice = state.selectedSeats.length * (state.selectedShowtime?.ticketPrice || 0);
    },

    setSeatData(
      state,
      action: PayloadAction<{
        roomId: string;
        roomNumber: string;
        totalSeats: number;
        seats: SeatStatus[];
      }>
    ) {
      state.seatData.roomId = action.payload.roomId;
      state.seatData.roomNumber = action.payload.roomNumber;
      state.seatData.totalSeats = action.payload.totalSeats;
      state.seatData.seats = action.payload.seats;
    },

    clearBooking(state) {
      state.movieId = null;
      state.movieTitle = null;
      state.selectedDate = null;
      state.selectedCinema = null;
      state.selectedShowtime = null;
      state.selectedSeats = [];
      state.totalPrice = 0;
      state.seatData = {
        roomId: null,
        roomNumber: null,
        totalSeats: 0,
        seats: [],
      };
    },
  },
});

export const {
  setMovieInfo,
  setBookingDetails,
  setSelectedSeats,
  addSelectedSeat,
  removeSelectedSeat,
  setSeatData,
  clearBooking,
} = bookingSlice.actions;

export default bookingSlice.reducer; 