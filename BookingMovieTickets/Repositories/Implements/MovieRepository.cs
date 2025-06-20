﻿using BookingMovieTickets.Data;
using BookingMovieTickets.DTOs.Responses;
using BookingMovieTickets.Models;
using Microsoft.EntityFrameworkCore;

namespace BookingMovieTickets.Repositories.Implements
{
    public class MovieRepository : IMovieRepository
    {
        private readonly BookingMovieTicketsContext _context;

        public MovieRepository(BookingMovieTicketsContext context)
        {
            _context = context;
        }

        public Task<Movie> AddAsync(Movie movie)
        {
            throw new NotImplementedException();
        }

        public Task DeleteAsync(Guid id)
        {
            throw new NotImplementedException();
        }

        public async Task<PaginatedResponse<Movie>> GetAllMoviesAsync(int pageNumber, int pageSize)
        {
            var query = _context.Movies.AsQueryable().OrderByDescending(m => m.CreatedAt);
            var totalItems = await query.CountAsync();
            var totalPages = (int)Math.Ceiling((double)totalItems / pageSize);
            var movies = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PaginatedResponse<Movie>
            {
                Items = movies,
                TotalItems = totalItems,
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalPages = totalPages
            };
        }

        public Task<Movie?> GetByIdAsync(Guid id)
        {
            throw new NotImplementedException();
        }

        

        public Task<Movie> UpdateAsync(Movie movie)
        {
            throw new NotImplementedException();
        }
    }
}
