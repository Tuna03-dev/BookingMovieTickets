using BookingMovieTickets.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BookingMovieTickets.Models;

public partial class Booking : BaseEntity
{
    public Guid BookingId { get; set; }

    public Guid? UserId { get; set; }

    public Guid ShowtimeId { get; set; }

    public Guid? PromotionId { get; set; }

    [Column(TypeName = "decimal(10,2)")]
    public decimal TotalPrice { get; set; }

    [Required, StringLength(20)]
    public string Status { get; set; } = null!;

    public virtual Showtime Showtime { get; set; } = null!;

    public virtual User? User { get; set; }

    public virtual Promotion? Promotion { get; set; }

    public virtual ICollection<BookingSeat> BookingSeats { get; set; } = new List<BookingSeat>();

    public virtual BookingQrCode BookingQrCode { get; set; } = null!;

    public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();
}
