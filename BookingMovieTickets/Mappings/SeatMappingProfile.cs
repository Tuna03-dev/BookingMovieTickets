using AutoMapper;
using BookingMovieTickets.DTOs;
using BookingMovieTickets.Models;

namespace BookingMovieTickets.Mappings
{
    public class SeatMappingProfile : Profile
    {
        public SeatMappingProfile()
        {
            CreateMap<Seat, CreateSeatDTO>().ReverseMap();
            CreateMap<Seat, UpdateSeatDTO>().ReverseMap();
            CreateMap<Seat, SeatResponseDTO>()
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.CreatedAt))
                .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => src.UpdatedAt));
        }
    }
} 