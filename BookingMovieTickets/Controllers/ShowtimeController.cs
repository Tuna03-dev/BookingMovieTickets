using Microsoft.AspNetCore.Mvc;
using BookingMovieTickets.Services;
using BookingMovieTickets.DTOs;


namespace BookingMovieTickets.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ShowtimeController : ControllerBase
    {
        private readonly IMovieService _movieService;

        public ShowtimeController(IMovieService movieService)
        {
            _movieService = movieService;
        }

        [HttpGet("movie/{movieId}/date/{date:datetime}")]
        public async Task<ActionResult<List<CinemaShowtimeDTO>>> GetShowtimesByMovieAndDate(Guid movieId, DateTime date)
        {
            try
            {
                var showtimes = await _movieService.GetShowtimesByMovieAndDateAsync(movieId, date);
                return Ok(showtimes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching showtimes", error = ex.Message });
            }
        }

        [HttpGet]
        public IActionResult GetShowtimes([FromQuery] int skip = 0, [FromQuery] int top = 10)
        {
            //// Giả sử _context là BookingMovieTicketsContext, inject vào controller
            //var query = _context.Showtimes;
            //var total = query.Count();
            //var items = query.OrderBy(x => x.Date).Skip(skip).Take(top).ToList();
            //return Ok(new { value = items, totalCount = total });
            return Ok();
        }
    }
} 