using BookingMovieTickets.Models;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace BookingMovieTickets.Repositories
{
    public interface IRoomRepository : IRepository<Room>
    {
        IQueryable<Room> GetRooms();
    }
} 