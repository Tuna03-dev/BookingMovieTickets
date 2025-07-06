using BookingMovieTickets.DTOs;
using System;
using System.Threading.Tasks;

namespace BookingMovieTickets.Services
{
    public interface IShowtimeCalendarService
    {
        Task<ShowtimeCalendarResponseDTO> GetShowtimeCalendarAsync(Guid cinemaId, DateTime fromDate, DateTime toDate);
    }
} 