using BookingMovieTickets.Models;
using BookingMovieTickets.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace BookingMovieTickets.Repositories.Implements
{
    public class PaymentRepository : BaseRepository<Payment>, IPaymentRepository
    {
        public PaymentRepository(BookingMovieTicketsContext context) : base(context)
        {
        }

        public async Task<Payment> CreatePaymentAsync(Payment payment)
        {
            return await AddAsync(payment);
        }

        public async Task<Payment?> GetPaymentByIdAsync(Guid paymentId)
        {
            return await GetByIdAsync(paymentId);
        }

        public async Task<List<Payment>> GetPaymentsByBookingIdAsync(Guid bookingId)
        {
            return await _dbSet.Where(p => p.BookingId == bookingId).ToListAsync();
        }

        public async Task<List<Payment>> GetAllPaymentsAsync()
        {
            var result = await GetAllAsync();
            return result.ToList();
        }

        public async Task<Payment?> UpdatePaymentAsync(Payment payment)
        {
            return await UpdateAsync(payment.PaymentId, payment);
        }

        public async Task<bool> DeletePaymentAsync(Guid paymentId)
        {
            return await DeleteAsync(paymentId);
        }
    }
} 