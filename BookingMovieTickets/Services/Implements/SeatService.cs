using BookingMovieTickets.Data;
using BookingMovieTickets.DTOs;
using BookingMovieTickets.Services;
using BookingMovieTickets.Repositories;
using Microsoft.EntityFrameworkCore;

namespace BookingMovieTickets.Services.Implements
{
    public class SeatService : ISeatService
    {
        private readonly BookingMovieTicketsContext _context;
        private readonly ISeatRepository _seatRepository;

        public SeatService(BookingMovieTicketsContext context, ISeatRepository seatRepository)
        {
            _context = context;
            _seatRepository = seatRepository;
        }

        public async Task<SeatStatusDTO> GetSeatStatusByShowtimeAsync(Guid showtimeId)
        {
            // Lấy thông tin showtime
            var showtime = await _context.Showtimes
                .Include(s => s.Room)
                .FirstOrDefaultAsync(s => s.ShowtimeId == showtimeId);

            if (showtime == null)
                throw new ArgumentException("Showtime not found");

            // Lấy tất cả ghế trong phòng
            var seats = await _seatRepository.GetSeatsByRoomIdAsync(showtime.RoomId);
            
            // Lấy danh sách ghế đã được đặt cho showtime này
            var bookedSeatIds = await _seatRepository.GetBookedSeatIdsByShowtimeIdAsync(showtimeId);

            // Chuyển đổi sang DTO và tính availability
            var seatDTOs = seats.Select(s => new SeatDTO
            {
                SeatId = s.SeatId,
                Row = s.Row,
                SeatColumn = s.SeatColumn,
                SeatNumber = s.SeatNumber,
                SeatType = s.SeatType,
                IsAvailable = !bookedSeatIds.Contains(s.SeatId) // Tính availability dựa trên booking
            }).ToList();

            return new SeatStatusDTO
            {
                ShowtimeId = showtimeId,
                Seats = seatDTOs,
                BookedSeatIds = bookedSeatIds
            };
        }

        public async Task<List<SeatDTO>> GetAvailableSeatsByShowtimeAsync(Guid showtimeId)
        {
            var availableSeats = await _seatRepository.GetAvailableSeatsByShowtimeIdAsync(showtimeId);
            
            return availableSeats.Select(s => new SeatDTO
            {
                SeatId = s.SeatId,
                Row = s.Row,
                SeatColumn = s.SeatColumn,
                SeatNumber = s.SeatNumber,
                SeatType = s.SeatType,
                IsAvailable = true // Đã được filter từ repository
            }).ToList();
        }

        public async Task<List<Guid>> GetBookedSeatIdsByShowtimeAsync(Guid showtimeId)
        {
            return await _seatRepository.GetBookedSeatIdsByShowtimeIdAsync(showtimeId);
        }
    }
} 