using System.Collections.Generic;
using System.Threading.Tasks;
using BookingMovieTickets.DTOs.Responses;
using BookingMovieTickets.Models;
using BookingMovieTickets.Repositories;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using BookingMovieTickets.DTOs;
using System;
using BookingMovieTickets.Services.Implements;

namespace BookingMovieTickets.Services.Implements
{
    public class MovieService : IMovieService
    {
        private readonly IMovieRepository _movieRepository;
        private readonly IMapper _mapper;
        private readonly CloudinaryService _cloudinaryService;
        private readonly IShowtimeRepository _showtimeRepository;

        public MovieService(IMovieRepository movieRepository, IMapper mapper, CloudinaryService cloudinaryService, IShowtimeRepository showtimeRepository)
        {
            _movieRepository = movieRepository;
            _mapper = mapper;
            _cloudinaryService = cloudinaryService;
            _showtimeRepository = showtimeRepository;
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
            return await _movieRepository.GetQueryable().Include(m => m.Showtimes).ToListAsync();
        }

        public async Task<MovieResponseDTO?> GetByIdAsync(Guid id)
        {
            var movie = await _movieRepository.GetByIdAsync(id);
            return movie == null ? null : _mapper.Map<MovieResponseDTO>(movie);
        }

        public async Task<MovieResponseDTO> AddMovieAsync(CreateMovieDTO dto)
        {
            var movie = _mapper.Map<Movie>(dto);
            movie.MovieId = Guid.NewGuid();
            movie.CreatedAt = DateTime.UtcNow;
            movie.UpdatedAt = DateTime.UtcNow;
            if (dto.Poster != null)
            {
                var posterUrl = await _cloudinaryService.UploadImageAsync(dto.Poster);
                movie.PosterUrl = posterUrl;
            }
            await _movieRepository.AddAsync(movie);
            return _mapper.Map<MovieResponseDTO>(movie);
        }

        public async Task<MovieResponseDTO?> UpdateMovieAsync(Guid id, UpdateMovieDTO dto)
        {
            var movie = await _movieRepository.GetByIdAsync(id);
            if (movie == null) return null;
            _mapper.Map(dto, movie);
            movie.UpdatedAt = DateTime.UtcNow;
            if (dto.Poster != null)
            {
                var posterUrl = await _cloudinaryService.UploadImageAsync(dto.Poster);
                movie.PosterUrl = posterUrl;
            }
            await _movieRepository.UpdateAsync(id, movie);
            return _mapper.Map<MovieResponseDTO>(movie);
        }

        public async Task<bool> DeleteMovieAsync(Guid id)
        {
            return await _movieRepository.DeleteAsync(id);
        }

        public async Task<List<CinemaShowtimeDTO>> GetShowtimesByMovieAndDateAsync(Guid movieId, DateTime date)
        {
            return await _movieRepository.GetShowtimesByMovieAndDateAsync(movieId, date);
        }

        public async Task<int> SoftDeleteMoviesWithoutShowtimeAsync()
        {
            return await _movieRepository.SoftDeleteMoviesWithoutShowtimeAsync();
        }

        public async Task<bool> SoftDeleteMovieByIdAsync(Guid id)
        {
            return await _movieRepository.SoftDeleteMovieByIdAsync(id);
        }
        
        public async Task<bool> UpdateShowtimeAsync(ShowtimeUpdateDTO dto)
        {
            // Giả sử có IShowtimeRepository được inject
            var showtime = await _showtimeRepository.GetByIdAsync(dto.ShowtimeId);
            if (showtime == null) return false;
            showtime.MovieId = dto.MovieId;
            showtime.TicketPrice = dto.TicketPrice;
            showtime.UpdatedAt = DateTime.UtcNow;
            await _showtimeRepository.UpdateAsync(dto.ShowtimeId, showtime);
            return true;
        }

        public async Task<ShowtimeResponseDTO> CreateShowtimeAsync(CreateShowtimeDTO dto)
        {
            // Kiểm tra xem đã có showtime nào ở room, timeslot, date này chưa
            var existingShowtime = await _showtimeRepository.GetQueryable()
                .FirstOrDefaultAsync(s => s.RoomId == dto.RoomId && 
                                         s.TimeSlotId == dto.TimeSlotId && 
                                         s.Date.Date == dto.Date.Date);
            
            if (existingShowtime != null)
                throw new InvalidOperationException("Đã có lịch chiếu ở phòng và thời gian này");
            
            var showtime = new Showtime
            {
                ShowtimeId = Guid.NewGuid(),
                MovieId = dto.MovieId,
                RoomId = dto.RoomId,
                TimeSlotId = dto.TimeSlotId,
                Date = dto.Date.Date,
                TicketPrice = dto.TicketPrice,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            
            await _showtimeRepository.AddAsync(showtime);
            return _mapper.Map<ShowtimeResponseDTO>(showtime);
        }

        public async Task<bool> DeleteShowtimeAsync(Guid showtimeId)
        {
            return await _showtimeRepository.DeleteAsync(showtimeId);
        }
    }
}
