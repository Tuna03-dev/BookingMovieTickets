import { httpClient } from "@/config/httpClient";
import type { components } from "@/types/api-types";

export type Movie = components["schemas"]["Movie"];

export type MovieResponseDTO = {
  movieId: string;
  title: string;
  description?: string;
  genre?: string;
  duration: number;
  releaseDate?: string;
  posterUrl?: string;
  status: string;
  director?: string;
  actors?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type MovieCreateDTO = {
  title: string;
  description?: string;
  genre?: string;
  duration: number;
  releaseDate?: string;
  status: "Đang chiếu" | "Sắp chiếu" | "Ngừng chiếu";
  director?: string;
  actors?: string;
  posterFile: File;
};

export type MovieUpdateDTO = {
  title: string;
  description?: string;
  genre?: string;
  duration: number;
  releaseDate?: string;
  status: "Đang chiếu" | "Sắp chiếu" | "Ngừng chiếu";
  director?: string;
  actors?: string;
  poster?: File;
};

export const movieApis = {
  getNowShowing: async () => {
    const res = await httpClient.get<Movie[]>("/Movie/now-showing");
    return res.data;
  },
  getComingSoon: async () => {
    const res = await httpClient.get<Movie[]>("/Movie/coming-soon");
    return res.data;
  },
  getFeatured: async () => {
    const res = await httpClient.get<Movie>("/Movie/featured");
    return res.data;
  },
  getOdataMovies: async (query: string) => {
    const res = await httpClient.get<Movie[]>(`/Movie/odata?${query}`);
    return res.data;
  },
  getMovieById: async (id: string) => {
    const res = await httpClient.get<MovieResponseDTO>("/Movie/" + id);
    return res.data;
  },
  createMovie: async (data: FormData) => {
    const res = await httpClient.post("/Movie", data, {
      headers: { "Content-Type": undefined },
    });
    return res.data;
  },
  updateMovie: async (id: string, data: FormData) => {
    const res = await httpClient.put(`/Movie/${id}`, data, {
      headers: { "Content-Type": undefined },
    });
    return res.data;
  },
  deleteMovie: async (id: string) => {
    const res = await httpClient.delete(`/Movie/${id}`);
    return res.data;
  },
  softDeleteUnusedMovies: async () => {
    const res = await httpClient.post('/Movie/soft-delete-unused');
    return res.data;
  },
  softDeleteMovieById: async (id: string) => {
    const res = await httpClient.post(`/Movie/${id}/soft-delete`);
    return res.data;
  },
};
