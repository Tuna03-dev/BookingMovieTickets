using System;

namespace BookingMovieTickets.Models
{
    public class TimeSlot : BaseEntity
    {
        public Guid TimeSlotId { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public bool IsActive { get; set; } = true;

        public ICollection<Showtime> Showtimes { get; set; }
    }
} 