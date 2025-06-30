using BookingMovieTickets.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace BookingMovieTickets.Repositories
{
    public interface ISeatRepository : IRepository<Seat>
    {
        Task<List<Seat>> GetSeatsByRoomIdAsync(Guid roomId);
        Task<List<Seat>> GetAvailableSeatsByRoomIdAsync(Guid roomId);
        Task<List<Seat>> GetSeatsByShowtimeIdAsync(Guid showtimeId);
        Task<List<Seat>> GetAvailableSeatsByShowtimeIdAsync(Guid showtimeId);
        Task<List<Guid>> GetBookedSeatIdsByShowtimeIdAsync(Guid showtimeId);
        Task<bool> IsSeatAvailableAsync(Guid seatId, Guid showtimeId);
        Task<List<Seat>> GetSeatsByIdsAsync(List<Guid> seatIds);

    }
} 