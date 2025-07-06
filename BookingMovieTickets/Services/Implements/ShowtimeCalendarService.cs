using BookingMovieTickets.DTOs;
using BookingMovieTickets.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace BookingMovieTickets.Services.Implements
{
    public class ShowtimeCalendarService : IShowtimeCalendarService
    {
        private readonly IRoomRepository _roomRepository;
        private readonly ITimeSlotRepository _timeSlotRepository;
        private readonly IShowtimeRepository _showtimeRepository;

        public ShowtimeCalendarService(
            IRoomRepository roomRepository,
            ITimeSlotRepository timeSlotRepository,
            IShowtimeRepository showtimeRepository)
        {
            _roomRepository = roomRepository;
            _timeSlotRepository = timeSlotRepository;
            _showtimeRepository = showtimeRepository;
        }

        public async Task<ShowtimeCalendarResponseDTO> GetShowtimeCalendarAsync(Guid cinemaId, DateTime fromDate, DateTime toDate)
        {
            var rooms = await _roomRepository.GetQueryable()
                .Where(r => r.CinemaId == cinemaId)
                .Select(r => new RoomCalendarDTO
                {
                    RoomId = r.RoomId,
                    RoomNumber = r.RoomNumber,
                    TotalSeats = r.TotalSeats
                }).ToListAsync();

            var timeSlots = await _timeSlotRepository.GetQueryable()
                .Where(ts => ts.IsActive)
                .Select(ts => new TimeSlotCalendarDTO
                {
                    TimeSlotId = ts.TimeSlotId,
                    StartTime = ts.StartTime.ToString(@"hh\:mm"),
                    EndTime = ts.EndTime.ToString(@"hh\:mm")
                }).ToListAsync();

            var showtimes = await _showtimeRepository.GetQueryable()
                .Where(s => s.Room.CinemaId == cinemaId && s.Date >= fromDate && s.Date <= toDate && s.DeletedAt == null)
                .Include(s => s.Movie)
                .Include(s => s.Room)
                .Include(s => s.TimeSlot)
                .Include(s => s.Bookings)
                .Select(s => new ShowtimeCalendarItemDTO
                {
                    ShowtimeId = s.ShowtimeId,
                    RoomId = s.RoomId,
                    TimeSlotId = s.TimeSlotId,
                    Date = s.Date,
                    MovieTitle = s.Movie.Title,
                    MoviePoster = s.Movie.PosterUrl ?? string.Empty,
                    TicketPrice = s.TicketPrice,
                    BookedSeats = s.Bookings.Count(b => b.Status != "Cancelled"),
                    TotalSeats = s.Room.TotalSeats
                }).ToListAsync();

            return new ShowtimeCalendarResponseDTO
            {
                Rooms = rooms,
                TimeSlots = timeSlots,
                Showtimes = showtimes
            };
        }
    }
} 