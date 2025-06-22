using StackExchange.Redis;
using System.Threading.Tasks;
using BookingMovieTickets.Services;

namespace BookingMovieTickets.Services.Implements
{
    public class RedisService : IRedisService
    {
        private readonly IDatabase _db;
        public RedisService(IConnectionMultiplexer redis)
        {
            _db = redis.GetDatabase();
        }
        public async Task SetRefreshTokenAsync(string userId, string refreshToken, int expirationDays)
        {
            await _db.StringSetAsync($"refresh_token:{userId}", refreshToken, System.TimeSpan.FromDays(expirationDays));
        }
        public async Task<string?> GetRefreshTokenAsync(string userId)
        {
            var value = await _db.StringGetAsync($"refresh_token:{userId}");
            return value.HasValue ? value.ToString() : null;
        }
        public async Task DeleteRefreshTokenAsync(string userId)
        {
            await _db.KeyDeleteAsync($"refresh_token:{userId}");
        }
    }
} 