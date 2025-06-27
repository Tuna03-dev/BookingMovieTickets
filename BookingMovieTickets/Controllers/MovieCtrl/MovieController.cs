using BookingMovieTickets.DTOs.Responses;
using BookingMovieTickets.Models;
using BookingMovieTickets.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Microsoft.AspNetCore.OData.Query;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BookingMovieTickets.Controllers.MovieCtrl
{
    [Route("api/[controller]")]
    [ApiController]
    public class MovieController : ControllerBase
    {
        private readonly IMovieService _movieService;

        public MovieController(IMovieService movieService)
        {
            _movieService = movieService;
        }
        // GET: api/<MovieController>
        [HttpGet("odata")]
        [EnableQuery]
        public async Task<IActionResult> GetMovies()
        {
            try
            {
                var movies = await _movieService.GetAllMoviesQueryable();
                return Ok(movies);
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
        public void Post([FromBody] string value)
        {
        }

        // PUT api/<MovieController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<MovieController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
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

        
    }
}
