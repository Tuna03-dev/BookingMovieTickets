import httpClient from "../../config/httpClient";

export const cinemaApis = {
  getCinemas: async () => {
    const res = await httpClient.get("/Cinema");
    return res.data;
  },
};
