using System.Collections.Generic;
using System.Threading.Tasks;
using BookingMovieTickets.DTOs.Responses;
using BookingMovieTickets.Models;
using BookingMovieTickets.Repositories;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using BookingMovieTickets.DTOs;

namespace BookingMovieTickets.Services.Implements
{
    public class MovieService : IMovieService
    {
        private readonly IMovieRepository _movieRepository;
        private readonly IMapper _mapper;

        public MovieService(IMovieRepository movieRepository, IMapper mapper)
        {
            _movieRepository = movieRepository;
            _mapper = mapper;
        }

        public async Task<PaginatedResponse<Movie>> GetMoviesAsync(int pageNumber, int pageSize)
        {
            return await _movieRepository.GetAllMoviesAsync(pageNumber, pageSize);
        }

        public Task<Movie> GetFeaturedMovieAsync() => _movieRepository.GetFeaturedMovieAsync();
        public Task<List<Movie>> GetNowShowingMoviesAsync() => _movieRepository.GetNowShowingMoviesAsync();
        public Task<List<Movie>> GetComingSoonMoviesAsync() => _movieRepository.GetComingSoonMoviesAsync();

        public async Task<IEnumerable<Movie>> GetAllMoviesQueryable()
        {
            return await _movieRepository.GetQueryable().ToListAsync();
        }

        public async Task<MovieResponseDTO?> GetByIdAsync(Guid id)
        {
            var movie = await _movieRepository.GetByIdAsync(id);
            return movie == null ? null : _mapper.Map<MovieResponseDTO>(movie);
        }

        public async Task<List<CinemaShowtimeDTO>> GetShowtimesByMovieAndDateAsync(Guid movieId, DateTime date)
        {
            return await _movieRepository.GetShowtimesByMovieAndDateAsync(movieId, date);
        }
    }
}
