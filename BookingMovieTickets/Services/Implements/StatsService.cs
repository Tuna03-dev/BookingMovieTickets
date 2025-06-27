using System.Threading.Tasks;

public class StatsService : IStatsService
{
    private readonly IStatsRepository _statsRepository;
    public StatsService(IStatsRepository statsRepository)
    {
        _statsRepository = statsRepository;
    }

    public async Task<object> GetQuickStatsAsync()
    {
        var moviesCount = await _statsRepository.GetMoviesCountAsync();
        var cinemasCount = await _statsRepository.GetCinemasCountAsync();
        var customersCount = await _statsRepository.GetCustomersCountAsync();
        

        return new
        {
            moviesCount,
            cinemasCount,
            customersCount,

        };
    }
} 