using BookingMovieTickets.DTOs.Responses;
using BookingMovieTickets.Models;
using BookingMovieTickets.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Microsoft.AspNetCore.OData.Query;
using BookingMovieTickets.DTOs;
using AutoMapper;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BookingMovieTickets.Controllers.MovieCtrl
{
    [Route("api/[controller]")]
    [ApiController]
    public class MovieController : ControllerBase
    {
        private readonly IMovieService _movieService;
        private readonly ILogger<MovieController> _logger;
        private readonly IMapper _mapper;

        public MovieController(IMovieService movieService, ILogger<MovieController> logger, IMapper mapper)
        {
            _movieService = movieService;
            _logger = logger;
            _mapper = mapper;
        }



        // GET: api/<MovieController>
        [HttpGet("odata")]
        [EnableQuery]
        public async Task<IActionResult> GetMovies()
        {
            try
            {
                var movies = await _movieService.GetAllMoviesQueryable();
                var movieDtos = _mapper.Map<IEnumerable<MovieResponseDTO>>(movies);
                return Ok(movieDtos);
            }catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET api/<MovieController>/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var movie = await _movieService.GetByIdAsync(id);
            if (movie == null)
                return NotFound();
            return Ok(movie);
        }

        // POST api/<MovieController>
        [HttpPost]
        public async Task<IActionResult> Create([FromForm] CreateMovieDTO dto)
        {
            var movie = await _movieService.AddMovieAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = movie.MovieId }, movie);
        }

        // PUT api/<MovieController>/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromForm] UpdateMovieDTO dto)
        {
           
            var movie = await _movieService.UpdateMovieAsync(id, dto);
            return Ok(movie);
        }

        // DELETE api/<MovieController>/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var result = await _movieService.DeleteMovieAsync(id);
            if (!result) return NotFound();
            return NoContent();
        }

        [HttpGet("featured")]
        public async Task<IActionResult> GetFeaturedMovie()
        {
            var movie = await _movieService.GetFeaturedMovieAsync();
            return Ok(movie);
        }

        [HttpGet("now-showing")]
        public async Task<IActionResult> GetNowShowingMovies()
        {
            var movies = await _movieService.GetNowShowingMoviesAsync();
            return Ok(movies);
        }

        [HttpGet("coming-soon")]
        public async Task<IActionResult> GetComingSoonMovies()
        {
            var movies = await _movieService.GetComingSoonMoviesAsync();
            return Ok(movies);
        }

        // POST api/Movie/soft-delete-unused
        [HttpPost("soft-delete-unused")]
        public async Task<IActionResult> SoftDeleteUnusedMovies()
        {
            var count = await _movieService.SoftDeleteMoviesWithoutShowtimeAsync();
            return Ok(new { softDeleted = count });
        }

        // POST api/Movie/{id}/soft-delete
        [HttpPost("{id}/soft-delete")]
        public async Task<IActionResult> SoftDeleteMovieById(Guid id)
        {
            var result = await _movieService.SoftDeleteMovieByIdAsync(id);
            if (!result) return NotFound();
            return Ok(new { message = "Movie soft deleted successfully" });
        }
        
    }
}
