using System;
using System.ComponentModel.DataAnnotations;

namespace BookingMovieTickets.DTOs
{
    public class CreateCinemaDTO
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = null!;

        [Required]
        [StringLength(255)]
        public string Address { get; set; } = null!;

        [StringLength(100)]
        public string? City { get; set; }
    }

    public class UpdateCinemaDTO
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = null!;

        [Required]
        [StringLength(255)]
        public string Address { get; set; } = null!;

        [StringLength(100)]
        public string? City { get; set; }
    }

    public class CinemaResponseDTO
    {
        public Guid CinemaId { get; set; }
        public string Name { get; set; } = null!;
        public string Address { get; set; } = null!;
        public string? City { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
} 