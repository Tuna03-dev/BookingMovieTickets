using BookingMovieTickets.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BookingMovieTickets.Services
{
    public interface IUserService
    {
        Task<(IEnumerable<User> Users, int TotalCount)> GetPaginatedUsersAsync(int skip, int take);
    }
} 