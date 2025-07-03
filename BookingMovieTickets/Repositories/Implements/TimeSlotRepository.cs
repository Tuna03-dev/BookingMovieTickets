using BookingMovieTickets.Data;
using BookingMovieTickets.Models;
using BookingMovieTickets.Repositories.Implements;
using System;

public class TimeSlotRepository : BaseRepository<TimeSlot>, ITimeSlotRepository
{
    public TimeSlotRepository(BookingMovieTicketsContext context) : base(context) { }
    // Thêm các phương thức đặc thù cho TimeSlot nếu cần
} 