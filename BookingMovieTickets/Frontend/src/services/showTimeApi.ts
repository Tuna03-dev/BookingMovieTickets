import httpClient from "@/config/httpClient";

export const showtimeApi = {
  getShowtimes: async (movieId: string, date: string) => {
    const response = await httpClient.get(
      `/Showtime/movie/${movieId}/date/${date}`
    );
    return response.data;
  },
};
