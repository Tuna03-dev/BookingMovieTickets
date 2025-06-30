namespace BookingMovieTickets.DTOs
{
    public class PaymentRequestDTO
    {
        public Guid? UserId { get; set; }
        public Guid ShowtimeId { get; set; }
        public List<Guid> SelectedSeatIds { get; set; } = new();
        public decimal TotalPrice { get; set; }
        public string? PaymentMethod { get; set; }
    }

    public class PaymentResponseDTO
    {
        public Guid BookingId { get; set; }
        public Guid PaymentId { get; set; }
        public string Message { get; set; } = string.Empty;
    }
} 