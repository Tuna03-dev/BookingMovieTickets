using BookingMovieTickets.DTOs;
using BookingMovieTickets.DTOs.Responses;
using BookingMovieTickets.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BookingMovieTickets.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    // [Authorize] // Tạm thời bỏ để test
    public class SeatController : ControllerBase
    {
        private readonly ISeatService _seatService;

        public SeatController(ISeatService seatService)
        {
            _seatService = seatService;
        }

        [HttpGet("room/{roomId}")]
        public async Task<ActionResult<List<SeatResponseDTO>>> GetSeatsByRoom(Guid roomId)
        {
            var seats = await _seatService.GetSeatsByRoomAsync(roomId);
            return Ok(seats);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SeatResponseDTO>> GetById(Guid id)
        {
            var seat = await _seatService.GetByIdAsync(id);
            if (seat == null)
                return NotFound();

            return Ok(seat);
        }

        [HttpPost]
        public async Task<ActionResult<SeatResponseDTO>> Create(CreateSeatDTO createSeatDTO)
        {
            var seat = await _seatService.CreateAsync(createSeatDTO);
            return CreatedAtAction(nameof(GetById), new { id = seat.SeatId }, seat);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<SeatResponseDTO>> Update(Guid id, UpdateSeatDTO updateSeatDTO)
        {
            var seat = await _seatService.UpdateAsync(id, updateSeatDTO);
            if (seat == null)
                return NotFound();

            return Ok(seat);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(Guid id)
        {
            var result = await _seatService.DeleteAsync(id);
            if (!result)
                return NotFound();

            return NoContent();
        }

        [HttpPost("generate-layout")]
        public async Task<ActionResult<List<SeatResponseDTO>>> GenerateSeatLayout(SeatLayoutDTO layoutDTO)
        {
            var seats = await _seatService.GenerateSeatLayoutAsync(layoutDTO);
            return Ok(seats);
        }

        [HttpDelete("bulk")]
        public async Task<ActionResult> DeleteSeats(BulkDeleteSeatsDTO bulkDeleteDTO)
        {
            var result = await _seatService.DeleteSeatsAsync(bulkDeleteDTO.SeatIds);
            if (!result)
                return BadRequest("Không thể xóa một số ghế");

            return NoContent();
        }

        [HttpGet("stats/{roomId}")]
        public async Task<ActionResult<SeatStatsDTO>> GetSeatStats(Guid roomId)
        {
            var stats = await _seatService.GetSeatStatsAsync(roomId);
            return Ok(stats);
        }

        [HttpGet("room/{roomId}/has-booking")]
        public async Task<ActionResult<bool>> RoomHasBooking(Guid roomId)
        {
            var hasBooking = await _seatService.RoomHasBookingAsync(roomId);
            return Ok(hasBooking);
        }

        [HttpPost("add-row/{roomId}")]
        public async Task<ActionResult<List<SeatResponseDTO>>> AddRow(Guid roomId)
        {
            var result = await _seatService.AddRowAsync(roomId);
            return Ok(result);
        }

        [HttpPost("add-column/{roomId}")]
        public async Task<ActionResult<List<SeatResponseDTO>>> AddColumn(Guid roomId)
        {
            var result = await _seatService.AddColumnAsync(roomId);
            return Ok(result);
        }
    }
} 