using BookingMovieTickets.Data;
using BookingMovieTickets.Models;
using BookingMovieTickets.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookingMovieTickets.Repositories.Implements
{
    public class SeatRepository : BaseRepository<Seat>, ISeatRepository
    {
        public SeatRepository(BookingMovieTicketsContext context) : base(context)
        {
        }

        public async Task<List<Seat>> GetSeatsByRoomIdAsync(Guid roomId)
        {
            return await _dbSet
                .Where(s => s.RoomId == roomId)
                .OrderBy(s => s.Row)
                .ThenBy(s => s.SeatColumn)
                .ToListAsync();
        }

        public async Task<List<Seat>> GetAvailableSeatsByRoomIdAsync(Guid roomId)
        {
            // Bỏ filter IsAvailable vì availability sẽ được tính dựa trên booking
            return await _dbSet
                .Where(s => s.RoomId == roomId)
                .OrderBy(s => s.Row)
                .ThenBy(s => s.SeatColumn)
                .ToListAsync();
        }

        public async Task<List<Seat>> GetSeatsByShowtimeIdAsync(Guid showtimeId)
        {
            return await _dbSet
                .Where(s => s.Room.Showtimes.Any(st => st.ShowtimeId == showtimeId))
                .OrderBy(s => s.Row)
                .ThenBy(s => s.SeatColumn)
                .ToListAsync();
        }

        public async Task<List<Seat>> GetAvailableSeatsByShowtimeIdAsync(Guid showtimeId)
        {
            // Lấy tất cả ghế trong phòng của showtime
            var allSeats = await _dbSet
                .Where(s => s.Room.Showtimes.Any(st => st.ShowtimeId == showtimeId))
                .ToListAsync();

            // Lấy danh sách ghế đã được đặt cho showtime này
            var bookedSeatIds = await _context.Bookings
                .Where(b => b.ShowtimeId == showtimeId && b.Status != "Cancelled")
                .SelectMany(b => b.BookingSeats)
                .Select(bs => bs.SeatId)
                .ToListAsync();

            // Lọc ra ghế còn trống
            return allSeats
                .Where(s => !bookedSeatIds.Contains(s.SeatId))
                .OrderBy(s => s.Row)
                .ThenBy(s => s.SeatColumn)
                .ToList();
        }

        public async Task<List<Guid>> GetBookedSeatIdsByShowtimeIdAsync(Guid showtimeId)
        {
            return await _context.Bookings
                .Where(b => b.ShowtimeId == showtimeId && b.Status != "Cancelled")
                .SelectMany(b => b.BookingSeats)
                .Select(bs => bs.SeatId)
                .ToListAsync();
        }

        public async Task<bool> IsSeatAvailableAsync(Guid seatId, Guid showtimeId)
        {
            // Kiểm tra ghế có tồn tại không
            var seat = await _dbSet.FirstOrDefaultAsync(s => s.SeatId == seatId);
            if (seat == null) return false;

            // Kiểm tra ghế có được đặt cho showtime này không
            var isBooked = await _context.Bookings
                .Where(b => b.ShowtimeId == showtimeId && b.Status != "Cancelled")
                .SelectMany(b => b.BookingSeats)
                .AnyAsync(bs => bs.SeatId == seatId);

            return !isBooked;
        }

        public async Task<List<Seat>> GetSeatsByIdsAsync(List<Guid> seatIds)
        {
            return await _dbSet
                .Where(s => seatIds.Contains(s.SeatId))
                .OrderBy(s => s.Row)
                .ThenBy(s => s.SeatColumn)
                .ToListAsync();
        }

        public new IQueryable<Seat> GetQueryable()
        {
            return _dbSet;
        }
    }
} 