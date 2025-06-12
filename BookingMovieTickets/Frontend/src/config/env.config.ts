export const ENV = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  TIMEOUT: 10000, // 10 seconds
  VERSION: '1.0.0',
} as const; 