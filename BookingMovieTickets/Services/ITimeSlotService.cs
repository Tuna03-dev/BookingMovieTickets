using BookingMovieTickets.Models;
using System;
using System.Linq;
using System.Threading.Tasks;

public interface ITimeSlotService
{
    IQueryable<TimeSlot> GetTimeSlots();
    Task<TimeSlot?> GetTimeSlotByIdAsync(Guid id);
    Task AddTimeSlotAsync(TimeSlot timeSlot);
    Task UpdateTimeSlotAsync(TimeSlot timeSlot);
    Task DeleteTimeSlotAsync(Guid id);
} 