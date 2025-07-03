using BookingMovieTickets.Repositories;
using BookingMovieTickets.Repositories.Implements;
using BookingMovieTickets.Services;
using BookingMovieTickets.Services.Implements;
using Microsoft.Extensions.DependencyInjection;
using StackExchange.Redis;
using Microsoft.Extensions.Configuration;

namespace BookingMovieTickets.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            services.AddScoped<IMovieService, MovieService>();
            services.AddScoped<ICinemaService, CinemaService>();
            services.AddScoped<IStatsService, StatsService>();
            services.AddScoped<ISeatService, SeatService>();
            services.AddScoped<IPaymentRepository, PaymentRepository>();
            services.AddScoped<IPaymentService, PaymentService>();
            services.AddScoped<IBookingRepository, BookingRepository>();
            services.AddScoped<IBookingSeatRepository, BookingSeatRepository>();
            services.AddScoped<CloudinaryService>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IUserService, UserService>();
            return services;
        }

        public static IServiceCollection AddRepositories(this IServiceCollection services)
        {
            services.AddScoped<IMovieRepository, MovieRepository>();
            services.AddScoped<ICinemaRepository, CinemaRepository>();
            services.AddScoped<IStatsRepository, StatsRepository>();
            services.AddScoped<ISeatRepository, SeatRepository>();
            return services;
        }

        public static IServiceCollection AddRedisServices(this IServiceCollection services, IConfiguration configuration)
        {
            var redisConnectionString = configuration.GetSection("Redis")?["ConnectionString"];
            services.AddSingleton<IConnectionMultiplexer>(ConnectionMultiplexer.Connect(redisConnectionString));
            services.AddScoped<IRedisService, RedisService>();
            return services;
        }
    }
}
