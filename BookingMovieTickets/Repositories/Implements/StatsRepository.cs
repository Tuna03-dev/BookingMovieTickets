using BookingMovieTickets.Data;
using BookingMovieTickets.Models;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace BookingMovieTickets.Repositories.Implements
{
    public class StatsRepository : BaseRepository<Movie>, IStatsRepository
    {
        private readonly BookingMovieTicketsContext _context;
        public StatsRepository(BookingMovieTicketsContext context) : base(context)
        {
            _context = context;
        }

        public Task<int> GetMoviesCountAsync() => _context.Movies.CountAsync();
        public Task<int> GetCinemasCountAsync() => _context.Cinemas.CountAsync();
        public Task<int> GetCustomersCountAsync() => _context.Users.CountAsync();
        //public async Task<double> GetAverageRatingAsync()
        //{
        //    return await _context.Movies.AverageAsync(m => m.Rating);
        //}
    }
} 