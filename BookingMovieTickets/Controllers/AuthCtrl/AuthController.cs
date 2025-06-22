using BookingMovieTickets.Models;
using BookingMovieTickets.Services.Jwts;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using BookingMovieTickets.DTOs;
using StackExchange.Redis;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using BookingMovieTickets.Services;


namespace BookingMovieTickets.Controllers.AuthCtrl
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly IJwtService _jwtService;
        private readonly IRedisService _redisService;
        private readonly JwtSettings _jwtSettings;

        public AuthController(UserManager<User> userManager, SignInManager<User> signInManager, IJwtService jwtService, IRedisService redisService, IOptions<JwtSettings> jwtSettings)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _jwtService = jwtService;
            _redisService = redisService;
            _jwtSettings = jwtSettings.Value;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null)
                return Unauthorized("Invalid credentials");

            var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);
            if (!result.Succeeded)
                return Unauthorized("Invalid credentials");

            var accessToken = await _jwtService.GenerateAccessTokenFromUserAsync(user, _userManager);
            var refreshToken = _jwtService.GenerateRefreshToken();
            await _redisService.SetRefreshTokenAsync(user.Id.ToString(), refreshToken, _jwtSettings.RefreshTokenExpirationDays);
            // Set refresh token vào HttpOnly cookie
            Response.Cookies.Append("refreshToken", refreshToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTimeOffset.UtcNow.AddDays(_jwtSettings.RefreshTokenExpirationDays)
            });
            return Ok(new { accessToken });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            var user = new User
            {
                UserName = request.Email,
                Email = request.Email,
                FullName = request.FullName,
                PhoneNumber = request.PhoneNumber
            };
            var result = await _userManager.CreateAsync(user, request.Password);
            if (!result.Succeeded)
                return BadRequest(result.Errors);
            return Ok("Registration successful");
        }

        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken()
        {
            var refreshToken = Request.Cookies["refreshToken"];
            if (string.IsNullOrEmpty(refreshToken))
                return Unauthorized();
            var principal = _jwtService.GetPrincipalFromExpiredToken(Request.Headers["Authorization"].ToString().Replace("Bearer ", ""));
            if (principal == null)
                return Unauthorized();
            var userId = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                return Unauthorized();
            var storedRefreshToken = await _redisService.GetRefreshTokenAsync(userId);
            if (storedRefreshToken != refreshToken)
                return Unauthorized();
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return Unauthorized();
            var newAccessToken = await _jwtService.GenerateAccessTokenFromUserAsync(user, _userManager);
            var newRefreshToken = _jwtService.GenerateRefreshToken();
            await _redisService.SetRefreshTokenAsync(user.Id.ToString(), newRefreshToken, _jwtSettings.RefreshTokenExpirationDays);
            // Cập nhật lại cookie
            Response.Cookies.Append("refreshToken", newRefreshToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTimeOffset.UtcNow.AddDays(_jwtSettings.RefreshTokenExpirationDays)
            });
            return Ok(new { accessToken = newAccessToken });
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            var refreshToken = Request.Cookies["refreshToken"];
            if (string.IsNullOrEmpty(refreshToken))
                return Ok();
            var principal = _jwtService.GetPrincipalFromExpiredToken(Request.Headers["Authorization"].ToString().Replace("Bearer ", ""));
            if (principal != null)
            {
                var userId = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (!string.IsNullOrEmpty(userId))
                {
                    await _redisService.DeleteRefreshTokenAsync(userId);
                }
            }
            // Xóa cookie
            Response.Cookies.Delete("refreshToken");
            return Ok();
        }
    }
} 