using System;
using System.Collections.Generic;

namespace BookingMovieTickets.Models;

public partial class Notification
{
    public Guid NotificationId { get; set; }

    public Guid? UserId { get; set; }

    public string Title { get; set; } = null!;

    public string Content { get; set; } = null!;

    public string Type { get; set; } = null!;

    public string Status { get; set; } = null!;

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public DateTime? DeletedAt { get; set; }

    public virtual User? User { get; set; }
}
