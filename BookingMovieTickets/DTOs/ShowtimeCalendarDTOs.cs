using System;
using System.Collections.Generic;

namespace BookingMovieTickets.DTOs
{
    public class ShowtimeCalendarResponseDTO
    {
        public List<RoomCalendarDTO> Rooms { get; set; } = new();
        public List<TimeSlotCalendarDTO> TimeSlots { get; set; } = new();
        public List<ShowtimeCalendarItemDTO> Showtimes { get; set; } = new();
    }

    public class RoomCalendarDTO
    {
        public Guid RoomId { get; set; }
        public string RoomNumber { get; set; } = string.Empty;
        public int TotalSeats { get; set; }
    }

    public class TimeSlotCalendarDTO
    {
        public Guid TimeSlotId { get; set; }
        public string StartTime { get; set; } = string.Empty; // "09:00"
        public string EndTime { get; set; } = string.Empty;   // "11:00"
    }

    public class ShowtimeCalendarItemDTO
    {
        public Guid ShowtimeId { get; set; }
        public Guid RoomId { get; set; }
        public Guid TimeSlotId { get; set; }
        public DateTime Date { get; set; }
        public string MovieTitle { get; set; } = string.Empty;
        public string MoviePoster { get; set; } = string.Empty;
        public decimal TicketPrice { get; set; }
        public int BookedSeats { get; set; }
        public int TotalSeats { get; set; }
    }
} 