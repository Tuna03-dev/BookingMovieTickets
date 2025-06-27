using System.Threading.Tasks;
using BookingMovieTickets.Models;
using BookingMovieTickets.Repositories;

public interface IStatsRepository : IRepository<Movie>
{
    Task<int> GetMoviesCountAsync();
    Task<int> GetCinemasCountAsync();
    Task<int> GetCustomersCountAsync();
   
} 