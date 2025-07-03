using BookingMovieTickets.Models;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

public class RoomService : IRoomService
{
    private readonly IRoomRepository _roomRepository;
    public RoomService(IRoomRepository roomRepository)
    {
        _roomRepository = roomRepository;
    }

    public IQueryable<Room> GetRooms() => _roomRepository.GetRooms();
    public Task<Room?> GetRoomByIdAsync(Guid id) => _roomRepository.GetRoomByIdAsync(id);
    public Task AddRoomAsync(Room room) => _roomRepository.AddRoomAsync(room);
    public Task UpdateRoomAsync(Room room) => _roomRepository.UpdateRoomAsync(room);
    public Task DeleteRoomAsync(Guid id) => _roomRepository.DeleteRoomAsync(id);
} 