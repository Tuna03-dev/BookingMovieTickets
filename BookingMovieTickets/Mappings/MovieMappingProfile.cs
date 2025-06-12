using AutoMapper;
using BookingMovieTickets.Models;
using BookingMovieTickets.DTOs;

namespace BookingMovieTickets.Mappings
{
    public class MovieMappingProfile : Profile
    {
        public MovieMappingProfile()
        {
            //CreateMap<Movie, MovieDTO>()
            //    .ForMember(dest => dest.GenreName, opt => opt.MapFrom(src => src.Genre.Name))
            //    .ForMember(dest => dest.ReleaseDate, opt => opt.MapFrom(src => src.ReleaseDate.ToString("dd/MM/yyyy")));

            //CreateMap<MovieDTO, Movie>()
            //    .ForMember(dest => dest.Genre, opt => opt.Ignore())
            //    .ForMember(dest => dest.ReleaseDate, opt => opt.MapFrom(src => DateTime.Parse(src.ReleaseDate)));
        }
    }
} 