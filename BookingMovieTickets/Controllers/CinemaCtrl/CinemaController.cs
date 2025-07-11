using BookingMovieTickets.DTOs;
using BookingMovieTickets.DTOs.Responses;
using BookingMovieTickets.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BookingMovieTickets.Controllers.CinemaCtrl
{
    [ApiController]
    [Route("api/[controller]")]
    public class CinemaController : ControllerBase
    {
        private readonly ICinemaService _cinemaService;

        public CinemaController(ICinemaService cinemaService)
        {
            _cinemaService = cinemaService;
        }

        [HttpGet]
        public async Task<ActionResult<PaginatedResponse<CinemaResponseDTO>>> GetAll()
        {
            var cinemas = await _cinemaService.GetAllAsync();
            return Ok(cinemas);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CinemaResponseDTO>> GetById(Guid id)
        {
            var cinema = await _cinemaService.GetByIdAsync(id);
            if (cinema == null)
                return NotFound();

            return Ok(cinema);
        }

        [HttpPost]
        public async Task<ActionResult<CinemaResponseDTO>> Create(CreateCinemaDTO createCinemaDTO)
        {
            var cinema = await _cinemaService.CreateAsync(createCinemaDTO);
            return CreatedAtAction(nameof(GetById), new { id = cinema.CinemaId }, cinema);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<CinemaResponseDTO>> Update(Guid id, UpdateCinemaDTO updateCinemaDTO)
        {
            var cinema = await _cinemaService.UpdateAsync(id, updateCinemaDTO);
            if (cinema == null)
                return NotFound();

            return Ok(cinema);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(Guid id)
        {
            var (success, errorMessage) = await _cinemaService.DeleteAsync(id);
            if (!success)
                return BadRequest(new { message = errorMessage });

            return NoContent();
        }
    }
}