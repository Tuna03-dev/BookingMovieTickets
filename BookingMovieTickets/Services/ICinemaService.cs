using BookingMovieTickets.DTOs;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BookingMovieTickets.Services
{
    public interface ICinemaService
    {
        Task<IEnumerable<CinemaResponseDTO>> GetAllAsync();
        Task<CinemaResponseDTO?> GetByIdAsync(Guid id);
        Task<CinemaResponseDTO> CreateAsync(CreateCinemaDTO createCinemaDTO);
        Task<CinemaResponseDTO?> UpdateAsync(Guid id, UpdateCinemaDTO updateCinemaDTO);
        Task<bool> DeleteAsync(Guid id);
    }
} 