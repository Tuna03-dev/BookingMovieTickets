using BookingMovieTickets.DTOs;
using BookingMovieTickets.DTOs.Responses;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BookingMovieTickets.Services
{
    public interface ICinemaService
    {
        Task<PaginatedResponse<CinemaResponseDTO>> GetAllAsync();
        Task<CinemaResponseDTO?> GetByIdAsync(Guid id);
        Task<CinemaResponseDTO> CreateAsync(CreateCinemaDTO createCinemaDTO);
        Task<CinemaResponseDTO?> UpdateAsync(Guid id, UpdateCinemaDTO updateCinemaDTO);
        Task<bool> DeleteAsync(Guid id);
    }
} 