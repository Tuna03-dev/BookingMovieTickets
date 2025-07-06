using BookingMovieTickets.Models;
using BookingMovieTickets.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using BookingMovieTickets.Data;

namespace BookingMovieTickets.Repositories.Implements
{
    public class RoomRepository : BaseRepository<Room>, IRoomRepository
    {
        public RoomRepository(BookingMovieTicketsContext context) : base(context)
        {
        }

        public IQueryable<Room> GetRooms()
        {
            return _dbSet.Include(r => r.Cinema);
        }

        public override async Task<Room?> GetByIdAsync(Guid id)
        {
            return await _dbSet.Include(r => r.Cinema).FirstOrDefaultAsync(r => r.RoomId == id);
        }
    }
} 