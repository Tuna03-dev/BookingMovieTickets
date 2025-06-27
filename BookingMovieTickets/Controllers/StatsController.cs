using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

[Route("api/stats")]
[ApiController]
public class StatsController : ControllerBase
{
    private readonly IStatsService _statsService;
    public StatsController(IStatsService statsService)
    {
        _statsService = statsService;
    }

    [HttpGet("quick")]
    public async Task<IActionResult> GetQuickStats()
    {
        var stats = await _statsService.GetQuickStatsAsync();
        return Ok(stats);
    }
} 