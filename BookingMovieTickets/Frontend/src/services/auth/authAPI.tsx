import httpClient from "@/config/httpClient";
import type { LoginRequest, RegisterRequest } from "@/types";

const authAPI = {
  login: (data: LoginRequest) => {
    return httpClient.post("/auth/login", data);
  },

  register: (data: RegisterRequest) => {
    return httpClient.post("/auth/register", data);
  },

  logout: () => {
    return httpClient.post("/auth/logout");
  },

  getCurrentUser: () => {
    return httpClient.get("/auth/me");
  },
};

export default authAPI;
