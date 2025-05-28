using System;
using System.Collections.Generic;

namespace BookingMovieTickets.Models;

public partial class Payment
{
    public Guid PaymentId { get; set; }

    public Guid BookingId { get; set; }

    public Guid? UserId { get; set; }

    public decimal Amount { get; set; }

    public string PaymentMethod { get; set; } = null!;

    public string PaymentStatus { get; set; } = null!;

    public string? TransactionId { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public DateTime? DeletedAt { get; set; }

    public virtual Booking Booking { get; set; } = null!;

    public virtual User? User { get; set; }
}
