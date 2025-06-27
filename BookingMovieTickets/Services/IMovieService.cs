using System.Collections.Generic;
using System.Threading.Tasks;
using BookingMovieTickets.DTOs;
using BookingMovieTickets.DTOs.Responses;
using BookingMovieTickets.Models;

namespace BookingMovieTickets.Services
{
    public interface IMovieService
    {
        Task<PaginatedResponse<Movie>> GetMoviesAsync(int pageNumber, int pageSize);
        Task<Movie> GetFeaturedMovieAsync();
        Task<List<Movie>> GetNowShowingMoviesAsync();
        Task<List<Movie>> GetComingSoonMoviesAsync();
        Task<IEnumerable<Movie>> GetAllMoviesQueryable();
        Task<MovieResponseDTO?> GetByIdAsync(Guid id);
        Task<List<CinemaShowtimeDTO>> GetShowtimesByMovieAndDateAsync(Guid movieId, DateTime date);
    }
}
