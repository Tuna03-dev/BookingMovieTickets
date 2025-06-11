using BookingMovieTickets.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BookingMovieTickets.Repositories
{
    public interface ICinemaRepository
    {
        Task<IEnumerable<Cinema>> GetAllAsync();
        Task<Cinema?> GetByIdAsync(Guid id);
        Task<Cinema> CreateAsync(Cinema cinema);
        Task<Cinema?> UpdateAsync(Guid id, Cinema cinema);
        Task<bool> DeleteAsync(Guid id);
        Task<bool> ExistsAsync(Guid id);
    }
} 