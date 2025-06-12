import { httpClient } from '../config/httpClient';

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export const authService = {
  login: async (data: LoginRequest) => {
    const response = await httpClient.post<AuthResponse>('/auth/login', data);
    // Lưu token vào localStorage
    localStorage.setItem('token', response.token);
    return response;
  },

  register: async (data: RegisterRequest) => {
    const response = await httpClient.post<AuthResponse>('/auth/register', data);
    // Lưu token vào localStorage
    localStorage.setItem('token', response.token);
    return response;
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  getCurrentUser: async () => {
    return httpClient.get<AuthResponse['user']>('/auth/me');
  },
}; 