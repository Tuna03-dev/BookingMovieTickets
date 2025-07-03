using BookingMovieTickets.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BookingMovieTickets.Repositories
{
    public interface IUserRepository : IRepository<User>
    {
        Task<(IEnumerable<User> Users, int TotalCount)> GetPaginatedUsersAsync(int skip, int take);
    }
} 