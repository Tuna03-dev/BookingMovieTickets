using AutoMapper;
using BookingMovieTickets.DTOs;

namespace BookingMovieTickets.Mappings
{
    public class CinemaMappingProfile : Profile
    {
        public CinemaMappingProfile()
        {
            CreateMap<Models.Cinema, CreateCinemaDTO>().ReverseMap();
            CreateMap<Models.Cinema, UpdateCinemaDTO>().ReverseMap();
            CreateMap<Models.Cinema, CinemaResponseDTO>()
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.CreatedAt))
                .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => src.UpdatedAt));
        }
    }
}
