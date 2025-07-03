using Microsoft.AspNetCore.Mvc;
using BookingMovieTickets.Models;
using System;
using System.Linq;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class TimeSlotController : ControllerBase
{
    private readonly ITimeSlotService _timeSlotService;
    public TimeSlotController(ITimeSlotService timeSlotService)
    {
        _timeSlotService = timeSlotService;
    }

    [HttpGet]
    public IActionResult GetTimeSlots([FromQuery] int skip = 0, [FromQuery] int top = 10)
    {
        var query = _timeSlotService.GetTimeSlots();
        var total = query.Count();
        var items = query.Skip(skip).Take(top).ToList();
        return Ok(new { value = items, totalCount = total });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetTimeSlotById(Guid id)
    {
        var timeSlot = await _timeSlotService.GetTimeSlotByIdAsync(id);
        if (timeSlot == null) return NotFound();
        return Ok(timeSlot);
    }

    [HttpPost]
    public async Task<IActionResult> AddTimeSlot([FromBody] TimeSlot timeSlot)
    {
        await _timeSlotService.AddTimeSlotAsync(timeSlot);
        return Ok(timeSlot);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTimeSlot(Guid id, [FromBody] TimeSlot timeSlot)
    {
        if (id != timeSlot.TimeSlotId) return BadRequest();
        await _timeSlotService.UpdateTimeSlotAsync(timeSlot);
        return Ok(timeSlot);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTimeSlot(Guid id)
    {
        await _timeSlotService.DeleteTimeSlotAsync(id);
        return NoContent();
    }
} 