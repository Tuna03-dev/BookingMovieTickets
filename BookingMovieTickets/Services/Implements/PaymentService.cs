using BookingMovieTickets.DTOs;
using BookingMovieTickets.Models;
using BookingMovieTickets.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookingMovieTickets.Services.Implements
{
    public class PaymentService : IPaymentService
    {
        private readonly IBookingRepository _bookingRepository;
        private readonly IBookingSeatRepository _bookingSeatRepository;
        private readonly IPaymentRepository _paymentRepository;

        public PaymentService(
            IBookingRepository bookingRepository,
            IBookingSeatRepository bookingSeatRepository,
            IPaymentRepository paymentRepository)
        {
            _bookingRepository = bookingRepository;
            _bookingSeatRepository = bookingSeatRepository;
            _paymentRepository = paymentRepository;
        }

        public async Task<PaymentResponseDTO> ProcessPaymentAsync(PaymentRequestDTO request)
        {
            // 1. Kiểm tra ghế đã được đặt chưa
            var bookedSeats = await _bookingSeatRepository.GetBookedSeatsByShowtimeAsync(request.ShowtimeId, request.SelectedSeatIds);
            if (bookedSeats.Any())
            {
                throw new Exception("Một số ghế đã được đặt!");
            }

            // 2. Tạo Booking
            var booking = new Booking
            {
                BookingId = Guid.NewGuid(),
                UserId = request.UserId,
                ShowtimeId = request.ShowtimeId,
                PromotionId = null,
                TotalPrice = request.TotalPrice,
                Status = "booked"
            };
            await _bookingRepository.CreateBookingAsync(booking);

            // 3. Tạo BookingSeat
            var bookingSeats = request.SelectedSeatIds.Select(seatId => new BookingSeat
            {
                BookingSeatId = Guid.NewGuid(),
                BookingId = booking.BookingId,
                SeatId = seatId
            }).ToList();
            await _bookingSeatRepository.AddRangeAsync(bookingSeats);

            // 4. Tạo Payment
            var payment = new Payment
            {
                PaymentId = Guid.NewGuid(),
                BookingId = booking.BookingId,
                UserId = request.UserId,
                Amount = request.TotalPrice,
                PaymentMethod = request.PaymentMethod ?? "momo",
                PaymentStatus = "success",
                CreatedAt = DateTime.UtcNow
            };
            await _paymentRepository.CreatePaymentAsync(payment);

            return new PaymentResponseDTO
            {
                BookingId = booking.BookingId,
                PaymentId = payment.PaymentId,
                Message = "Thanh toán và đặt vé thành công!"
            };
        }

        public async Task<PaymentResponseDTO?> GetPaymentByIdAsync(Guid paymentId)
        {
            var payment = await _paymentRepository.GetPaymentByIdAsync(paymentId);
            if (payment == null) return null;
            return new PaymentResponseDTO
            {
                BookingId = payment.BookingId,
                PaymentId = payment.PaymentId,
                Message = "Thông tin thanh toán."
            };
        }

        public async Task<List<PaymentResponseDTO>> GetPaymentsByBookingIdAsync(Guid bookingId)
        {
            var payments = await _paymentRepository.GetPaymentsByBookingIdAsync(bookingId);
            return payments.Select(p => new PaymentResponseDTO
            {
                BookingId = p.BookingId,
                PaymentId = p.PaymentId,
                Message = "Thông tin thanh toán."
            }).ToList();
        }
    }
} 