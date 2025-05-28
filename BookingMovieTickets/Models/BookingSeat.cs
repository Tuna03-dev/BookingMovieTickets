using BookingMovieTickets.Models;
using System;
using System.Collections.Generic;

namespace BookingMovieTickets.Models;

public partial class BookingSeat : BaseEntity
{
    public Guid BookingSeatId { get; set; }

    public Guid BookingId { get; set; }

    public Guid SeatId { get; set; }

    public virtual Booking Booking { get; set; } = null!;

    public virtual Seat Seat { get; set; } = null!;
}
