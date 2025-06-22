using BookingMovieTickets.Data;
using BookingMovieTickets.Models;
using BookingMovieTickets.Repositories.Implements;
using Microsoft.EntityFrameworkCore;

namespace BookingMovieTickets.Repositories.Implements
{
    public class CinemaRepository : BaseRepository<Cinema>, ICinemaRepository
    {
        public CinemaRepository(BookingMovieTicketsContext context) : base(context)
        {
        }

        

    }
}