using System;
using System.Threading.Tasks;

namespace BookingMovieTickets.Services
{
    public interface IRedisService
    {
        Task SetRefreshTokenAsync(string userId, string refreshToken, int expirationDays);
        Task<string?> GetRefreshTokenAsync(string userId);
        Task DeleteRefreshTokenAsync(string userId);
    }
} 