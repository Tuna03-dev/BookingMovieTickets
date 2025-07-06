import httpClient from "@/config/httpClient";

export interface RoomResponseDTO {
  roomId: string;
  cinemaId: string;
  roomNumber: string;
  totalSeats: number;
  createdAt?: string;
  updatedAt?: string;
}

export const showtimeApi = {
  getShowtimes: async (movieId: string, date: string) => {
    const response = await httpClient.get(
      `/Showtime/movie/${movieId}/date/${date}`
    );
    return response.data;
  },
  getRoomsByCinema: async (cinemaId: string): Promise<RoomResponseDTO[]> => {
    const response = await httpClient.get<RoomResponseDTO[]>(
      `/Room/by-cinema/${cinemaId}`
    );
    return response.data;
  },
};
