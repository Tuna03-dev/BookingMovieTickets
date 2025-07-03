using BookingMovieTickets.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using BookingMovieTickets.Data;

public class RoomRepository : IRoomRepository
{
    private readonly BookingMovieTicketsContext _context;
    public RoomRepository(BookingMovieTicketsContext context)
    {
        _context = context;
    }

    public IQueryable<Room> GetRooms()
    {
        return _context.Rooms.Include(r => r.Cinema);
    }

    public async Task<Room?> GetRoomByIdAsync(Guid id)
    {
        return await _context.Rooms.Include(r => r.Cinema).FirstOrDefaultAsync(r => r.RoomId == id);
    }

    public async Task AddRoomAsync(Room room)
    {
        _context.Rooms.Add(room);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateRoomAsync(Room room)
    {
        _context.Rooms.Update(room);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteRoomAsync(Guid id)
    {
        var room = await _context.Rooms.FindAsync(id);
        if (room != null)
        {
            _context.Rooms.Remove(room);
            await _context.SaveChangesAsync();
        }
    }
} 