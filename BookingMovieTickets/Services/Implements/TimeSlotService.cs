using BookingMovieTickets.Models;
using System;
using System.Linq;
using System.Threading.Tasks;

public class TimeSlotService : ITimeSlotService
{
    private readonly ITimeSlotRepository _timeSlotRepository;
    public TimeSlotService(ITimeSlotRepository timeSlotRepository)
    {
        _timeSlotRepository = timeSlotRepository;
    }

    public IQueryable<TimeSlot> GetTimeSlots() => _timeSlotRepository.GetQueryable();
    public Task<TimeSlot?> GetTimeSlotByIdAsync(Guid id) => _timeSlotRepository.GetByIdAsync(id);
    public Task AddTimeSlotAsync(TimeSlot timeSlot) => _timeSlotRepository.AddAsync(timeSlot);
    public Task UpdateTimeSlotAsync(TimeSlot timeSlot) => _timeSlotRepository.UpdateAsync(timeSlot.TimeSlotId, timeSlot);
    public Task DeleteTimeSlotAsync(Guid id) => _timeSlotRepository.DeleteAsync(id);
} 