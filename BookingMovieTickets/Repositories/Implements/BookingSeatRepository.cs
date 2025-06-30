using BookingMovieTickets.Models;
using BookingMovieTickets.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookingMovieTickets.Repositories.Implements
{
    public class BookingSeatRepository : BaseRepository<BookingSeat>, IBookingSeatRepository
    {
        public BookingSeatRepository(BookingMovieTicketsContext context) : base(context) { }

        public async Task AddRangeAsync(IEnumerable<BookingSeat> bookingSeats)
        {
            await _dbSet.AddRangeAsync(bookingSeats);
            await _context.SaveChangesAsync();
        }

        public async Task<List<BookingSeat>> GetBookedSeatsByShowtimeAsync(Guid showtimeId, List<Guid> seatIds)
        {
            return await _dbSet
                .Where(bs => seatIds.Contains(bs.SeatId) && bs.Booking.ShowtimeId == showtimeId)
                .ToListAsync();
        }
    }
} 