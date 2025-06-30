import { httpClient } from "@/config/httpClient";
import type { components } from "@/types/api-types";

export type Seat = components["schemas"]["Seat"];

export type SeatDTO = {
  seatId: string;
  row: string;
  seatColumn: number;
  seatNumber?: string;
  seatType?: string;
  isAvailable: boolean;
};

export type SeatStatusDTO = {
  showtimeId: string;
  seats: SeatDTO[];
  bookedSeatIds: string[];
};

export const seatApi = {
  // Lấy trạng thái tất cả ghế cho một showtime
  getSeatStatusByShowtime: async (
    showtimeId: string
  ): Promise<SeatStatusDTO> => {
    const res = await httpClient.get<SeatStatusDTO>(
      `/seat/showtime/${showtimeId}`
    );
    return res.data;
  },

  
  getAvailableSeatsByShowtime: async (
    showtimeId: string
  ): Promise<SeatDTO[]> => {
    const res = await httpClient.get<SeatDTO[]>(
      `/seat/showtime/${showtimeId}/available`
    );
    return res.data;
  },

  
  getBookedSeatIdsByShowtime: async (showtimeId: string): Promise<string[]> => {
    const res = await httpClient.get<string[]>(
      `/seat/showtime/${showtimeId}/booked`
    );
    return res.data;
  },
};
