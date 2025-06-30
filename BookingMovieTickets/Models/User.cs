using BookingMovieTickets.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BookingMovieTickets.Models;

public partial class User : IdentityUser<Guid>
{
    public User() : base()
    {
        Bookings = new List<Booking>();
        Notifications = new List<Notification>();
        Payments = new List<Payment>();
    }

    [Required, StringLength(255)]
    public override string Email
    {
        get => base.Email;
        set => base.Email = value;
    }

    [StringLength(100)]
    public string? FullName { get; set; }

    [StringLength(20)]
    public override string PhoneNumber
    {
        get => base.PhoneNumber;
        set => base.PhoneNumber = value;
    }

    [StringLength(255)]
    public string? Address { get; set; }

    [StringLength(255)]
    public string? ImageUrl { get; set; }

    public DateTime? DateOfBirth { get; set; }

    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }

    public virtual ICollection<Booking> Bookings { get; set; }
    public virtual ICollection<Notification> Notifications { get; set; }
    public virtual ICollection<Payment> Payments { get; set; }
}
