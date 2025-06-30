using BookingMovieTickets.DTOs;

namespace BookingMovieTickets.Services
{
    public interface ISeatService
    {
        Task<SeatStatusDTO> GetSeatStatusByShowtimeAsync(Guid showtimeId);
        Task<List<SeatDTO>> GetAvailableSeatsByShowtimeAsync(Guid showtimeId);
        Task<List<Guid>> GetBookedSeatIdsByShowtimeAsync(Guid showtimeId);
    }
} 