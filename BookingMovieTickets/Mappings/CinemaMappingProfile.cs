using AutoMapper;
using BookingMovieTickets.DTOs;
using BookingMovieTickets.Models;

namespace BookingMovieTickets.Mappings
{
    public class CinemaMappingProfile : Profile
    {
        public CinemaMappingProfile()
        {
            CreateMap<Cinema, CreateCinemaDTO>().ReverseMap();
            CreateMap<Cinema, UpdateCinemaDTO>().ReverseMap();
            CreateMap<Cinema, CinemaResponseDTO>()
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.CreatedAt))
                .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => src.UpdatedAt))
                .ForMember(dest => dest.RoomCount, opt => opt.MapFrom(src => src.Rooms.Count));
        }
    }
}
