using BookingMovieTickets.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;

namespace BookingMovieTickets.Data
{
    public class BookingMovieTicketsContext : IdentityDbContext<User, IdentityRole<Guid>, Guid>
    {
        public BookingMovieTicketsContext(DbContextOptions<BookingMovieTicketsContext> options)
            : base(options)
        {
        }

        public DbSet<Movie> Movies { get; set; }
        public DbSet<Cinema> Cinemas { get; set; }
        public DbSet<Room> Rooms { get; set; }
        public DbSet<Seat> Seats { get; set; }
        public DbSet<Showtime> Showtimes { get; set; }
        public DbSet<Promotion> Promotions { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<BookingSeat> BookingSeats { get; set; }
        public DbSet<BookingQrCode> BookingQrCodes { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<Notification> Notifications { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure Identity table names
            modelBuilder.Entity<User>().ToTable("Users");
            modelBuilder.Entity<IdentityRole<Guid>>().ToTable("Roles");
            modelBuilder.Entity<IdentityUserRole<Guid>>().ToTable("UserRoles");
            modelBuilder.Entity<IdentityUserClaim<Guid>>().ToTable("UserClaims");
            modelBuilder.Entity<IdentityUserLogin<Guid>>().ToTable("UserLogins");
            modelBuilder.Entity<IdentityUserToken<Guid>>().ToTable("UserTokens");
            modelBuilder.Entity<IdentityRoleClaim<Guid>>().ToTable("RoleClaims");

            // Define primary keys
            modelBuilder.Entity<Movie>().HasKey(m => m.MovieId);
            modelBuilder.Entity<Cinema>().HasKey(c => c.CinemaId);
            modelBuilder.Entity<Room>().HasKey(r => r.RoomId);
            modelBuilder.Entity<Seat>().HasKey(s => s.SeatId);
            modelBuilder.Entity<Showtime>().HasKey(s => s.ShowtimeId);
            modelBuilder.Entity<Promotion>().HasKey(p => p.PromotionId);
            modelBuilder.Entity<Booking>().HasKey(b => b.BookingId);
            modelBuilder.Entity<BookingSeat>().HasKey(bs => bs.BookingSeatId);
            modelBuilder.Entity<BookingQrCode>().HasKey(bq => bq.QrCodeId);
            modelBuilder.Entity<Payment>().HasKey(p => p.PaymentId);
            modelBuilder.Entity<Notification>().HasKey(n => n.NotificationId);

            // Configure indexes
            modelBuilder.Entity<IdentityRole<Guid>>().HasIndex(r => r.Name).IsUnique();
            modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique();
            modelBuilder.Entity<Promotion>().HasIndex(p => p.Code).IsUnique();
            

            // Configure relationships
            modelBuilder.Entity<Room>()
                .HasOne(r => r.Cinema)
                .WithMany(c => c.Rooms)
                .HasForeignKey(r => r.CinemaId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Seat>()
                .HasOne(s => s.Room)
                .WithMany(r => r.Seats)
                .HasForeignKey(s => s.RoomId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Showtime>()
                .HasOne(s => s.Movie)
                .WithMany(m => m.Showtimes)
                .HasForeignKey(s => s.MovieId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Showtime>()
                .HasOne(s => s.Room)
                .WithMany(r => r.Showtimes)
                .HasForeignKey(s => s.RoomId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Booking>()
                .HasOne(b => b.User)
                .WithMany(u => u.Bookings)
                .HasForeignKey(b => b.UserId)
                .OnDelete(DeleteBehavior.SetNull);
            modelBuilder.Entity<Booking>()
                .HasOne(b => b.Showtime)
                .WithMany(s => s.Bookings)
                .HasForeignKey(b => b.ShowtimeId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Booking>()
                .HasOne(b => b.Promotion)
                .WithMany(p => p.Bookings)
                .HasForeignKey(b => b.PromotionId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<BookingSeat>()
                .HasOne(bs => bs.Booking)
                .WithMany(b => b.BookingSeats)
                .HasForeignKey(bs => bs.BookingId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<BookingSeat>()
                .HasOne(bs => bs.Seat)
                .WithMany(s => s.BookingSeats)
                .HasForeignKey(bs => bs.SeatId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Booking>()
                .HasOne(b => b.BookingQrCode)
                .WithOne(bq => bq.Booking)
                .HasForeignKey<BookingQrCode>(bq => bq.BookingId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Payment>()
                .HasOne(p => p.Booking)
                .WithMany(b => b.Payments)
                .HasForeignKey(p => p.BookingId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Payment>()
                .HasOne(p => p.User)
                .WithMany(u => u.Payments)
                .HasForeignKey(p => p.UserId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Notification>()
                .HasOne(n => n.User)
                .WithMany(u => u.Notifications)
                .HasForeignKey(n => n.UserId)
                .OnDelete(DeleteBehavior.SetNull);

            // Configure computed column
            modelBuilder.Entity<Seat>()
                .Property(s => s.SeatNumber)
                .HasComputedColumnSql("[Row] + CAST([SeatColumn] AS NVARCHAR(10))")
                .ValueGeneratedOnAddOrUpdate();

            // Configure default values
            modelBuilder.Entity<IdentityRole<Guid>>().Property(r => r.Name).HasDefaultValue("User");
            modelBuilder.Entity<Seat>().Property(s => s.SeatType).HasDefaultValue("standard");
            modelBuilder.Entity<Seat>().Property(s => s.IsAvailable).HasDefaultValue(true);
            modelBuilder.Entity<Movie>().Property(m => m.Status).HasDefaultValue("upcoming");
            modelBuilder.Entity<Promotion>().Property(p => p.IsActive).HasDefaultValue(true);
            modelBuilder.Entity<Booking>().Property(b => b.Status).HasDefaultValue("booked");
            modelBuilder.Entity<Payment>().Property(p => p.PaymentStatus).HasDefaultValue("pending");
            modelBuilder.Entity<Notification>().Property(n => n.Status).HasDefaultValue("pending");


            // Global Query Filters for Soft Delete
            modelBuilder.Entity<User>().HasQueryFilter(u => u.DeletedAt == null);
            modelBuilder.Entity<Movie>().HasQueryFilter(m => m.DeletedAt == null);
            modelBuilder.Entity<Cinema>().HasQueryFilter(c => c.DeletedAt == null);
            modelBuilder.Entity<Room>().HasQueryFilter(r => r.DeletedAt == null);
            modelBuilder.Entity<Seat>().HasQueryFilter(s => s.DeletedAt == null);
            modelBuilder.Entity<Showtime>().HasQueryFilter(s => s.DeletedAt == null);
            modelBuilder.Entity<Promotion>().HasQueryFilter(p => p.DeletedAt == null);
            modelBuilder.Entity<Booking>().HasQueryFilter(b => b.DeletedAt == null);
            modelBuilder.Entity<BookingSeat>().HasQueryFilter(bs => bs.DeletedAt == null);
            modelBuilder.Entity<BookingQrCode>().HasQueryFilter(bq => bq.DeletedAt == null);
            modelBuilder.Entity<Payment>().HasQueryFilter(p => p.DeletedAt == null);
            modelBuilder.Entity<Notification>().HasQueryFilter(n => n.DeletedAt == null);
            modelBuilder.Entity<TimeSlot>().HasQueryFilter(n => n.DeletedAt == null);
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            foreach (var entry in ChangeTracker.Entries<BaseEntity>())
            {

                switch (entry.State)
                {
                    case EntityState.Added:
                        entry.Entity.CreatedAt = DateTime.Now;
                        entry.Entity.UpdatedAt = DateTime.Now;
                        break;

                    case EntityState.Modified:
                        entry.Entity.UpdatedAt = DateTime.Now;
                        break;

                    case EntityState.Deleted:
                        entry.State = EntityState.Modified;
                        entry.Entity.DeletedAt = DateTime.Now;
                        break;
                }

            }

            return base.SaveChangesAsync(cancellationToken);
        }
    }
}