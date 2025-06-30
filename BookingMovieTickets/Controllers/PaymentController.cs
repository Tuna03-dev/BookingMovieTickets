using Microsoft.AspNetCore.Mvc;
using BookingMovieTickets.DTOs;
using BookingMovieTickets.Services;
using System;
using System.Threading.Tasks;

namespace BookingMovieTickets.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentController : ControllerBase
    {
        private readonly IPaymentService _paymentService;

        public PaymentController(IPaymentService paymentService)
        {
            _paymentService = paymentService;
        }

        [HttpPost]
        public async Task<IActionResult> ProcessPayment([FromBody] PaymentRequestDTO request)
        {
            if (request == null || request.SelectedSeatIds == null || request.SelectedSeatIds.Count == 0)
            {
                return BadRequest(new { message = "Invalid booking or seat selection." });
            }

            try
            {
                var result = await _paymentService.ProcessPaymentAsync(request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Đã xảy ra lỗi khi thanh toán.", error = ex.Message });
            }
        }
    }

    
} 