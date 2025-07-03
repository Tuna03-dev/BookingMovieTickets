using BookingMovieTickets.Models;
using BookingMovieTickets.Repositories;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BookingMovieTickets.Services.Implements
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<(IEnumerable<User> Users, int TotalCount)> GetPaginatedUsersAsync(int skip, int take)
        {
            return await _userRepository.GetPaginatedUsersAsync(skip, take);
        }
    }
} 