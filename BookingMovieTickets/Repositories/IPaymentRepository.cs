using BookingMovieTickets.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BookingMovieTickets.Repositories
{
    public interface IPaymentRepository
    {
        Task<Payment> CreatePaymentAsync(Payment payment);
        Task<Payment?> GetPaymentByIdAsync(Guid paymentId);
        Task<List<Payment>> GetPaymentsByBookingIdAsync(Guid bookingId);
        Task<List<Payment>> GetAllPaymentsAsync();
        Task<Payment?> UpdatePaymentAsync(Payment payment);
        Task<bool> DeletePaymentAsync(Guid paymentId);
    }
} 