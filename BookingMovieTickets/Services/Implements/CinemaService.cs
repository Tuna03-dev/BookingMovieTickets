using AutoMapper;
using BookingMovieTickets.DTOs;
using BookingMovieTickets.DTOs.Responses;
using BookingMovieTickets.Models;
using BookingMovieTickets.Repositories;


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

        public async Task<bool> DeleteAsync(Guid id)
        {
            var exists = await _cinemaRepository.ExistsAsync(id);
            if (!exists) return false;

            return await _cinemaRepository.DeleteAsync(id);
        }

        public async Task<PaginatedResponse<CinemaResponseDTO>> GetAllAsync()
        {
            
            var cinemas = await _cinemaRepository.GetAllAsync();
            var result = _mapper.Map<List<CinemaResponseDTO>>(cinemas);

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
            var cinema = await _cinemaRepository.GetByIdAsync(id);
            return cinema == null ? null : _mapper.Map<CinemaResponseDTO>(cinema);
        }

        public async Task<CinemaResponseDTO?> UpdateAsync(Guid id, UpdateCinemaDTO updateCinemaDTO)
        {
            var cinemaToUpdate = _mapper.Map<Cinema>(updateCinemaDTO);
            var updatedCinema = await _cinemaRepository.UpdateAsync(id, cinemaToUpdate);
            return updatedCinema == null ? null : _mapper.Map<CinemaResponseDTO>(updatedCinema);
        }
    }
}