using AutoMapper;
using BookingMovieTickets.DTOs;
using BookingMovieTickets.Models;
using BookingMovieTickets.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookingMovieTickets.Services.Implements
{
    public class SeatService : ISeatService
    {
        private readonly ISeatRepository _seatRepository;
        private readonly IRoomRepository _roomRepository;
        private readonly IBookingSeatRepository _bookingSeatRepository;
        private readonly IMapper _mapper;

        public SeatService(ISeatRepository seatRepository, IRoomRepository roomRepository, IBookingSeatRepository bookingSeatRepository, IMapper mapper)
        {
            _seatRepository = seatRepository;
            _roomRepository = roomRepository;
            _bookingSeatRepository = bookingSeatRepository;
            _mapper = mapper;
        }

        public async Task<List<SeatResponseDTO>> GetSeatsByRoomAsync(Guid roomId)
        {
            var seats = await _seatRepository.GetQueryable()
                .Where(s => s.RoomId == roomId && s.DeletedAt == null)
                .OrderBy(s => s.Row)
                .ThenBy(s => s.SeatColumn)
                .ToListAsync();

            return _mapper.Map<List<SeatResponseDTO>>(seats);
        }

        public async Task<SeatResponseDTO?> GetByIdAsync(Guid id)
        {
            var seat = await _seatRepository.GetQueryable()
                .FirstOrDefaultAsync(s => s.SeatId == id && s.DeletedAt == null);
            
            return seat == null ? null : _mapper.Map<SeatResponseDTO>(seat);
        }

        public async Task<SeatResponseDTO> CreateAsync(CreateSeatDTO createSeatDTO)
        {
            var seat = _mapper.Map<Seat>(createSeatDTO);
            var created = await _seatRepository.AddAsync(seat);
            return _mapper.Map<SeatResponseDTO>(created);
        }

        public async Task<SeatResponseDTO?> UpdateAsync(Guid id, UpdateSeatDTO updateSeatDTO)
        {
            var existing = await _seatRepository.GetQueryable()
                .FirstOrDefaultAsync(s => s.SeatId == id && s.DeletedAt == null);
            
            if (existing == null) return null;

            _mapper.Map(updateSeatDTO, existing);
            var updated = await _seatRepository.UpdateAsync(id, existing);
            return updated == null ? null : _mapper.Map<SeatResponseDTO>(updated);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var exists = await _seatRepository.GetQueryable()
                .AnyAsync(s => s.SeatId == id && s.DeletedAt == null);
            
            if (!exists) return false;

            // Soft delete
            var seat = await _seatRepository.GetByIdAsync(id);
            if (seat != null)
            {
                seat.DeletedAt = DateTime.UtcNow;
                await _seatRepository.UpdateAsync(id, seat);
            }

            return true;
        }

        public async Task<List<SeatResponseDTO>> GenerateSeatLayoutAsync(SeatLayoutDTO layoutDTO)
        {
            // Delete existing seats for the room
            var existingSeats = await _seatRepository.GetQueryable()
                .Where(s => s.RoomId == layoutDTO.RoomId && s.DeletedAt == null)
                .ToListAsync();

            foreach (var seat in existingSeats)
            {
                seat.DeletedAt = DateTime.UtcNow;
                await _seatRepository.UpdateAsync(seat.SeatId, seat);
            }

            // Generate new seats
            var newSeats = new List<Seat>();
            var rows = Enumerable.Range(0, layoutDTO.Rows)
                .Select(i => ((char)('A' + i)).ToString())
                .ToList();

            foreach (var row in rows)
            {
                for (int col = 1; col <= layoutDTO.Columns; col++)
                {
                    var seat = new Seat
                    {
                        RoomId = layoutDTO.RoomId,
                        Row = row,
                        SeatColumn = col,
                        SeatNumber = $"{row}{col}",

                    };
                    newSeats.Add(seat);
                }
            }

            // Save all new seats
            var createdSeats = new List<Seat>();
            foreach (var seat in newSeats)
            {
                var created = await _seatRepository.AddAsync(seat);
                createdSeats.Add(created);
            }

            return _mapper.Map<List<SeatResponseDTO>>(createdSeats);
        }

        public async Task<bool> DeleteSeatsAsync(List<Guid> seatIds)
        {
            var seats = await _seatRepository.GetQueryable()
                .Where(s => seatIds.Contains(s.SeatId) && s.DeletedAt == null)
                .ToListAsync();

            if (seats.Count != seatIds.Count)
                return false; // Some seats not found

            foreach (var seat in seats)
            {
                seat.DeletedAt = DateTime.UtcNow;
                await _seatRepository.UpdateAsync(seat.SeatId, seat);
            }

            return true;
        }

        public async Task<bool> RoomHasBookingAsync(Guid roomId)
        {

            var seatIds = await _seatRepository.GetQueryable()
                .Where(s => s.RoomId == roomId)
                .Select(s => s.SeatId)
                .ToListAsync();

            if (!seatIds.Any())
                return false;

            var hasBooking = await _bookingSeatRepository.GetQueryable()
                .AnyAsync(bs => seatIds.Contains(bs.SeatId));

            return hasBooking;
        }

        public async Task<List<SeatResponseDTO>> AddRowAsync(Guid roomId)
        {
            var seats = _seatRepository.GetQueryable().Where(s => s.RoomId == roomId).ToList();
            if (!seats.Any()) return new List<SeatResponseDTO>();
            var maxRowChar = seats.Max(s => s.Row[0]);
            var newRowChar = (char)(maxRowChar + 1);
            var columns = seats.Max(s => s.SeatColumn);
            var newSeats = new List<Seat>();
            for (int col = 1; col <= columns; col++)
            {
                var seat = new Seat
                {
                    RoomId = roomId,
                    Row = newRowChar.ToString(),
                    SeatColumn = col,
                    SeatNumber = $"{newRowChar}{col}"
                };
                newSeats.Add(seat);
            }
            foreach (var seat in newSeats)
            {
                await _seatRepository.AddAsync(seat);
            }
            return _mapper.Map<List<SeatResponseDTO>>(newSeats);
        }

        public async Task<List<SeatResponseDTO>> AddColumnAsync(Guid roomId)
        {
            var seats = _seatRepository.GetQueryable().Where(s => s.RoomId == roomId).ToList();
            if (!seats.Any()) return new List<SeatResponseDTO>();
            var maxCol = seats.Max(s => s.SeatColumn);
            var rows = seats.Select(s => s.Row).Distinct().ToList();
            var newSeats = new List<Seat>();
            foreach (var row in rows)
            {
                var seat = new Seat
                {
                    RoomId = roomId,
                    Row = row,
                    SeatColumn = maxCol + 1,
                    SeatNumber = $"{row}{maxCol + 1}"
                };
                newSeats.Add(seat);
            }
            foreach (var seat in newSeats)
            {
                await _seatRepository.AddAsync(seat);
            }
            return _mapper.Map<List<SeatResponseDTO>>(newSeats);
        }

        public Task<SeatStatsDTO> GetSeatStatsAsync(Guid roomId)
        {
            throw new NotImplementedException();
        }
    }
} 