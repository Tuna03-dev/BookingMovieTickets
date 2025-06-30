using BookingMovieTickets.Data;
using BookingMovieTickets.DTOs.Responses;
using BookingMovieTickets.Models;
using BookingMovieTickets.Repositories.Implements;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using BookingMovieTickets.DTOs;

namespace BookingMovieTickets.Repositories.Implements
{
    public class MovieRepository : BaseRepository<Movie>, IMovieRepository
    {
        private readonly BookingMovieTicketsContext _context;
        private readonly IMapper _mapper;

        public MovieRepository(BookingMovieTicketsContext context, IMapper mapper) : base(context)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<PaginatedResponse<Movie>> GetAllMoviesAsync(int pageNumber, int pageSize)
        {
            var query = _dbSet.AsQueryable().OrderByDescending(m => m.CreatedAt);
            var totalItems = await query.CountAsync();
            var totalPages = (int)Math.Ceiling((double)totalItems / pageSize);
            var movies = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PaginatedResponse<Movie>
            {
                Items = movies,
                TotalItems = totalItems,
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalPages = totalPages
            };
        }


        public async Task<Movie> GetFeaturedMovieAsync()
        {
           
            return await _context.Movies
                .Where(m => m.ReleaseDate != null && m.ReleaseDate <= DateOnly.FromDateTime(DateTime.Today))
                .OrderByDescending(m => m.ReleaseDate)
                .FirstOrDefaultAsync();
        }

        public async Task<List<Movie>> GetNowShowingMoviesAsync()
        {
            // Phim đang chiếu: ReleaseDate <= hôm nay
            return await _context.Movies
                .Where(m => m.ReleaseDate != null && m.ReleaseDate <= DateOnly.FromDateTime(DateTime.Today))
                .OrderByDescending(m => m.ReleaseDate)
                .ToListAsync();
        }

        public async Task<List<Movie>> GetComingSoonMoviesAsync()
        {
            // Phim sắp chiếu: ReleaseDate > hôm nay
            return await _context.Movies
                .Where(m => m.ReleaseDate != null && m.ReleaseDate > DateOnly.FromDateTime(DateTime.Today))
                .OrderBy(m => m.ReleaseDate)
                .ToListAsync();
        }

        public async Task<List<CinemaShowtimeDTO>> GetShowtimesByMovieAndDateAsync(Guid movieId, DateTime date)
        {
            var showtimes = await _context.Showtimes
                .Include(s => s.Movie)
                .Include(s => s.Room)
                    .ThenInclude(r => r.Cinema)
                .Include(s => s.TimeSlot)
                .Where(s => s.MovieId == movieId && s.Date.Date == date.Date)
                .OrderBy(s => s.TimeSlot.StartTime)
                .ToListAsync();

            var cinemaGroups = showtimes
                .GroupBy(s => s.Room.Cinema)
                .Select(group => new CinemaShowtimeDTO
                {
                    CinemaId = group.Key.CinemaId,
                    CinemaName = group.Key.Name,
                    CinemaAddress = group.Key.Address,
                    Showtimes = group.Select(s => _mapper.Map<ShowtimeResponseDTO>(s)).ToList()
                })
                .ToList();

            return cinemaGroups;
        }
    }
}
