using BookingMovieTickets.DTOs.Responses;
using BookingMovieTickets.Models;
using BookingMovieTickets.Repositories;

namespace BookingMovieTickets.Services.Implements
{
    public class MovieService : IMovieService
    {
        private readonly IMovieRepository _movieRepository;

        public MovieService(IMovieRepository movieRepository)
        {
            _movieRepository = movieRepository;
        }
        public async Task<PaginatedResponse<Movie>> GetMoviesAsync(int pageNumber, int pageSize)
        {
            return await _movieRepository.GetAllMoviesAsync(pageNumber, pageSize);
        }
    }
}
