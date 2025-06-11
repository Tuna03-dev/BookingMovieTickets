using BookingMovieTickets.DTOs.Responses;
using BookingMovieTickets.Models;

namespace BookingMovieTickets.Services
{
    public interface IMovieService
    {
        Task<PaginatedResponse<Movie>> GetMoviesAsync(int pageNumber, int pageSize);

    }
}
