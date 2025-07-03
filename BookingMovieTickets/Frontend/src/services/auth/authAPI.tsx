import httpClient from "@/config/httpClient";
import type { User } from "@/store/slices/authSlice";
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

  updateProfile: async (data: {
    fullName?: string;
    phoneNumber?: string;
    address?: string;
    dateOfBirth?: string;
  }): Promise<User> => {
    const res = await httpClient.put<User>("/auth/me", data);
    return res.data;
  },

  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return httpClient.post("/auth/me/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

export default authAPI;
