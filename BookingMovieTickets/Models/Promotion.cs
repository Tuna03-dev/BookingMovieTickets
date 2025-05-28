using BookingMovieTickets.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BookingMovieTickets.Models;

public partial class Promotion : BaseEntity
{
    public Guid PromotionId { get; set; }

    [Required, StringLength(50)]
    public string Code { get; set; } = null!;

    public string? Description { get; set; }

    [Column(TypeName = "decimal(5,2)")]
    public decimal? DiscountPercentage { get; set; }

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    public bool? IsActive { get; set; }

    public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();
}