using AutoMapper;
using BookingMovieTickets.Models;
using BookingMovieTickets.DTOs;
using BookingMovieTickets.DTOs.Responses;

namespace BookingMovieTickets.Mappings
{
    public class MovieMappingProfile : Profile
    {
        public MovieMappingProfile()
        {
            CreateMap<Movie, MovieResponseDTO>();
            CreateMap<Showtime, ShowtimeResponseDTO>()
                .ForMember(dest => dest.Cinema, opt => opt.MapFrom(src => src.Room.Cinema))
                .ForMember(dest => dest.RoomNumber, opt => opt.MapFrom(src => src.Room.RoomNumber));
            CreateMap<Cinema, CinemaResponseDTO>();
            //CreateMap<Movie, MovieDTO>()
            //    .ForMember(dest => dest.GenreName, opt => opt.MapFrom(src => src.Genre.Name))
            //    .ForMember(dest => dest.ReleaseDate, opt => opt.MapFrom(src => src.ReleaseDate.ToString("dd/MM/yyyy")));

            //CreateMap<MovieDTO, Movie>()
            //    .ForMember(dest => dest.Genre, opt => opt.Ignore())
            //    .ForMember(dest => dest.ReleaseDate, opt => opt.MapFrom(src => DateTime.Parse(src.ReleaseDate)));
        }
    }
} 