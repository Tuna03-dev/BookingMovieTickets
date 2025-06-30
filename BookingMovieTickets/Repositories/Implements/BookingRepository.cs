using BookingMovieTickets.Models;
using BookingMovieTickets.Data;
using System;
using System.Threading.Tasks;

namespace BookingMovieTickets.Repositories.Implements
{
    public class BookingRepository : BaseRepository<Booking>, IBookingRepository
    {
        public BookingRepository(BookingMovieTicketsContext context) : base(context) { }

        public async Task<Booking> CreateBookingAsync(Booking booking)
        {
            return await AddAsync(booking);
        }

        public async Task<Booking?> GetBookingByIdAsync(Guid bookingId)
        {
            return await GetByIdAsync(bookingId);
        }
    }
} 