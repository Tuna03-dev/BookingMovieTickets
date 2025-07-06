using BookingMovieTickets.Data;
using BookingMovieTickets.Models;
using Microsoft.EntityFrameworkCore;

namespace BookingMovieTickets.Repositories.Implements
{
    public class ShowtimeRepository : BaseRepository<Showtime>, IShowtimeRepository
    {
        public ShowtimeRepository(BookingMovieTicketsContext context) : base(context)
        {
        }
        // Có thể bổ sung các method đặc thù nếu cần
        public override async Task<bool> DeleteAsync(Guid id)
        {
            var showtime = await _context.Showtimes
                .Include(s => s.Bookings)
                .ThenInclude(b => b.BookingSeats)
                .FirstOrDefaultAsync(s => s.ShowtimeId == id);
            if (showtime == null) return false;
            // Nếu có booking nào hoặc có bookingseat nào thì không cho xóa
            if (showtime.Bookings.Any() && showtime.Bookings.Any(b => b.BookingSeats.Any()))
                return false;
            showtime.DeletedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return true;
        }
    }
} 