
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BookingMovieTickets.Models;

public partial class Cinema : BaseEntity
{
    public Guid CinemaId { get; set; }

    [Required, StringLength(100)]
    public string Name { get; set; } = null!;

    [Required, StringLength(255)]
    public string Address { get; set; } = null!;

    [StringLength(100)]
    public string? City { get; set; }

    public string? ImageUrl { get; set; }
    
    public virtual ICollection<Room> Rooms { get; set; } = new List<Room>();
}
