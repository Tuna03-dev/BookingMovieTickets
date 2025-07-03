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
using Microsoft.AspNetCore.Authorization;
using BookingMovieTickets.Services.Implements;
using Microsoft.AspNetCore.Http.HttpResults;

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
        private readonly CloudinaryService _cloudinaryService;

        public AuthController(UserManager<User> userManager, SignInManager<User> signInManager, IJwtService jwtService, IRedisService redisService, IOptions<JwtSettings> jwtSettings, CloudinaryService cloudinaryService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _jwtService = jwtService;
            _redisService = redisService;
            _jwtSettings = jwtSettings.Value;
            _cloudinaryService = cloudinaryService;
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
            var roles = await _userManager.GetRolesAsync(user);
            return Ok(new
            {
                accessToken,
                role = roles
            });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var existingUser = await _userManager.FindByEmailAsync(request.Email);
            if (existingUser != null)
                return BadRequest("Email already exists");

            var user = new User
            {
                UserName = request.Email,
                Email = request.Email,
                FullName = request.FullName,
                PhoneNumber = request.PhoneNumber,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                
            };

            var result = await _userManager.CreateAsync(user, request.Password);
            if (!result.Succeeded)
                return BadRequest(result.Errors.Select(e => e.Description));

            var roleResult = await _userManager.AddToRoleAsync(user, "User");
            if (!roleResult.Succeeded)
                return BadRequest(roleResult.Errors.Select(e => e.Description));

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

            var roles = await _userManager.GetRolesAsync(user);
            return Ok(new { accessToken = newAccessToken, role = roles });
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

        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> Me()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return Unauthorized();
            var roles = await _userManager.GetRolesAsync(user);
            return Ok(new
            {
                id = user.Id,
                email = user.Email,
                fullName = user.FullName,
                phoneNumber = user.PhoneNumber,
                address = user.Address,
                imageUrl = user.ImageUrl,
                dateOfBirth = user.DateOfBirth,
                createdAt = user.CreatedAt,
                roles = roles
            });
        }

        [Authorize]
        [HttpPut("me")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return Unauthorized();
            if (!string.IsNullOrEmpty(request.FullName)) user.FullName = request.FullName;
            if (!string.IsNullOrEmpty(request.PhoneNumber)) user.PhoneNumber = request.PhoneNumber;
            if (!string.IsNullOrEmpty(request.Address)) user.Address = request.Address;
            if (request.DateOfBirth.HasValue) user.DateOfBirth = request.DateOfBirth;
            user.UpdatedAt = DateTime.UtcNow;
            await _userManager.UpdateAsync(user);
            var roles = await _userManager.GetRolesAsync(user);
            return Ok(new
            {
                id = user.Id,
                email = user.Email,
                fullName = user.FullName,
                phoneNumber = user.PhoneNumber,
                address = user.Address,
                imageUrl = user.ImageUrl,
                dateOfBirth = user.DateOfBirth,
                createdAt = user.CreatedAt,
                roles = roles
            });
        }

        [Authorize]
        [HttpPost("me/avatar")]
        public async Task<IActionResult> UploadAvatar([FromForm] IFormFile file)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return Unauthorized();
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded");
            
            var imageUrl = await _cloudinaryService.UploadImageAsync(file);
            user.ImageUrl = imageUrl;
            user.UpdatedAt = DateTime.UtcNow;
            await _userManager.UpdateAsync(user);
            return Ok(new UploadAvatarResponse { ImageUrl = imageUrl });
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("users")]
        public async Task<IActionResult> GetUsers([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var users = _userManager.Users
                .OrderByDescending(u => u.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();
            var total = _userManager.Users.Count();
            var result = users.Select(u => new {
                id = u.Id,
                email = u.Email,
                fullName = u.FullName,
                phoneNumber = u.PhoneNumber,
                address = u.Address,
                imageUrl = u.ImageUrl,
                dateOfBirth = u.DateOfBirth,
                createdAt = u.CreatedAt,
                updatedAt = u.UpdatedAt
            });
            return Ok(new { value = result, totalCount = total });
        }
    }
} 