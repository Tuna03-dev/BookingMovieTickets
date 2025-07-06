import httpClient from "../../config/httpClient";

export const cinemaApis = {
  getCinemas: async () => {
    const res = await httpClient.get("/Cinema");
    return res.data;
  },
  createCinema: async (data: any) => {
    const res = await httpClient.post("/Cinema", data);
    return res.data;
  },
  updateCinema: async (id: string, data: any) => {
    const res = await httpClient.put(`/Cinema/${id}`, data);
    return res.data;
  },
  deleteCinema: async (id: string) => {
    const res = await httpClient.delete(`/Cinema/${id}`);
    return res.data;
  },
};
