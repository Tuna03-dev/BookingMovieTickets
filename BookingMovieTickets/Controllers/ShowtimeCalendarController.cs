using BookingMovieTickets.DTOs;
using BookingMovieTickets.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace BookingMovieTickets.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ShowtimeCalendarController : ControllerBase
    {
        private readonly IShowtimeCalendarService _showtimeCalendarService;

        public ShowtimeCalendarController(IShowtimeCalendarService showtimeCalendarService)
        {
            _showtimeCalendarService = showtimeCalendarService;
        }

        [HttpGet]
        public async Task<ActionResult<ShowtimeCalendarResponseDTO>> GetShowtimeCalendar(
            [FromQuery] Guid cinemaId,
            [FromQuery] DateTime fromDate,
            [FromQuery] DateTime toDate)
        {
            var result = await _showtimeCalendarService.GetShowtimeCalendarAsync(cinemaId, fromDate, toDate);
            return Ok(result);
        }
    }
} 