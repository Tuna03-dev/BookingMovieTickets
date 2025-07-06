using AutoMapper;
using BookingMovieTickets.DTOs;
using BookingMovieTickets.DTOs.Responses;
using BookingMovieTickets.Models;
using BookingMovieTickets.Repositories;
using Microsoft.EntityFrameworkCore;


namespace BookingMovieTickets.Services.Implements
{
    public class CinemaService : ICinemaService
    {
        private readonly ICinemaRepository _cinemaRepository;
        private readonly IMapper _mapper;

        public CinemaService(ICinemaRepository cinemaRepository, IMapper mapper)
        {
            _cinemaRepository = cinemaRepository;
            _mapper = mapper;
        }

        public async Task<CinemaResponseDTO> CreateAsync(CreateCinemaDTO createCinemaDTO)
        {
            var cinema = _mapper.Map<Cinema>(createCinemaDTO);
            var created = await _cinemaRepository.AddAsync(cinema);
            return _mapper.Map<CinemaResponseDTO>(created);
        }

        public async Task<(bool Success, string? ErrorMessage)> DeleteAsync(Guid id)
        {
            // Get cinema with rooms to check if it can be deleted
            var cinema = await _cinemaRepository.GetQueryable()
                .Include(c => c.Rooms)
                .FirstOrDefaultAsync(c => c.CinemaId == id);
                
            if (cinema == null) 
                return (false, "Cinema not found");
            
            // Only allow deletion if cinema has no rooms
            if (cinema.Rooms.Count > 0)
            {
                return (false, $"Cannot delete cinema '{cinema.Name}' because it has {cinema.Rooms.Count} room(s)");
            }
            
            // Soft delete by setting DeletedAt
            cinema.DeletedAt = DateTime.UtcNow;
            await _cinemaRepository.UpdateAsync(id, cinema);
            return (true, null);
        }

        public async Task<PaginatedResponse<CinemaResponseDTO>> GetAllAsync()
        {
            var cinemas = await _cinemaRepository.GetQueryable()
                .Include(c => c.Rooms)
                .Where(c => c.DeletedAt == null) // Only get non-deleted cinemas
                .ToListAsync();
            var result = _mapper.Map<List<CinemaResponseDTO>>(cinemas);
            
            
            for (int i = 0; i < result.Count; i++)
            {
                result[i].RoomCount = cinemas[i].Rooms?.Count ?? 0;
            }

            return new PaginatedResponse<CinemaResponseDTO>
            {
                Items = result,
                TotalItems = result.Count,
                PageNumber = 1,
                PageSize = result.Count,
                TotalPages = 1
            };
        }

        public async Task<CinemaResponseDTO?> GetByIdAsync(Guid id)
        {
            var cinema = await _cinemaRepository.GetQueryable()
                .Include(c => c.Rooms)
                .Where(c => c.DeletedAt == null) // Only get non-deleted cinemas
                .FirstOrDefaultAsync(c => c.CinemaId == id);
            return cinema == null ? null : _mapper.Map<CinemaResponseDTO>(cinema);
        }

        public async Task<CinemaResponseDTO?> UpdateAsync(Guid id, UpdateCinemaDTO updateCinemaDTO)
        {
            var exists = await _cinemaRepository.GetQueryable()
                .Include(c => c.Rooms)
                .Where(c => c.DeletedAt == null) // Only get non-deleted cinemas
                .FirstOrDefaultAsync(c => c.CinemaId == id);
            if (exists == null) return null;
            
            _mapper.Map(updateCinemaDTO, exists);

            var updatedCinema = await _cinemaRepository.UpdateAsync(id, exists);
            if (updatedCinema == null) return null;
            
            // Reload with Rooms to get accurate RoomCount
            var reloadedCinema = await _cinemaRepository.GetQueryable()
                .Include(c => c.Rooms)
                .Where(c => c.DeletedAt == null) // Only get non-deleted cinemas
                .FirstOrDefaultAsync(c => c.CinemaId == id);
            return reloadedCinema == null ? null : _mapper.Map<CinemaResponseDTO>(reloadedCinema);
        }
    }
}