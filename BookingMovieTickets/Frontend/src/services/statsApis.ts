import { httpClient } from "@/config/httpClient";

export interface QuickStats {
  moviesCount: number;
  cinemasCount: number;
  customersCount: number;
}

export const statsApis = {
  getQuickStats: async () => {
    const res = await httpClient.get<QuickStats>("/stats/quick");
    return res.data;
  },
};
