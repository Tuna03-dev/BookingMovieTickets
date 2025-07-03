using BookingMovieTickets.Models;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

public interface IRoomRepository
{
    IQueryable<Room> GetRooms();
    Task<Room?> GetRoomByIdAsync(Guid id);
    Task AddRoomAsync(Room room);
    Task UpdateRoomAsync(Room room);
    Task DeleteRoomAsync(Guid id);
} 