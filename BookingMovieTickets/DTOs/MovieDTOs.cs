namespace BookingMovieTickets.DTOs
{
    public class MovieResponseDTO
    {
        public Guid MovieId { get; set; }
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public string? Genre { get; set; }
        public int Duration { get; set; }
        public DateOnly? ReleaseDate { get; set; }
        public string? PosterUrl { get; set; }
        public string Status { get; set; } = null!;
        public string? Director { get; set; }
        public string? Actors { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
