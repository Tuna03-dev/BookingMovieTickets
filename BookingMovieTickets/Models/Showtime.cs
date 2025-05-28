using BookingMovieTickets.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookingMovieTickets.Models;

public partial class Showtime : BaseEntity
{
    public Guid ShowtimeId { get; set; }

    public Guid MovieId { get; set; }

    public Guid RoomId { get; set; }

    public DateTime StartTime { get; set; }

    public DateTime EndTime { get; set; }

    [Column(TypeName = "decimal(10,2)")]
    public decimal TicketPrice { get; set; }

    public virtual Movie Movie { get; set; } = null!;

    public virtual Room Room { get; set; } = null!;

    public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();
}
