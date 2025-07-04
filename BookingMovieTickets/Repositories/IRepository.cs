using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace BookingMovieTickets.Repositories
{
    public interface IRepository<T> where T : class
    {
        Task<IEnumerable<T>> GetAllAsync();
        Task<T?> GetByIdAsync(Guid id);
        Task<T> AddAsync(T entity);
        Task<T?> UpdateAsync(Guid id, T entity);
        Task<bool> DeleteAsync(Guid id);
        Task<bool> ExistsAsync(Guid id);
        IQueryable<T> GetQueryable();
    }
} 