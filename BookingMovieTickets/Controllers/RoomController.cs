using Microsoft.AspNetCore.Mvc;
using BookingMovieTickets.Models;
using BookingMovieTickets.Services;
using BookingMovieTickets.DTOs;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace BookingMovieTickets.Controllers
{
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

        [HttpGet("by-cinema/{cinemaId}")]
        public async Task<IActionResult> GetRoomsByCinema(Guid cinemaId)
        {
            var rooms = await _roomService.GetRoomsByCinemaAsync(cinemaId);
            return Ok(rooms);
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
            var addedRoom = await _roomService.AddRoomAsync(room);
            return Ok(addedRoom);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRoom(Guid id, [FromBody] Room room)
        {
            if (id != room.RoomId) return BadRequest();
            var updatedRoom = await _roomService.UpdateRoomAsync(room);
            if (updatedRoom == null) return NotFound();
            return Ok(updatedRoom);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRoom(Guid id)
        {
            var result = await _roomService.DeleteRoomAsync(id);
            if (!result) return NotFound();
            return NoContent();
        }
    }
} 