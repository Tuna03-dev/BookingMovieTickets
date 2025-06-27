
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BookingMovieTickets.Models;

public partial class Movie : BaseEntity
{
    public Guid MovieId { get; set; }

    [Required, StringLength(255)]
    public string Title { get; set; } = null!;

    public string? Description { get; set; }

    [StringLength(100)]
    public string? Genre { get; set; }

    public int Duration { get; set; }

    public DateOnly? ReleaseDate { get; set; }


    [StringLength(255)]
    public string? PosterUrl { get; set; }

    [Required, StringLength(20)]
    public string Status { get; set; } = null!;
    [StringLength(100)]
    public string? Director { get; set; }

    public string? Actors { get; set; }

    public virtual ICollection<Showtime> Showtimes { get; set; } = new List<Showtime>();
}
