using BookingMovieTickets.DTOs.Responses;
using BookingMovieTickets.Models;

namespace BookingMovieTickets.Repositories
{
    public interface IMovieRepository
    {
        Task<PaginatedResponse<Movie>> GetAllMoviesAsync(int pageNumber, int pageSize);
        Task<Movie?> GetByIdAsync(Guid id);
        Task<Movie> AddAsync(Movie movie);
        Task<Movie> UpdateAsync(Movie movie);
        Task DeleteAsync(Guid id);

    }
}
