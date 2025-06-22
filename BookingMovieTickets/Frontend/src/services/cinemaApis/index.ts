import httpClient from "../../config/httpClient";
import type { PaginatedResponse } from "@/types/paginated-response";
import type { components } from "@/types/api-types";

type CinemaResponseDTO = components["schemas"]["CinemaResponseDTO"];

export const getCinemas = (
  pageNumber: number,
  pageSize: number,
  searchTerm?: string
): Promise<PaginatedResponse<CinemaResponseDTO>> => {
  let query = `pageNumber=${pageNumber}&pageSize=${pageSize}`;
  
  if (searchTerm) {
    query += `&search=${encodeURIComponent(searchTerm)}`;
  }

  return httpClient.get(`/cinemas?${query}`);
};