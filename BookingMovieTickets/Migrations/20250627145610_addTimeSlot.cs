using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BookingMovieTickets.Migrations
{
    /// <inheritdoc />
    public partial class addTimeSlot : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropCheckConstraint(
                name: "CK_Showtime_EndTime",
                table: "Showtimes"
            );

            migrationBuilder.DropColumn(
                name: "EndTime",
                table: "Showtimes");

            migrationBuilder.RenameColumn(
                name: "StartTime",
                table: "Showtimes",
                newName: "Date");

            migrationBuilder.AddColumn<Guid>(
                name: "TimeSlotId",
                table: "Showtimes",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateTable(
                name: "TimeSlot",
                columns: table => new
                {
                    TimeSlotId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    StartTime = table.Column<TimeSpan>(type: "time", nullable: false),
                    EndTime = table.Column<TimeSpan>(type: "time", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DeletedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TimeSlot", x => x.TimeSlotId);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Showtimes_TimeSlotId",
                table: "Showtimes",
                column: "TimeSlotId");

            migrationBuilder.AddForeignKey(
                name: "FK_Showtimes_TimeSlot_TimeSlotId",
                table: "Showtimes",
                column: "TimeSlotId",
                principalTable: "TimeSlot",
                principalColumn: "TimeSlotId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Showtimes_TimeSlot_TimeSlotId",
                table: "Showtimes");

            migrationBuilder.DropTable(
                name: "TimeSlot");

            migrationBuilder.DropIndex(
                name: "IX_Showtimes_TimeSlotId",
                table: "Showtimes");

            migrationBuilder.DropColumn(
                name: "TimeSlotId",
                table: "Showtimes");

            migrationBuilder.RenameColumn(
                name: "Date",
                table: "Showtimes",
                newName: "StartTime");

            migrationBuilder.AddColumn<DateTime>(
                name: "EndTime",
                table: "Showtimes",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddCheckConstraint(
                name: "CK_Showtime_EndTime",
                table: "Showtimes",
                sql: "[EndTime] > [StartTime]"
            );
        }
    }
}
