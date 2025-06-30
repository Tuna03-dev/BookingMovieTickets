using BookingMovieTickets.DTOs;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BookingMovieTickets.Services
{
    public interface IPaymentService
    {
        Task<PaymentResponseDTO> ProcessPaymentAsync(PaymentRequestDTO request);
        Task<PaymentResponseDTO?> GetPaymentByIdAsync(Guid paymentId);
        Task<List<PaymentResponseDTO>> GetPaymentsByBookingIdAsync(Guid bookingId);
    }
} 