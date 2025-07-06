using BookingMovieTickets.Models;
using BookingMovieTickets.DTOs;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace BookingMovieTickets.Services
{
    public interface IRoomService
    {
        IQueryable<Room> GetRooms();
        Task<RoomResponseDTO?> GetRoomByIdAsync(Guid id);
        Task<RoomResponseDTO> AddRoomAsync(Room room);
        Task<RoomResponseDTO?> UpdateRoomAsync(Room room);
        Task<bool> DeleteRoomAsync(Guid id);
        Task<List<RoomResponseDTO>> GetRoomsByCinemaAsync(Guid cinemaId);
    }
} 