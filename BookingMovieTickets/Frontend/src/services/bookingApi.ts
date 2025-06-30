import { httpClient } from "@/config/httpClient";

export interface CreateBookingDTO {
  showtimeId: string;
  selectedSeatIds: string[];
  totalPrice: number;
  userId: string;
}

export interface PaymentRequestDTO {
  userId: string;
  showtimeId: string;
  selectedSeatIds: string[];
  totalPrice: number;
  paymentMethod?: string;
}

export interface PaymentResponseDTO {
  bookingId: string;
  paymentId: string;
  message: string;
}

export const bookingApi = {
  createBooking: async (data: CreateBookingDTO) => {
    const res = await httpClient.post("/booking", data);
    return res.data;
  },
  createPayment: async (
    data: PaymentRequestDTO
  ): Promise<PaymentResponseDTO> => {
    const res = await httpClient.post("/payment", data);
    return res.data as PaymentResponseDTO;
  },
};
