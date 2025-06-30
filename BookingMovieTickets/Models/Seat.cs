using BookingMovieTickets.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BookingMovieTickets.Models;

public partial class Seat : BaseEntity
{
    public Guid SeatId { get; set; }

    public Guid RoomId { get; set; }

    [Required, StringLength(1)]
    public string Row { get; set; } = null!;

    public int SeatColumn { get; set; }

    [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
    public string? SeatNumber { get; set; }

    [StringLength(20)]
    public string? SeatType { get; set; }

    public virtual Room Room { get; set; } = null!;

    public virtual ICollection<BookingSeat> BookingSeats { get; set; } = new List<BookingSeat>();
}
