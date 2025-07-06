import { httpClient } from "@/config/httpClient";

export interface Seat {
  deletedAt: string | null;
  seatId: string;
  roomId: string;
  row: string;
  seatColumn: number;
  seatNumber: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSeatDTO {
  roomId: string;
  row: string;
  seatColumn: number;
  seatNumber: string;
}

export interface UpdateSeatDTO {
  row?: string;
  seatColumn?: number;
  seatNumber?: string;
}

export interface SeatLayoutDTO {
  roomId: string;
  rows: number;
  columns: number;
}

export const seatApi = {
  getSeatsByRoom: async (roomId: string): Promise<Seat[]> => {
    const response = await httpClient.get<Seat[]>(`/Seat/room/${roomId}`);
    return response.data;
  },
  getSeatById: async (seatId: string): Promise<Seat> => {
    const response = await httpClient.get<Seat>(`/Seat/${seatId}`);
    return response.data;
  },
  createSeat: async (seatData: CreateSeatDTO): Promise<Seat> => {
    const response = await httpClient.post<Seat>("/Seat", seatData);
    return response.data;
  },
  updateSeat: async (
    seatId: string,
    seatData: UpdateSeatDTO
  ): Promise<Seat> => {
    const response = await httpClient.put<Seat>(`/Seat/${seatId}`, seatData);
    return response.data;
  },
  deleteSeat: async (seatId: string): Promise<void> => {
    await httpClient.delete(`/Seat/${seatId}`);
  },
  generateSeatLayout: async (layoutData: SeatLayoutDTO): Promise<Seat[]> => {
    const response = await httpClient.post<Seat[]>(
      "/Seats/generate-layout",
      layoutData
    );
    return response.data;
  },
  deleteSeats: async (seatIds: string[]): Promise<void> => {
    await httpClient.delete("/Seat/bulk", {
      data: { seatIds },
    });
  },
  hasBooking: async (roomId: string): Promise<boolean> => {
    const response = await httpClient.get<boolean>(
      `/Seat/room/${roomId}/has-booking`
    );
    return response.data;
  },
  addRow: async (roomId: string): Promise<Seat[]> => {
    const response = await httpClient.post<Seat[]>(`/Seat/add-row/${roomId}`);
    return response.data;
  },
  addColumn: async (roomId: string): Promise<Seat[]> => {
    const response = await httpClient.post<Seat[]>(
      `/Seat/add-column/${roomId}`
    );
    return response.data;
  },
};
