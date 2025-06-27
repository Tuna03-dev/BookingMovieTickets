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
    const res = await httpClient.get<MovieResponseDTO>('/Movie/' + id);
    return res.data;
    
  }
};
