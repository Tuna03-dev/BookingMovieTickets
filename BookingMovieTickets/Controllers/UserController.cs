using BookingMovieTickets.Models;
using BookingMovieTickets.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;
    public UserController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet]
    public async Task<IActionResult> GetUsers([FromQuery] int skip = 0, [FromQuery] int take = 10)
    {
        var (users, total) = await _userService.GetPaginatedUsersAsync(skip, take);
        return Ok(new { value = users, totalCount = total });
    }
} 