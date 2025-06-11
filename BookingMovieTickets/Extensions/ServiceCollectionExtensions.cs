using BookingMovieTickets.Repositories;
using BookingMovieTickets.Repositories.Implements;
using BookingMovieTickets.Services;
using BookingMovieTickets.Services.Implements;

namespace BookingMovieTickets.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            services.AddScoped<IMovieService, MovieService>();
            services.AddScoped<ICinemaService, CinemaService>();

            return services;
        }

        public static IServiceCollection AddRepositories(this IServiceCollection services)
        {
            services.AddScoped<IMovieRepository, MovieRepository>();
            services.AddScoped<ICinemaRepository, CinemaRepository>();

            return services;
        }
    }
}
