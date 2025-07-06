using System;
using System.Collections.Generic;

namespace BookingMovieTickets.DTOs
{
    public class RoomResponseDTO
    {
        public Guid RoomId { get; set; }
        public Guid CinemaId { get; set; }
        public string RoomNumber { get; set; } = null!;
        public int TotalSeats { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    public class RoomWithCinemaDTO
    {
        public Guid RoomId { get; set; }
        public Guid CinemaId { get; set; }
        public string RoomNumber { get; set; } = null!;
        public int TotalSeats { get; set; }
        public CinemaBasicDTO Cinema { get; set; } = null!;
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    public class CinemaBasicDTO
    {
        public Guid CinemaId { get; set; }
        public string Name { get; set; } = null!;
        public string Address { get; set; } = null!;
        public string? City { get; set; }
        public string? ImageUrl { get; set; }
    }
} 