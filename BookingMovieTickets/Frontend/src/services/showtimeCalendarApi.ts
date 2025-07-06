import { httpClient } from "@/config/httpClient";

export interface RoomCalendarDTO {
  roomId: string;
  roomNumber: string;
  totalSeats: number;
}

export interface TimeSlotCalendarDTO {
  timeSlotId: string;
  startTime: string;
  endTime: string;
}

export interface ShowtimeCalendarItemDTO {
  showtimeId: string;
  roomId: string;
  timeSlotId: string;
  date: string;
  movieTitle: string;
  moviePoster: string;
  ticketPrice: number;
  bookedSeats: number;
  totalSeats: number;
}

export interface ShowtimeCalendarResponseDTO {
  rooms: RoomCalendarDTO[];
  timeSlots: TimeSlotCalendarDTO[];
  showtimes: ShowtimeCalendarItemDTO[];
}

export const showtimeCalendarApi = {
  getCalendar: async (
    cinemaId: string,
    fromDate: string,
    toDate: string
  ): Promise<ShowtimeCalendarResponseDTO> => {
    const response = await httpClient.get<ShowtimeCalendarResponseDTO>(
      `/showtimecalendar?cinemaId=${cinemaId}&fromDate=${fromDate}&toDate=${toDate}`
    );
    return response.data;
  },
  createShowtime: async (data: {
    movieId: string;
    roomId: string;
    timeSlotId: string;
    date: string;
    ticketPrice: number;
  }) => {
    await httpClient.post("/showtime", data);
  },
  updateShowtime: async (data: {
    showtimeId: string;
    movieId: string;
    ticketPrice: number;
  }) => {
    await httpClient.put(`/showtime/${data.showtimeId}`, {
      showtimeId: data.showtimeId,
      movieId: data.movieId,
      ticketPrice: data.ticketPrice,
    });
  },
  deleteShowtime: async (showtimeId: string) => {
    await httpClient.delete(`/api/showtime/${showtimeId}`);
  },
};
