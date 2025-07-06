using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BookingMovieTickets.DTOs
{
    public class CreateSeatDTO
    {
        [Required]
        public Guid RoomId { get; set; }

        [Required]
        [StringLength(10)]
        public string Row { get; set; } = null!;

        [Required]
        [Range(1, 50)]
        public int SeatColumn { get; set; }

        [Required]
        [StringLength(20)]
        public string SeatNumber { get; set; } = null!;
    }

    public class UpdateSeatDTO
    {
        [StringLength(10)]
        public string? Row { get; set; }

        [Range(1, 50)]
        public int? SeatColumn { get; set; }

        [StringLength(20)]
        public string? SeatNumber { get; set; }
    }

    public class SeatResponseDTO
    {
        public Guid SeatId { get; set; }
        public Guid RoomId { get; set; }
        public string Row { get; set; } = null!;
        public int SeatColumn { get; set; }
        public string SeatNumber { get; set; } = null!;
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    public class SeatLayoutDTO
    {
        [Required]
        public Guid RoomId { get; set; }

        [Required]
        [Range(1, 26)]
        public int Rows { get; set; }

        [Required]
        [Range(1, 20)]
        public int Columns { get; set; }
    }

    public class BulkSeatStatusDTO
    {
        [Required]
        public List<Guid> SeatIds { get; set; } = new List<Guid>();

        [Required]
        public bool IsActive { get; set; }
    }

    public class BulkDeleteSeatsDTO
    {
        [Required]
        public List<Guid> SeatIds { get; set; } = new List<Guid>();
    }

    public class SeatStatsDTO
    {
        public int Total { get; set; }
    }
} 