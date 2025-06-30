using BookingMovieTickets.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BookingMovieTickets.Repositories
{
    public interface IBookingSeatRepository
    {
        Task AddRangeAsync(IEnumerable<BookingSeat> bookingSeats);
        Task<List<BookingSeat>> GetBookedSeatsByShowtimeAsync(Guid showtimeId, List<Guid> seatIds);
    }
} 