using BookingMovieTickets.Data;
using BookingMovieTickets.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookingMovieTickets.Repositories.Implements
{
    public class UserRepository : BaseRepository<User>, IUserRepository
    {
        public UserRepository(BookingMovieTicketsContext context) : base(context) { }

        public async Task<(IEnumerable<User> Users, int TotalCount)> GetPaginatedUsersAsync(int skip, int take)
        {
            var query = _dbSet.AsQueryable();
            var total = await query.CountAsync();
            var users = await query.OrderBy(u => u.Email).Skip(skip).Take(take).ToListAsync();
            return (users, total);
        }
    }
} 