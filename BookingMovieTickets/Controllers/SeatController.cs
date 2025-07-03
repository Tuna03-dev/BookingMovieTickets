using Microsoft.AspNetCore.Mvc;
using BookingMovieTickets.Services;
using BookingMovieTickets.DTOs;

namespace BookingMovieTickets.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SeatController : ControllerBase
    {
        private readonly ISeatService _seatService;

        public SeatController(ISeatService seatService)
        {
            _seatService = seatService;
        }

        [HttpGet("showtime/{showtimeId}")]
        public async Task<ActionResult<SeatStatusDTO>> GetSeatStatusByShowtime(Guid showtimeId)
        {
            try
            {
                var seatStatus = await _seatService.GetSeatStatusByShowtimeAsync(showtimeId);
                return Ok(seatStatus);
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching seat status", error = ex.Message });
            }
        }

        [HttpGet("showtime/{showtimeId}/available")]
        public async Task<ActionResult<List<SeatDTO>>> GetAvailableSeatsByShowtime(Guid showtimeId)
        {
            try
            {
                var availableSeats = await _seatService.GetAvailableSeatsByShowtimeAsync(showtimeId);
                return Ok(availableSeats);
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching available seats", error = ex.Message });
            }
        }

        [HttpGet("showtime/{showtimeId}/booked")]
        public async Task<ActionResult<List<Guid>>> GetBookedSeatIdsByShowtime(Guid showtimeId)
        {
            try
            {
                var bookedSeatIds = await _seatService.GetBookedSeatIdsByShowtimeAsync(showtimeId);
                return Ok(bookedSeatIds);
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching booked seats", error = ex.Message });
            }
        }

        [HttpGet]
        public IActionResult GetSeats([FromQuery] int skip = 0, [FromQuery] int top = 10)
        {
            //// Giả sử _context là BookingMovieTicketsContext, inject vào controller
            //var query = _context.Seats;
            //var total = query.Count();
            //var items = query.OrderBy(x => x.Row).ThenBy(x => x.SeatColumn).Skip(skip).Take(top).ToList();
            //return Ok(new { value = items, totalCount = total });
            return Ok();
        }
    }
} 