using BookingMovieTickets.Data;
using BookingMovieTickets.Models;
using BookingMovieTickets.Repositories.Implements;
using Microsoft.EntityFrameworkCore;

namespace BookingMovieTickets.Repositories.Implements
{
    public class SeatRepository : BaseRepository<Seat>, ISeatRepository
    {
        public SeatRepository(BookingMovieTicketsContext context) : base(context)
        {
        }
    }
} 