using BookingMovieTickets.Data;
using BookingMovieTickets.DTOs;
using BookingMovieTickets.DTOs.Responses;
using BookingMovieTickets.Models;
using BookingMovieTickets.Repositories.Implements;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;

namespace BookingMovieTickets.Repositories.Implements
{
    public class MovieRepository : BaseRepository<Movie>, IMovieRepository
    {
        private readonly IMapper _mapper;

        public MovieRepository(BookingMovieTicketsContext context, IMapper mapper) : base(context)
        {
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

        public async Task<Movie> AddMovieAsync(CreateMovieDTO dto)
        {
            var movie = _mapper.Map<Movie>(dto);
            movie.MovieId = Guid.NewGuid();
            movie.CreatedAt = DateTime.UtcNow;
            movie.UpdatedAt = DateTime.UtcNow;
            await _dbSet.AddAsync(movie);
            await _context.SaveChangesAsync();
            return movie;
        }

        public async Task<Movie> UpdateMovieAsync(Guid id, UpdateMovieDTO dto)
        {
            var movie = await _dbSet.FindAsync(id);
            if (movie == null) throw new Exception("Movie not found");
            _mapper.Map(dto, movie);
            movie.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return movie;
        }

        public async Task<bool> DeleteMovieAsync(Guid id)
        {
            var movie = await _dbSet.FindAsync(id);
            if (movie == null) return false;
            _dbSet.Remove(movie);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<Movie> GetFeaturedMovieAsync()
        {
            return await _dbSet
                .Where(m => m.ReleaseDate != null && m.ReleaseDate <= DateOnly.FromDateTime(DateTime.Today))
                .OrderByDescending(m => m.ReleaseDate)
                .FirstOrDefaultAsync();
        }

        public async Task<List<Movie>> GetNowShowingMoviesAsync()
        {
            return await _dbSet
                .Where(m => m.ReleaseDate != null && m.ReleaseDate <= DateOnly.FromDateTime(DateTime.Today))
                .OrderByDescending(m => m.ReleaseDate)
                .ToListAsync();
        }

        public async Task<List<Movie>> GetComingSoonMoviesAsync()
        {
            return await _dbSet
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

        public async Task<int> SoftDeleteMoviesWithoutShowtimeAsync()
        {
            var movies = await _dbSet
                .Include(m => m.Showtimes)
                .Where(m => m.Showtimes.Count == 0 && m.DeletedAt == null)
                .ToListAsync();
            foreach (var movie in movies)
            {
                movie.DeletedAt = DateTime.UtcNow;
            }
            await _context.SaveChangesAsync();
            return movies.Count;
        }

        public async Task<bool> SoftDeleteMovieByIdAsync(Guid id)
        {
            var movie = await _dbSet
                .Include(m => m.Showtimes)
                .Where(m => m.MovieId == id && m.DeletedAt == null)
                .FirstOrDefaultAsync()
                ;
            if (movie == null) return false;
            if (movie.Showtimes.Any())
                return false;

            movie.DeletedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
