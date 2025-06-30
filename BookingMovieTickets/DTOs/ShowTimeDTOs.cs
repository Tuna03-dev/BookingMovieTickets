namespace BookingMovieTickets.DTOs
{
    public class ShowtimeResponseDTO
    {
        public Guid ShowtimeId { get; set; }
        public Guid MovieId { get; set; }
        public Guid RoomId { get; set; }
        public DateTime Date { get; set; }
        public Guid TimeSlotId { get; set; }
        public TimeSlotDTO? TimeSlot { get; set; }
        public decimal TicketPrice { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public CinemaResponseDTO? Cinema { get; set; }
        public string? RoomNumber { get; set; }
    }

    public class CinemaShowtimeDTO
    {
        public Guid CinemaId { get; set; }
        public string CinemaName { get; set; } = null!;
        public string? CinemaAddress { get; set; }
        public List<ShowtimeResponseDTO> Showtimes { get; set; } = new();
    }

    public class TimeSlotDTO
    {
        public Guid TimeSlotId { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public bool IsActive { get; set; }
    }

    public class SeatDTO
    {
        public Guid SeatId { get; set; }
        public string Row { get; set; } = null!;
        public int SeatColumn { get; set; }
        public string? SeatNumber { get; set; }
        public string? SeatType { get; set; }
        public bool IsAvailable { get; set; }
    }

    public class SeatStatusDTO
    {
        public Guid ShowtimeId { get; set; }
        public List<SeatDTO> Seats { get; set; } = new();
        public List<Guid> BookedSeatIds { get; set; } = new();
    }
}
