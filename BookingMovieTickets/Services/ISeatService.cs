using BookingMovieTickets.DTOs;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BookingMovieTickets.Services
{
    public interface ISeatService
    {
        Task<List<SeatResponseDTO>> GetSeatsByRoomAsync(Guid roomId);
        Task<SeatResponseDTO?> GetByIdAsync(Guid id);
        Task<SeatResponseDTO> CreateAsync(CreateSeatDTO createSeatDTO);
        Task<SeatResponseDTO?> UpdateAsync(Guid id, UpdateSeatDTO updateSeatDTO);
        Task<bool> DeleteAsync(Guid id);
        Task<List<SeatResponseDTO>> GenerateSeatLayoutAsync(SeatLayoutDTO layoutDTO);
        Task<bool> DeleteSeatsAsync(List<Guid> seatIds);
        Task<SeatStatsDTO> GetSeatStatsAsync(Guid roomId);
        Task<bool> RoomHasBookingAsync(Guid roomId);
        Task<List<SeatResponseDTO>> AddRowAsync(Guid roomId);
        Task<List<SeatResponseDTO>> AddColumnAsync(Guid roomId);
    }
} 