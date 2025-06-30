using BookingMovieTickets.Models;
using System;
using System.Threading.Tasks;

namespace BookingMovieTickets.Repositories
{
    public interface IBookingRepository
    {
        Task<Booking> CreateBookingAsync(Booking booking);
        Task<Booking?> GetBookingByIdAsync(Guid bookingId);
    }
} 