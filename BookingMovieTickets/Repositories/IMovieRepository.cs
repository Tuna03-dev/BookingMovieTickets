using BookingMovieTickets.DTOs.Responses;
using BookingMovieTickets.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using BookingMovieTickets.Repositories;
using AutoMapper;
using BookingMovieTickets.DTOs;

namespace BookingMovieTickets.Repositories
{
    public interface IMovieRepository : IRepository<Movie>
    {
        Task<PaginatedResponse<Movie>> GetAllMoviesAsync(int pageNumber, int pageSize);
        Task<Movie> GetFeaturedMovieAsync();
        Task<List<Movie>> GetNowShowingMoviesAsync();
        Task<List<Movie>> GetComingSoonMoviesAsync();
        IQueryable<Movie> GetQueryable();
        Task<Movie?> GetByIdAsync(Guid id);
        Task<List<CinemaShowtimeDTO>> GetShowtimesByMovieAndDateAsync(Guid movieId, DateTime date);
    }
}
