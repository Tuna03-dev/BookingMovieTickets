using System.Threading.Tasks;

public interface IStatsService
{
    Task<object> GetQuickStatsAsync();
} 