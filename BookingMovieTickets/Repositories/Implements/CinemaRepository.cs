using BookingMovieTickets.Data;
using BookingMovieTickets.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BookingMovieTickets.Repositories.Implements
{
    public class CinemaRepository : ICinemaRepository
    {
        private readonly BookingMovieTicketsContext _context;

        public CinemaRepository(BookingMovieTicketsContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Cinema>> GetAllAsync()
        {
            return await _context.Cinemas
                .ToListAsync();
        }

        public async Task<Cinema?> GetByIdAsync(Guid id)
        {
            return await _context.Cinemas
                .FirstOrDefaultAsync(c => c.CinemaId == id);
        }

        public async Task<Cinema> CreateAsync(Cinema cinema)
        {
            cinema.CinemaId = Guid.NewGuid();
            _context.Cinemas.Add(cinema);
            await _context.SaveChangesAsync();
            return cinema;
        }

        public async Task<Cinema?> UpdateAsync(Guid id, Cinema cinema)
        {
            var existingCinema = await _context.Cinemas
                .FirstOrDefaultAsync(c => c.CinemaId == id);

            if (existingCinema == null)
                return null;

            existingCinema.Name = cinema.Name;
            existingCinema.Address = cinema.Address;
            existingCinema.City = cinema.City;

            await _context.SaveChangesAsync();
            return existingCinema;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var cinema = await _context.Cinemas
                .FirstOrDefaultAsync(c => c.CinemaId == id );

            if (cinema == null)
                return false;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ExistsAsync(Guid id)
        {
            return await _context.Cinemas
                .AnyAsync(c => c.CinemaId == id);
        }
    }
}