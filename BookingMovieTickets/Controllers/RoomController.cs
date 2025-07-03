using Microsoft.AspNetCore.Mvc;
using BookingMovieTickets.Models;
using System;
using System.Linq;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class RoomController : ControllerBase
{
    private readonly IRoomService _roomService;
    public RoomController(IRoomService roomService)
    {
        _roomService = roomService;
    }

    [HttpGet]
    public IActionResult GetRooms([FromQuery] int skip = 0, [FromQuery] int top = 10)
    {
        var query = _roomService.GetRooms();
        var total = query.Count();
        var items = query.Skip(skip).Take(top).ToList();
        return Ok(new { value = items, totalCount = total });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetRoomById(Guid id)
    {
        var room = await _roomService.GetRoomByIdAsync(id);
        if (room == null) return NotFound();
        return Ok(room);
    }

    [HttpPost]
    public async Task<IActionResult> AddRoom([FromBody] Room room)
    {
        await _roomService.AddRoomAsync(room);
        return Ok(room);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateRoom(Guid id, [FromBody] Room room)
    {
        if (id != room.RoomId) return BadRequest();
        await _roomService.UpdateRoomAsync(room);
        return Ok(room);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteRoom(Guid id)
    {
        await _roomService.DeleteRoomAsync(id);
        return NoContent();
    }
} 