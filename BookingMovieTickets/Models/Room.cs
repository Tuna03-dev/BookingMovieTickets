using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BookingMovieTickets.Models;

public partial class Room : BaseEntity
{
    public Guid RoomId { get; set; }

    public Guid CinemaId { get; set; }

    [Required, StringLength(10)]
    public string RoomNumber { get; set; } = null!;

    public int TotalSeats { get; set; }

    public virtual Cinema Cinema { get; set; } = null!;

    public virtual ICollection<Seat> Seats { get; set; } = new List<Seat>();

    public virtual ICollection<Showtime> Showtimes { get; set; } = new List<Showtime>();
}
