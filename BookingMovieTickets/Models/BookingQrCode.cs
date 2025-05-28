using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookingMovieTickets.Models;

public class BookingQrCode : BaseEntity
{
    [Key]
    public Guid QrCodeId { get; set; }

    public Guid BookingId { get; set; }

    [Required]
    public string QrCodeData { get; set; } = null!;

    public DateTime GeneratedAt { get; set; }

    public DateTime? ExpiredAt { get; set; }

    [Required]
    public bool IsUsed { get; set; }

    public virtual Booking Booking { get; set; } = null!;
} 