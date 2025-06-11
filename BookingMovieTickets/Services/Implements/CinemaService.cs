using BookingMovieTickets.DTOs;
using BookingMovieTickets.Models;
using BookingMovieTickets.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookingMovieTickets.Services.Implements
{
    public class CinemaService : ICinemaService
    {
        private readonly ICinemaRepository _cinemaRepository;

        public CinemaService(ICinemaRepository cinemaRepository)
        {
            _cinemaRepository = cinemaRepository;
        }

        public async Task<IEnumerable<CinemaResponseDTO>> GetAllAsync()
        {
            var cinemas = await _cinemaRepository.GetAllAsync();
            return cinemas.Select(MapToResponseDTO);
        }

        public async Task<CinemaResponseDTO?> GetByIdAsync(Guid id)
        {
            var cinema = await _cinemaRepository.GetByIdAsync(id);
            return cinema != null ? MapToResponseDTO(cinema) : null;
        }

        public async Task<CinemaResponseDTO> CreateAsync(CreateCinemaDTO createCinemaDTO)
        {
            var cinema = new Cinema
            {
                Name = createCinemaDTO.Name,
                Address = createCinemaDTO.Address,
                City = createCinemaDTO.City
            };

            var createdCinema = await _cinemaRepository.CreateAsync(cinema);
            return MapToResponseDTO(createdCinema);
        }

        public async Task<CinemaResponseDTO?> UpdateAsync(Guid id, UpdateCinemaDTO updateCinemaDTO)
        {
            var cinema = new Cinema
            {
                Name = updateCinemaDTO.Name,
                Address = updateCinemaDTO.Address,
                City = updateCinemaDTO.City
            };

            var updatedCinema = await _cinemaRepository.UpdateAsync(id, cinema);
            return updatedCinema != null ? MapToResponseDTO(updatedCinema) : null;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            return await _cinemaRepository.DeleteAsync(id);
        }

        private static CinemaResponseDTO MapToResponseDTO(Cinema cinema)
        {
            return new CinemaResponseDTO
            {
                CinemaId = cinema.CinemaId,
                Name = cinema.Name,
                Address = cinema.Address,
                City = cinema.City,
                CreatedAt = cinema.CreatedAt,
                UpdatedAt = cinema.UpdatedAt
            };
        }
    }
}